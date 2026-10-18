/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BANGLADESH_DISTRICTS,
  District,
  findClosestDistrict,
} from './utils/districtsData';
import {
  calculatePrayerTimes,
  getCurrentAndNextWaqt,
  getHijriDate,
  PrayerTimeConfig,
  DEFAULT_CONFIG,
  formatTimeBengali,
  toBengaliNumber,
} from './utils/prayerEngine';
import {
  SilentSettings,
  DEFAULT_SILENT_SETTINGS,
  checkSilentStatus,
  SilentStatus,
  triggerSilentVibration,
  sendSilentNotification,
  generatePrayerSilentICS,
  downloadICSFile,
} from './utils/autoSilentManager';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Header } from './components/Header';
import { SilentHeroBanner } from './components/SilentHeroBanner';
import { CurrentWaqtCard } from './components/CurrentWaqtCard';
import { PrayerTimesGrid } from './components/PrayerTimesGrid';
import { ForbiddenAndExtraTimes } from './components/ForbiddenAndExtraTimes';
import { LocationModal } from './components/LocationModal';
import { SilentSettingsModal } from './components/SilentSettingsModal';
import { DndGuideModal } from './components/DndGuideModal';
import { QiblaModal } from './components/QiblaModal';
import { DuasModal } from './components/DuasModal';
import { SilentActiveOverlay } from './components/SilentActiveOverlay';
import { InstallAppModal } from './components/InstallAppModal';
import { Wifi, WifiOff, ShieldCheck, Heart, Sparkles, Smartphone, Download } from 'lucide-react';


