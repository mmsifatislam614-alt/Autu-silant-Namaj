import React from 'react';
import { Clock, Hourglass, Sparkles, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { WaqtInfo, toBengaliNumber, formatTimeBengali } from '../utils/prayerEngine';

interface CurrentWaqtCardProps {
  currentWaqt: WaqtInfo;
  nextWaqt: WaqtInfo;
  remainingHours: number;
  remainingMinutes: number;
  remainingSeconds: number;
  currentTime: Date;
}

export const CurrentWaqtCard: React.FC<CurrentWaqtCardProps> = ({
  currentWaqt,
  nextWaqt,
  remainingHours,
  remainingMinutes,
  remainingSeconds,
  currentTime,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'fajr':
        return <Sunrise className="w-6 h-6 text-amber-300" />;
      case 'sunrise':
        return <Sun className="w-6 h-6 text-amber-400" />;
      case 'dhuhr':
        return <Sun className="w-6 h-6 text-yellow-300" />;
      case 'asr':
        return <Sunset className="w-6 h-6 text-orange-300" />;
      case 'maghrib':
        return <Sunset className="w-6 h-6 text-amber-400" />;
      case 'isha':
        return <Moon className="w-6 h-6 text-indigo-300" />;
      default:
        return <Clock className="w-6 h-6 text-emerald-300" />;
    }
  };

  const formattedCurrentTime = currentTime.toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 border border-emerald-700/60 p-5 sm:p-6 shadow-2xl text-white">
      {/* Background Islamic arches & glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Current Waqt Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              এখনকার ওয়াক্ত
            </span>
            <span className="text-xs text-emerald-300/80 font-medium">
              বর্তমান সময়: {formattedCurrentTime}
            </span>
          </div>

          <div className="flex items-baseline gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-800/60 border border-emerald-600/40 shadow-inner">
                {getIcon(currentWaqt.id)}
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {currentWaqt.nameBn}
                </h3>
                <p className="text-xs text-emerald-300/80 font-medium mt-0.5">
                  শুরু: {formatTimeBengali(currentWaqt.time)}
                </p>
              </div>
            </div>

            <span className="font-arabic text-3xl sm:text-4xl font-bold text-amber-300/70 select-none">
              {currentWaqt.nameAr}
            </span>
          </div>

          <div className="text-xs text-emerald-200/90 bg-emerald-950/60 border border-emerald-800/60 rounded-xl px-3 py-1.5 inline-block">
            {currentWaqt.rakatBn}
          </div>
        </div>

        {/* Right: Next Waqt Countdown Timer */}
        <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center min-w-[240px] shadow-lg">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-2">
            <Hourglass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>পরবর্তী ওয়াক্ত: {nextWaqt.nameBn} ({formatTimeBengali(nextWaqt.time)})</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-center my-1">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-emerald-900/90 border border-emerald-700/60 flex items-center justify-center text-xl sm:text-2xl font-black text-amber-400 shadow-inner">
                {toBengaliNumber(remainingHours < 10 ? '0' + remainingHours : remainingHours)}
              </div>
              <span className="text-[10px] text-emerald-300/80 mt-1">ঘণ্টা</span>
            </div>

            <span className="text-xl font-bold text-emerald-600">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-emerald-900/90 border border-emerald-700/60 flex items-center justify-center text-xl sm:text-2xl font-black text-amber-400 shadow-inner">
                {toBengaliNumber(remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes)}
              </div>
              <span className="text-[10px] text-emerald-300/80 mt-1">মিনিট</span>
            </div>

            <span className="text-xl font-bold text-emerald-600">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-emerald-900/90 border border-emerald-700/60 flex items-center justify-center text-xl sm:text-2xl font-black text-amber-400 shadow-inner">
                {toBengaliNumber(remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds)}
              </div>
              <span className="text-[10px] text-emerald-300/80 mt-1">সেকেন্ড</span>
            </div>
          </div>

          <p className="text-[11px] text-emerald-300/70 mt-2 text-center">
            ওয়াক্ত শেষ হতে আর সময় বাকি
          </p>
        </div>
      </div>
    </div>
  );
};
