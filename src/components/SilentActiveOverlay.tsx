import React, { useEffect } from 'react';
import { VolumeX, BellRing, Minimize2, Sparkles, Moon } from 'lucide-react';
import { toBengaliNumber } from '../utils/prayerEngine';

interface SilentActiveOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  prayerNameBn: string;
  remainingSeconds: number;
  totalSeconds: number;
  onEmergencyUnmute: () => void;
}

export const SilentActiveOverlay: React.FC<SilentActiveOverlayProps> = ({
  isOpen,
  onClose,
  prayerNameBn,
  remainingSeconds,
  totalSeconds,
  onEmergencyUnmute,
}) => {
  useEffect(() => {
    let wakeLockSentinel: any = null;

    if (isOpen && 'wakeLock' in navigator) {
      try {
        (navigator as any).wakeLock.request('screen').then((lock: any) => {
          wakeLockSentinel = lock;
        }).catch(() => {});
      } catch {}
    }

    return () => {
      if (wakeLockSentinel) {
        try {
          wakeLockSentinel.release();
        } catch {}
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const minutesRemaining = Math.floor(remainingSeconds / 60);
  const secondsRemaining = remainingSeconds % 60;
  const progressPct = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 text-slate-100 flex flex-col justify-between p-6 select-none animate-fadeIn">
      {/* Top bar */}
      <div className="flex items-center justify-between max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <VolumeX className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              ইবাদত মোড সক্রিয়
            </span>
            <span className="text-[11px] text-emerald-400">ফোন স্বয়ংক্রিয় সাইলেন্ট</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-slate-300 transition cursor-pointer"
          title="ফুলস্ক্রিন থেকে বের হন"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Center Hero Countdown */}
      <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto w-full my-auto">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Subtle spinning or glowing border */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-800/40" />
          <div
            className="absolute inset-0 rounded-full border-2 border-amber-400/80 transition-all duration-1000"
            style={{
              clipPath: `polygon(50% 50%, 50% 0%, ${progressPct > 25 ? '100% 0%,' : ''} ${
                progressPct > 50 ? '100% 100%,' : ''
              } ${progressPct > 75 ? '0% 100%,' : ''} 0% 0%)`,
            }}
          />

          <div className="flex flex-col items-center">
            <span className="text-4xl">🕌</span>
            <span className="text-sm font-semibold text-emerald-300 mt-2">{prayerNameBn} নামাজ</span>
            <div className="text-2xl font-black text-amber-300 tracking-tight mt-1">
              {toBengaliNumber(minutesRemaining < 10 ? '0' + minutesRemaining : minutesRemaining)}:
              {toBengaliNumber(secondsRemaining < 10 ? '0' + secondsRemaining : secondsRemaining)}
            </div>
            <span className="text-[10px] text-emerald-400/80">বাকি সময়</span>
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-wide">
            নামাজে একাগ্রতা বজায় রাখুন
          </h2>
          <p className="text-xs text-emerald-300/80">
            নির্ধারিত সময় শেষে ফোন স্বয়ংক্রিয়ভাবে স্বাভাবিক মোডে ফিরে আসবে।
          </p>
        </div>

        {/* Hadith Quote on Prayer */}
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-xs text-amber-200/90 italic leading-relaxed">
          &ldquo;নিশ্চয়ই নামাজ মুমিনদের উপর নির্দিষ্ট সময়ে ফরজ করা হয়েছে।&rdquo;
          <span className="block not-italic text-[10px] text-emerald-400 mt-1 font-semibold">
            — সূরা আন-নিসা: ১০৩
          </span>
        </div>
      </div>

      {/* Bottom Emergency Controls */}
      <div className="max-w-xs mx-auto w-full space-y-2">
        <button
          onClick={() => {
            onEmergencyUnmute();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer active:scale-95"
        >
          <BellRing className="w-4 h-4" />
          <span>জরুরি প্রয়োজনে আনসাইলেন্ট করুন</span>
        </button>

        <button
          onClick={onClose}
          className="w-full py-2 text-center text-xs text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
        >
          স্ক্রিন মিনিমাইজ করুন (সাইলেন্ট চলতে থাকবে)
        </button>
      </div>
    </div>
  );
};
