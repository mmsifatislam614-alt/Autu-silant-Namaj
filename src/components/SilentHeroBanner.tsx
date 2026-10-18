import React from 'react';
import { BellOff, BellRing, VolumeX, ShieldCheck, Play, RotateCcw, Smartphone, Maximize2 } from 'lucide-react';
import { SilentStatus } from '../utils/autoSilentManager';
import { toBengaliNumber } from '../utils/prayerEngine';

interface SilentHeroBannerProps {
  silentStatus: SilentStatus;
  silentEnabled: boolean;
  nextPrayerNameBn: string;
  nextPrayerSilentTimeStr: string;
  onEmergencyUnmute: () => void;
  onTestSilentMode: () => void;
  isTestingSilent: boolean;
  onOpenFullscreenSilent: () => void;
  onOpenDndGuide: () => void;
}

export const SilentHeroBanner: React.FC<SilentHeroBannerProps> = ({
  silentStatus,
  silentEnabled,
  nextPrayerNameBn,
  nextPrayerSilentTimeStr,
  onEmergencyUnmute,
  onTestSilentMode,
  isTestingSilent,
  onOpenFullscreenSilent,
  onOpenDndGuide,
}) => {
  const isSilenced = silentStatus.isSilenced || isTestingSilent;
  const prayerName = isTestingSilent ? 'পরীক্ষামূলক টেস্ট' : silentStatus.activePrayerNameBn || '';

  const minutesRemaining = Math.floor(silentStatus.remainingSeconds / 60);
  const secondsRemaining = silentStatus.remainingSeconds % 60;

  return (
    <div className="relative overflow-hidden rounded-2xl border transition-all duration-300 shadow-xl">
      {isSilenced ? (
        /* ACTIVE SILENT BANNER */
        <div className="bg-gradient-to-br from-amber-950/90 via-emerald-950 to-emerald-900 border-amber-500/50 p-4 sm:p-5 text-white relative">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shadow-inner flex items-center justify-center shrink-0 animate-pulse">
                <VolumeX className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-emerald-950">
                    🔕 সাইলেন্ট মোড সক্রিয়
                  </span>
                  <span className="text-xs text-amber-200/90">
                    {prayerName} ওয়াক্ত চলছে
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  নামাজের সময় - ফোন নীরব মোডে রয়েছে
                </h2>

                <p className="text-xs text-amber-100/80 mt-0.5">
                  বাকি সময়:{' '}
                  <span className="font-bold text-amber-300 text-sm">
                    {toBengaliNumber(minutesRemaining)} মিনিট {toBengaliNumber(secondsRemaining)} সেকেন্ড
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenFullscreenSilent}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-medium border border-emerald-600/50 shadow-sm transition cursor-pointer"
                title="ফুলস্ক্রিন ইবাদত মোড"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                <span>ইবাদত স্ক্রিন</span>
              </button>

              <button
                onClick={onEmergencyUnmute}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer active:scale-95"
                title="জরুরি প্রয়োজনে সাউন্ড চালু করুন"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>আনসাইলেন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STANDBY BANNER */
        <div className="bg-gradient-to-br from-emerald-900/80 via-emerald-950 to-slate-900 border-emerald-800/60 p-4 sm:p-5 text-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-800/50 border border-emerald-700/50 text-emerald-300 shrink-0">
                <BellOff className="w-5 h-5 text-emerald-400" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    অটো সাইলেন্টার প্রস্তুত
                  </span>
                  {!silentEnabled && (
                    <span className="text-[10px] bg-red-900/60 text-red-300 px-1.5 py-0.5 rounded border border-red-700">
                      নিষ্ক্রিয়
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-200 mt-0.5 font-medium">
                  পরবর্তী ওয়াক্তে (
                  <span className="text-amber-300 font-semibold">{nextPrayerNameBn}</span>
                  ) নামাজের সময় ফোন স্বয়ংক্রিয় সাইলেন্ট হবে
                </p>
              </div>
            </div>

            {/* Test Button & DND Guide */}
            <div className="flex items-center gap-2 pt-1 sm:pt-0">
              <button
                onClick={onTestSilentMode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-700/80 border border-emerald-700/60 text-emerald-200 text-xs font-medium transition cursor-pointer active:scale-95"
                title="সাইলেন্ট মোড পরীক্ষা করুন"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>সাইলেন্ট টেস্ট</span>
              </button>

              <button
                onClick={onOpenDndGuide}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/40 text-emerald-300 text-xs font-medium transition cursor-pointer"
                title="অ্যান্ড্রয়েড অটো সাইলেন্ট গাইড"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>ফোন সেটিংস গাইড</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
