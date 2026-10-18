import React from 'react';
import {
  X,
  VolumeX,
  Vibrate,
  Bell,
  Calendar,
  Sparkles,
  Smartphone,
  Save,
  RotateCcw,
  Sliders,
  Play,
  Download,
} from 'lucide-react';
import { SilentSettings, DEFAULT_SILENT_SETTINGS, PRAYER_NAMES_BN } from '../utils/autoSilentManager';
import { toBengaliNumber, PrayerTimeConfig } from '../utils/prayerEngine';

interface SilentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SilentSettings;
  onSaveSettings: (newSettings: SilentSettings) => void;
  prayerConfig: PrayerTimeConfig;
  onSavePrayerConfig: (newConfig: PrayerTimeConfig) => void;
  hijriAdjustment: number;
  onSaveHijriAdjustment: (adj: number) => void;
  onExportCalendar: () => void;
  onTestSilent: () => void;
}

export const SilentSettingsModal: React.FC<SilentSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  prayerConfig,
  onSavePrayerConfig,
  hijriAdjustment,
  onSaveHijriAdjustment,
  onExportCalendar,
  onTestSilent,
}) => {
  const [localSettings, setLocalSettings] = React.useState<SilentSettings>(settings);
  const [localConfig, setLocalConfig] = React.useState<PrayerTimeConfig>(prayerConfig);
  const [localHijriAdj, setLocalHijriAdj] = React.useState<number>(hijriAdjustment);

  React.useEffect(() => {
    setLocalSettings(settings);
    setLocalConfig(prayerConfig);
    setLocalHijriAdj(hijriAdjustment);
  }, [settings, prayerConfig, hijriAdjustment, isOpen]);

  if (!isOpen) return null;

  const handleDurationChange = (prayerKey: keyof typeof localSettings.durations, value: number) => {
    setLocalSettings((prev) => ({
      ...prev,
      durations: {
        ...prev.durations,
        [prayerKey]: Math.max(5, Math.min(90, value)),
      },
    }));
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onSavePrayerConfig(localConfig);
    onSaveHijriAdjustment(localHijriAdj);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SILENT_SETTINGS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-lg rounded-2xl bg-emerald-950 border border-emerald-700/80 shadow-2xl flex flex-col max-h-[90vh] text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                স্বয়ংক্রিয় সাইলেন্টার সেটিংস
              </h3>
              <p className="text-xs text-emerald-300/80">
                ৫ ওয়াক্তের নীরবতার সময়কাল ও নোটিফিকেশন কাস্টমাইজ করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-800/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs sm:text-sm">
          {/* Master Toggle */}
          <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-800/70 text-amber-400">
                <VolumeX className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">স্বয়ংক্রিয় সাইলেন্টার সক্রিয় রাখুন</span>
                <span className="text-[11px] text-emerald-300/80">
                  ওয়াক্তের সময় অটো সাইলেন্ট ও নামাজ শেষে আনসাইলেন্ট
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.enabled}
                onChange={(e) => setLocalSettings((prev) => ({ ...prev, enabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-emerald-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Per Prayer Silent Durations */}
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2.5">
              প্রতি ওয়াক্তে সাইলেন্ট থাকার সময়সীমা (মিনিট)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((key) => (
                <div
                  key={key}
                  className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-800/60 flex items-center justify-between"
                >
                  <span className="font-semibold text-white">{PRAYER_NAMES_BN[key]} নামাজ</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDurationChange(key, localSettings.durations[key] - 5)}
                      className="w-7 h-7 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-amber-300">
                      {toBengaliNumber(localSettings.durations[key])} মি.
                    </span>
                    <button
                      onClick={() => handleDurationChange(key, localSettings.durations[key] + 5)}
                      className="w-7 h-7 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-Prayer Buffer */}
          <div className="p-3.5 rounded-xl bg-emerald-900/30 border border-emerald-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">আজানের কত পূর্বে সাইলেন্ট শুরু হবে?</span>
              <span className="font-bold text-amber-300">
                {toBengaliNumber(localSettings.prePrayerBufferMinutes)} মিনিট পূর্বে
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={localSettings.prePrayerBufferMinutes}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  prePrayerBufferMinutes: parseInt(e.target.value, 10),
                }))
              }
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-emerald-400/80">
              <span>০ মিনিট (আজানের সাথে সাথে)</span>
              <span>৫ মিনিট পূর্বে</span>
            </div>
          </div>

          {/* Vibration and Notification switches */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              অ্যালার্ট ও ভাইব্রেশন পছন্দ
            </h4>

            {/* Vibrate */}
            <div className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vibrate className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">সাইলেন্ট শুরু ও শেষে হালকা ভাইব্রেশন</span>
              </div>
              <input
                type="checkbox"
                checked={localSettings.vibrateOnSilent}
                onChange={(e) =>
                  setLocalSettings((prev) => ({ ...prev, vibrateOnSilent: e.target.checked }))
                }
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Notifications */}
            <div className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">স্ক্রিনে সাইলেন্ট নোটিফিকেশন বার্তা</span>
              </div>
              <input
                type="checkbox"
                checked={localSettings.notifyOnSilent}
                onChange={(e) => {
                  const val = e.target.checked;
                  if (val && typeof window !== 'undefined' && 'Notification' in window) {
                    Notification.requestPermission();
                  }
                  setLocalSettings((prev) => ({ ...prev, notifyOnSilent: val }));
                }}
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Asr Juristic Method & Hijri adjust */}
          <div className="p-3.5 rounded-xl bg-emerald-900/30 border border-emerald-800/60 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              নামাজের হিসাব পদ্ধতি
            </h4>

            <div className="flex items-center justify-between">
              <span className="text-slate-200">আসর নামাজের মাযহাব:</span>
              <div className="flex rounded-lg bg-emerald-950 p-1 border border-emerald-800">
                <button
                  type="button"
                  onClick={() => setLocalConfig((prev) => ({ ...prev, asrMethod: 'hanafi' }))}
                  className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                    localConfig.asrMethod === 'hanafi'
                      ? 'bg-amber-400 text-emerald-950 font-bold'
                      : 'text-emerald-300'
                  }`}
                >
                  হানাফী (বাংলাদেশ মান)
                </button>
                <button
                  type="button"
                  onClick={() => setLocalConfig((prev) => ({ ...prev, asrMethod: 'standard' }))}
                  className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                    localConfig.asrMethod === 'standard'
                      ? 'bg-amber-400 text-emerald-950 font-bold'
                      : 'text-emerald-300'
                  }`}
                >
                  শাফেয়ী / হাম্বলী
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-200">হিজরি তারিখ সমন্বয়:</span>
              <div className="flex items-center gap-2">
                {[-1, 0, 1].map((adj) => (
                  <button
                    key={adj}
                    type="button"
                    onClick={() => setLocalHijriAdj(adj)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                      localHijriAdj === adj
                        ? 'bg-amber-400 text-emerald-950'
                        : 'bg-emerald-800 text-emerald-300'
                    }`}
                  >
                    {adj > 0 ? `+${toBengaliNumber(adj)}` : toBengaliNumber(adj)} দিন
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Export for Auto DND */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-900/70 to-teal-900/70 border border-emerald-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                ফোনের ক্যালেন্ডারে ১ মাসের শিডিউল নিন
              </span>
              <p className="text-[11px] text-emerald-200/80 mt-0.5">
                Android / iPhone ক্যালেন্ডারে স্বয়ংক্রিয় Do Not Disturb ট্র্রিগার করবে
              </p>
            </div>

            <button
              onClick={onExportCalendar}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold shadow-md transition cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.ICS ডাউনলোড</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-emerald-800/60 flex items-center justify-between bg-emerald-950">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-emerald-400 hover:text-emerald-200 hover:bg-emerald-900/60 text-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ডিফল্ট রিস্টোর</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-medium transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