export default function App() {
  const isOnline = useOnlineStatus();
  const [now, setNow] = useState<Date>(new Date());

  // Location State
  const [currentDistrict, setCurrentDistrict] = useState<District>(() => {
    try {
      const saved = localStorage.getItem('salat_district');
      if (saved) return JSON.parse(saved);
    } catch {}
    return BANGLADESH_DISTRICTS[0]; // Dhaka default
  });

  const [isCustomGps, setIsCustomGps] = useState<boolean>(() => {
    return localStorage.getItem('salat_is_custom_gps') === 'true';
  });

  // Prayer Config & Hijri Adjustment
  const [prayerConfig, setPrayerConfig] = useState<PrayerTimeConfig>(() => {
    try {
      const saved = localStorage.getItem('salat_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CONFIG;
  });

  const [hijriAdjustment, setHijriAdjustment] = useState<number>(() => {
    const saved = localStorage.getItem('salat_hijri_adj');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Silent Settings State
  const [silentSettings, setSilentSettings] = useState<SilentSettings>(() => {
    try {
      const saved = localStorage.getItem('salat_silent_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SILENT_SETTINGS;
  });

  // Test Silent Mode Simulation
  const [isTestingSilent, setIsTestingSilent] = useState(false);
  const [testRemainingSeconds, setTestRemainingSeconds] = useState(30);

  // Modals state
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDndGuideOpen, setIsDndGuideOpen] = useState(false);
  const [isQiblaOpen, setIsQiblaOpen] = useState(false);
  const [isDuasOpen, setIsDuasOpen] = useState(false);
  const [isFullscreenSilentOpen, setIsFullscreenSilentOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);


  // Track previous silent state to trigger transitions (vibrations/notifications)
  const prevSilencedRef = useRef<boolean>(false);
  const prevPrayerNameRef = useRef<string | null>(null);

  // Real-time clock tick (1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute prayer times for current date and district
  const prayerTimes = useMemo(() => {
    return calculatePrayerTimes(now, currentDistrict.lat, currentDistrict.lng, prayerConfig);
  }, [now, currentDistrict.lat, currentDistrict.lng, prayerConfig]);

  // Compute Waqt info
  const waqtInfo = useMemo(() => {
    return getCurrentAndNextWaqt(prayerTimes, now);
  }, [prayerTimes, now]);

  // Compute Hijri Date
  const hijriDate = useMemo(() => {
    return getHijriDate(now, hijriAdjustment);
  }, [now, hijriAdjustment]);

  // Compute Silent Status
  const silentStatus: SilentStatus = useMemo(() => {
    if (isTestingSilent) {
      return {
        isSilenced: true,
        activePrayerId: 'dhuhr',
        activePrayerNameBn: 'পরীক্ষামূলক টেস্ট',
        startTime: new Date(),
        endTime: new Date(Date.now() + testRemainingSeconds * 1000),
        remainingSeconds: testRemainingSeconds,
        totalSeconds: 30,
        isOverridden: false,
      };
    }
    return checkSilentStatus(prayerTimes, silentSettings, now);
  }, [isTestingSilent, testRemainingSeconds, prayerTimes, silentSettings, now]);

  // Handle transition events (Entering / Exiting Silent Mode)
  useEffect(() => {
    const currentSilenced = silentStatus.isSilenced;
    const currentPrayer = silentStatus.activePrayerNameBn;

    if (currentSilenced && !prevSilencedRef.current) {
      // Just entered silent
      if (silentSettings.vibrateOnSilent) {
        triggerSilentVibration('enter');
      }
      if (silentSettings.notifyOnSilent && currentPrayer) {
        sendSilentNotification(currentPrayer, 'enter');
      }
    } else if (!currentSilenced && prevSilencedRef.current) {
      // Just exited silent
      if (silentSettings.vibrateOnSilent) {
        triggerSilentVibration('exit');
      }
      if (silentSettings.notifyOnSilent && prevPrayerNameRef.current) {
        sendSilentNotification(prevPrayerNameRef.current, 'exit');
      }
    }

    prevSilencedRef.current = currentSilenced;
    prevPrayerNameRef.current = currentPrayer;
  }, [silentStatus.isSilenced, silentStatus.activePrayerNameBn, silentSettings.vibrateOnSilent, silentSettings.notifyOnSilent]);

  // Handle Test Silent countdown
  useEffect(() => {
    let interval: any = null;
    if (isTestingSilent) {
      interval = setInterval(() => {
        setTestRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsTestingSilent(false);
            if (silentSettings.vibrateOnSilent) {
              triggerSilentVibration('exit');
            }
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTestingSilent, silentSettings.vibrateOnSilent]);

  // Automatically check GPS on first load if online and permitted
  useEffect(() => {
    if (isOnline && !localStorage.getItem('salat_district') && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const closest = findClosestDistrict(pos.coords.latitude, pos.coords.longitude);
          const gpsDistrict: District = {
            id: 'custom-gps',
            nameBn: `${closest.nameBn} (জিপিএস)`,
            nameEn: `${closest.nameEn} (GPS)`,
            divisionBn: closest.divisionBn,
            divisionEn: closest.divisionEn,
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
          };
          setCurrentDistrict(gpsDistrict);
          setIsCustomGps(true);
          try {
            localStorage.setItem('salat_district', JSON.stringify(gpsDistrict));
            localStorage.setItem('salat_is_custom_gps', 'true');
          } catch {}
        },
        () => {},
        { timeout: 8000 }
      );
    }
  }, [isOnline]);

  // Handlers for Location, Settings, and Calendar Export
  const handleSelectDistrict = (d: District, isGps = false) => {
    setCurrentDistrict(d);
    setIsCustomGps(isGps);
    try {
      localStorage.setItem('salat_district', JSON.stringify(d));
      localStorage.setItem('salat_is_custom_gps', isGps ? 'true' : 'false');
    } catch {}
  };

  const handleSaveSettings = (newSettings: SilentSettings) => {
    setSilentSettings(newSettings);
    try {
      localStorage.setItem('salat_silent_settings', JSON.stringify(newSettings));
    } catch {}
  };

  const handleSavePrayerConfig = (newConfig: PrayerTimeConfig) => {
    setPrayerConfig(newConfig);
    try {
      localStorage.setItem('salat_config', JSON.stringify(newConfig));
    } catch {}
  };

  const handleSaveHijriAdjustment = (adj: number) => {
    setHijriAdjustment(adj);
    try {
      localStorage.setItem('salat_hijri_adj', String(adj));
    } catch {}
  };

  const handleEmergencyUnmute = () => {
    const unmuteUntil = Date.now() + 45 * 60 * 1000;
    const updated = { ...silentSettings, overrideUntil: unmuteUntil };
    setSilentSettings(updated);
    setIsTestingSilent(false);
    try {
      localStorage.setItem('salat_silent_settings', JSON.stringify(updated));
    } catch {}
    if (silentSettings.vibrateOnSilent) {
      triggerSilentVibration('exit');
    }
  };

  const handleTestSilentMode = () => {
    if (silentSettings.vibrateOnSilent) {
      triggerSilentVibration('enter');
    }
    setTestRemainingSeconds(30);
    setIsTestingSilent(true);
  };

  const handleExportCalendar = () => {
    const icsContent = generatePrayerSilentICS(
      new Date(),
      30, // 30 days ahead
      currentDistrict.lat,
      currentDistrict.lng,
      silentSettings,
      (date, lat, lng) => calculatePrayerTimes(date, lat, lng, prayerConfig)
    );
    downloadICSFile(icsContent, `namaz_silent_${currentDistrict.nameEn.toLowerCase()}_30days.ics`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-950 to-emerald-950 text-slate-100 flex flex-col font-sans">
      {/* Sticky App Header */}
      <Header
        currentDistrict={currentDistrict}
        isCustomGps={isCustomGps}
        onOpenLocationModal={() => setIsLocationOpen(true)}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
        onOpenQiblaModal={() => setIsQiblaOpen(true)}
        onOpenDuasModal={() => setIsDuasOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        isOnline={isOnline}
        hijriDay={hijriDate.day}
        hijriMonthBn={hijriDate.monthNameBn}
        hijriYear={hijriDate.year}
        isSilenced={silentStatus.isSilenced}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Offline / Online Status Badge */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-900/30 border border-emerald-800/40 text-xs text-emerald-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-emerald-200">
              ১০০% অফলাইনে প্রস্তুত
            </span>
            <span className="text-emerald-400/70 hidden sm:inline">
              — কোনো ইন্টারনেট ছাড়াই সারাবছর সঠিক নামাজের সময় হিসাব করবে
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-400/90">
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-300">
                <Wifi className="w-3 h-3 text-emerald-400" /> ডাটা চালু (GPS সক্রিয়)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-300/80">
                <WifiOff className="w-3 h-3" /> অফলাইন মোড
              </span>
            )}
          </div>
        </div>

        {/* Quick Phone Install Prompt Banner */}
        <div className="rounded-2xl p-3.5 sm:p-4 bg-gradient-to-r from-amber-500/15 via-emerald-900/50 to-emerald-950 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400 text-emerald-950 shadow-sm shrink-0">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>ফোনে অ্যাপটি ইনস্টল করে রাখুন</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.5 rounded-full font-semibold">
                  ১০০% অফলাইন
                </span>
              </h3>
              <p className="text-[11px] text-emerald-200/90 mt-0.5">
                মোবাইলের হোম স্ক্রিনে যুক্ত করলে কোনো ইন্টারনেট ছাড়াই সরাসরি অ্যাপের মতো ব্যবহার করতে পারবেন।
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer active:scale-95 shrink-0"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>ইনস্টল গাইড ও QR কোড</span>
          </button>
        </div>


        {/* Hero Auto Silent Status Banner */}
        <SilentHeroBanner
          silentStatus={silentStatus}
          silentEnabled={silentSettings.enabled}
          nextPrayerNameBn={waqtInfo.nextWaqt.nameBn}
          nextPrayerSilentTimeStr={formatTimeBengali(waqtInfo.nextWaqt.time)}
          onEmergencyUnmute={handleEmergencyUnmute}
          onTestSilentMode={handleTestSilentMode}
          isTestingSilent={isTestingSilent}
          onOpenFullscreenSilent={() => setIsFullscreenSilentOpen(true)}
          onOpenDndGuide={() => setIsDndGuideOpen(true)}
        />

        {/* Current Active Waqt and Countdown Clock */}
        <CurrentWaqtCard
          currentWaqt={waqtInfo.currentWaqt}
          nextWaqt={waqtInfo.nextWaqt}
          remainingHours={waqtInfo.remainingHours}
          remainingMinutes={waqtInfo.remainingMinutes}
          remainingSeconds={waqtInfo.remainingSeconds}
          currentTime={now}
        />

        {/* 5 Waqt Prayer Times Grid */}
        <PrayerTimesGrid
          prayers={waqtInfo.allList}
          currentWaqtId={waqtInfo.currentWaqt.id}
          nextWaqtId={waqtInfo.nextWaqt.id}
          silentSettings={silentSettings}
          isSilenced={silentStatus.isSilenced}
          onSelectPrayerSettings={() => setIsSettingsOpen(true)}
        />

        {/* Extra and Forbidden Times Accordion */}
        <ForbiddenAndExtraTimes prayerTimes={prayerTimes} />

        {/* Info card regarding Auto Silent automation */}
        <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-emerald-950 via-emerald-900/40 to-emerald-950 border border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              অ্যান্ড্রয়েড ফোনে ১০০% অটো সাইলেন্ট করতে চান?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              অ্যাপটির ১ মাসের শিডিউল সরাসরি ফোনের ক্যালেন্ডারে যুক্ত করে নিলে Android Do Not Disturb স্বয়ংক্রিয়ভাবে নামাজের সময় ফোন নিঃশব্দ করে দেবে।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDndGuideOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-600/50 text-white text-xs font-semibold transition cursor-pointer"
            >
              নিয়ম দেখুন
            </button>
            <button
              onClick={handleExportCalendar}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              ক্যালেন্ডার ডাউনলোড
            </button>
          </div>
        </div>
      </main>

      {/* App Footer */}
      <footer className="mt-8 border-t border-emerald-900/60 bg-emerald-950/80 py-4 px-3 sm:px-6 text-center text-xs text-emerald-400/80 space-y-1">
        <p>
          নামাজ সাইলেন্টার • ইসলামিক ফাউন্ডেশন বাংলাদেশ ও আন্তর্জাতিক জ্যোতির্বৈজ্ঞানিক মান অনুযায়ী প্রস্তুত
        </p>
        <p className="text-[11px] text-emerald-500/60">
          ১০০% অফলাইনে ব্যবহারের জন্য ব্রাউজার থেকে &lsquo;Install App&rsquo; করে নিন।
        </p>
      </footer>

      {/* Modals */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        currentDistrict={currentDistrict}
        onSelectDistrict={handleSelectDistrict}
        isOnline={isOnline}
      />

      <SilentSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={silentSettings}
        onSaveSettings={handleSaveSettings}
        prayerConfig={prayerConfig}
        onSavePrayerConfig={handleSavePrayerConfig}
        hijriAdjustment={hijriAdjustment}
        onSaveHijriAdjustment={handleSaveHijriAdjustment}
        onExportCalendar={handleExportCalendar}
        onTestSilent={handleTestSilentMode}
      />

      <DndGuideModal
        isOpen={isDndGuideOpen}
        onClose={() => setIsDndGuideOpen(false)}
        onExportCalendar={handleExportCalendar}
      />

      <QiblaModal
        isOpen={isQiblaOpen}
        onClose={() => setIsQiblaOpen(false)}
        district={currentDistrict}
      />

      <DuasModal
        isOpen={isDuasOpen}
        onClose={() => setIsDuasOpen(false)}
      />

      {/* Fullscreen Ibadah Silent Overlay */}
      <SilentActiveOverlay
        isOpen={isFullscreenSilentOpen}
        onClose={() => setIsFullscreenSilentOpen(false)}
        prayerNameBn={silentStatus.activePrayerNameBn || 'নামাজ'}
        remainingSeconds={silentStatus.remainingSeconds}
        totalSeconds={silentStatus.totalSeconds}
        onEmergencyUnmute={handleEmergencyUnmute}
      />

      {/* Phone Install Modal with QR Code and Step by Step Instructions */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
