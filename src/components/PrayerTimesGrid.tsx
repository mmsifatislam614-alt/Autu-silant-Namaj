import React from 'react';
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Clock,
  Volume2,
  VolumeX,
  CheckCircle2,
  Radio,
  Flame,
} from 'lucide-react';
import { WaqtInfo, formatTimeBengali, toBengaliNumber } from '../utils/prayerEngine';
import { SilentSettings } from '../utils/autoSilentManager';
import { playPrayerChime } from '../utils/audioAlert';

interface PrayerTimesGridProps {
  prayers: WaqtInfo[];
  currentWaqtId: string;
  nextWaqtId: string;
  silentSettings: SilentSettings;
  isSilenced: boolean;
  onSelectPrayerSettings: (prayerId: string) => void;
}

export const PrayerTimesGrid: React.FC<PrayerTimesGridProps> = ({
  prayers,
  currentWaqtId,
  nextWaqtId,
  silentSettings,
  isSilenced,
  onSelectPrayerSettings,
}) => {
  const getWaqtIcon = (id: string, isCurrent: boolean) => {
    const className = `w-5 h-5 ${isCurrent ? 'text-amber-300' : 'text-emerald-400'}`;
    switch (id) {
      case 'fajr':
        return <Sunrise className={className} />;
      case 'sunrise':
        return <Sun className={className} />;
      case 'dhuhr':
        return <Sun className={className} />;
      case 'asr':
        return <Sunset className={className} />;
      case 'maghrib':
        return <Sunset className={className} />;
      case 'isha':
        return <Moon className={className} />;
      default:
        return <Clock className={className} />;
    }
  };

  const handleTestChime = (e: React.MouseEvent, prayerName: string) => {
    e.stopPropagation();
    playPrayerChime(isSilenced);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span>৫ ওয়াক্ত নামাজের পূর্ণ সময়সূচি</span>
        </h2>
        <span className="text-xs text-emerald-300/80">
          প্রতি ওয়াক্তে নির্দিষ্ট সময় ফোন সাইলেন্ট থাকবে
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {prayers.map((prayer) => {
          const isCurrent = currentWaqtId === prayer.id;
          const isNext = nextWaqtId === prayer.id;
          const isPrayer = prayer.isPrayer;

          const silentDuration =
            isPrayer && prayer.id in silentSettings.durations
              ? silentSettings.durations[prayer.id as keyof typeof silentSettings.durations]
              : 0;

          return (
            <div
              key={prayer.id}
              onClick={() => isPrayer && onSelectPrayerSettings(prayer.id)}
              className={`group relative rounded-xl p-4 transition-all duration-200 border cursor-pointer select-none ${
                isCurrent
                  ? 'bg-gradient-to-br from-emerald-800/90 to-emerald-950 border-amber-400/80 shadow-lg shadow-emerald-950/40 ring-1 ring-amber-400/40 scale-[1.01]'
                  : isNext
                  ? 'bg-emerald-900/50 hover:bg-emerald-900/70 border-emerald-600/70'
                  : 'bg-emerald-950/60 hover:bg-emerald-900/40 border-emerald-800/60'
              }`}
            >
              {/* Top Row: Icon, Names & Calligraphy */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl ${
                      isCurrent
                        ? 'bg-amber-400/20 border border-amber-400/40'
                        : 'bg-emerald-800/50 border border-emerald-700/50'
                    }`}
                  >
                    {getWaqtIcon(prayer.id, isCurrent)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {prayer.nameBn}
                    </h3>
                    <p className="text-[11px] text-emerald-300/70 font-medium">
                      {prayer.nameEn}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-arabic text-xl text-amber-200/80 font-semibold block leading-tight">
                    {prayer.nameAr}
                  </span>
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-1.5 py-0.5 rounded-full mt-1">
                      <Radio className="w-2.5 h-2.5 animate-pulse text-amber-400" />
                      চলছে
                    </span>
                  ) : isNext ? (
                    <span className="inline-flex items-center text-[10px] font-semibold text-emerald-300 bg-emerald-800/80 border border-emerald-600 px-1.5 py-0.5 rounded-full mt-1">
                      পরবর্তী
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Middle Row: Waqt Start Time */}
              <div className="mt-3.5 flex items-baseline justify-between border-t border-emerald-800/50 pt-2.5">
                <div className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
                  {formatTimeBengali(prayer.time)}
                </div>

                {isPrayer && (
                  <button
                    onClick={(e) => handleTestChime(e, prayer.nameBn)}
                    className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/50 text-emerald-300 transition"
                    title={isSilenced ? 'ফোন সাইলেন্ট থাকায় শব্দ হবে না' : 'টেস্ট সুর বাজান'}
                  >
                    {isSilenced ? (
                      <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
                    )}
                  </button>
                )}
              </div>

              {/* Bottom Row: Silent Duration Badge or Sunrise warning */}
              <div className="mt-2.5 flex items-center justify-between text-xs">
                {isPrayer ? (
                  <div className="flex items-center gap-1 text-[11px] text-emerald-300/90 bg-emerald-900/40 px-2 py-0.5 rounded-md border border-emerald-800/60">
                    <span className="text-amber-400">🔕</span>
                    <span>
                      অটো সাইলেন্ট:{' '}
                      <strong className="text-amber-300">
                        {toBengaliNumber(silentDuration)} মিনিট
                      </strong>
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] text-amber-300/80 bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-800/40">
                    ⚠️ এরপর নফল নামাজ নিষিদ্ধ
                  </div>
                )}

                <div className="text-[10px] text-emerald-400/60 group-hover:text-emerald-300 transition">
                  {isPrayer ? 'ক্লিক করে সময় বদলান' : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
