import React from 'react';
import {
  MapPin,
  Settings,
  Compass,
  BookOpen,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { District } from '../utils/districtsData';
import { toBengaliNumber } from '../utils/prayerEngine';

interface HeaderProps {
  currentDistrict: District;
  isCustomGps: boolean;
  onOpenLocationModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenQiblaModal: () => void;
  onOpenDuasModal: () => void;
  onOpenInstallModal: () => void;
  isOnline: boolean;
  hijriDay: number;
  hijriMonthBn: string;
  hijriYear: number;
  isSilenced: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentDistrict,
  isCustomGps,
  onOpenLocationModal,
  onOpenSettingsModal,
  onOpenQiblaModal,
  onOpenDuasModal,
  onOpenInstallModal,
  isOnline,
  hijriDay,
  hijriMonthBn,
  hijriYear,
  isSilenced,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-emerald-950/90 backdrop-blur-md border-b border-emerald-800/40 px-3 sm:px-6 py-2.5 sm:py-3 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and App Title */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-800 to-emerald-900 border border-emerald-500/30 flex items-center justify-center shadow-md shadow-emerald-950/50">
              <span className="text-xl">🕌</span>
            </div>
            {isSilenced && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-emerald-950"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                নামাজ সাইলেন্টার
              </h1>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-800/80 text-emerald-200 border border-emerald-700/50">
                অফলাইন
              </span>
            </div>
            <div className="text-[11px] text-emerald-300/80 flex items-center gap-1.5">
              <span>{toBengaliNumber(hijriDay)} {hijriMonthBn}, {toBengaliNumber(hijriYear)} হিজরি</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Location Button */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Location selector */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800/90 border border-emerald-700/60 text-emerald-200 text-xs font-medium transition cursor-pointer active:scale-95"
            title="লোকেশন পরিবর্তন করুন"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="max-w-[85px] sm:max-w-[120px] truncate">
              {isCustomGps ? 'অটো জিপিএস' : currentDistrict.nameBn}
            </span>
          </button>

          {/* Duas Button */}
          <button
            onClick={onOpenDuasModal}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/40 text-emerald-200 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
            title="নামাজের জরুরি দোয়া সমূহ"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">দোয়া</span>
          </button>

          {/* Qibla Button */}
          <button
            onClick={onOpenQiblaModal}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/40 text-emerald-200 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
            title="ক্বিবলা দিক নির্ণয়"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">ক্বিবলা</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettingsModal}
            className="p-1.5 sm:p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/40 text-emerald-200 transition cursor-pointer"
            title="সাইলেন্টার সেটিংস"
          >
            <Settings className="w-4 h-4 text-emerald-300" />
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton onOpenInstallModal={onOpenInstallModal} />
        </div>
      </div>
    </header>
  );
};
