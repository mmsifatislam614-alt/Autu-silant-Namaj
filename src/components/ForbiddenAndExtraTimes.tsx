import React, { useState } from 'react';
import { AlertTriangle, Moon, Sun, Sunrise, Sunset, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { PrayerTimes, formatTimeBengali } from '../utils/prayerEngine';

interface ForbiddenAndExtraTimesProps {
  prayerTimes: PrayerTimes;
}

export const ForbiddenAndExtraTimes: React.FC<ForbiddenAndExtraTimesProps> = ({ prayerTimes }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/40 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-emerald-900/30 transition cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold text-emerald-200">
            নফল ওয়াক্ত (তাহাজ্জুদ, ইশরাক, সাহরি) ও ৩টি নিষিদ্ধ সময়
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-emerald-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-emerald-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-emerald-800/40 space-y-4">
          {/* Beneficial Nafl & Sunnah Times */}
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              গুরুত্বপূর্ণ নফল ওয়াক্ত ও সাহরি
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Sahri / Imsak */}
              <div className="p-3 rounded-lg bg-emerald-900/40 border border-emerald-800/50">
                <span className="text-xs text-emerald-300 font-medium">সাহরি শেষ / ইমসাক</span>
                <div className="text-base font-bold text-white mt-1">
                  {formatTimeBengali(prayerTimes.imsak)}
                </div>
                <span className="text-[10px] text-emerald-400/80">ফজরের ১০ মিনিট পূর্বে</span>
              </div>

              {/* Ishraq */}
              <div className="p-3 rounded-lg bg-emerald-900/40 border border-emerald-800/50">
                <span className="text-xs text-emerald-300 font-medium">ইশরাক নামাজ শুরু</span>
                <div className="text-base font-bold text-white mt-1">
                  {formatTimeBengali(prayerTimes.ishraq)}
                </div>
                <span className="text-[10px] text-emerald-400/80">সূর্যোদয়ের ১৮ মিনিট পর</span>
              </div>

              {/* Tahajjud */}
              <div className="p-3 rounded-lg bg-emerald-900/40 border border-emerald-800/50">
                <span className="text-xs text-emerald-300 font-medium">তাহাজ্জুদ ও শেষ তৃতীয়াংশ</span>
                <div className="text-base font-bold text-white mt-1">
                  {formatTimeBengali(prayerTimes.midnight)} - {formatTimeBengali(prayerTimes.tahajjudEnd)}
                </div>
                <span className="text-[10px] text-emerald-400/80">ফজরের ১৫ মিনিট পূর্ব পর্যন্ত</span>
              </div>
            </div>
          </div>

          {/* 3 Forbidden prayer times (হুরমত বা নিষিদ্ধ সময়) */}
          <div>
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              নামাজ পড়ার ৩টি নিষিদ্ধ সময় (হাদীস অনুযায়ী)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Sunrise */}
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 text-rose-100">
                <div className="flex items-center gap-1 text-xs font-semibold text-rose-300">
                  <Sunrise className="w-3.5 h-3.5 text-rose-400" />
                  ১. সূর্যোদয়ের সময়
                </div>
                <div className="text-sm font-bold text-white mt-1">
                  {formatTimeBengali(prayerTimes.sunrise)} হতে {formatTimeBengali(prayerTimes.ishraq)}
                </div>
                <p className="text-[10px] text-rose-200/70 mt-1">
                  সূর্য পূর্ণ উঠা পর্যন্ত সব নামাজ নিষিদ্ধ
                </p>
              </div>

              {/* Exact Midday / Zawal */}
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 text-rose-100">
                <div className="flex items-center gap-1 text-xs font-semibold text-rose-300">
                  <Sun className="w-3.5 h-3.5 text-rose-400" />
                  ২. ঠিক দ্বিপ্রহর (জাওয়ালে আফতাব)
                </div>
                <div className="text-sm font-bold text-white mt-1">
                  {formatTimeBengali(prayerTimes.forbiddenTimes.zawal.start)} হতে {formatTimeBengali(prayerTimes.dhuhr)}
                </div>
                <p className="text-[10px] text-rose-200/70 mt-1">
                  মাথার ঠিক উপর হতে সূর্য ঢলার পূর্বের ৮ মিনিট
                </p>
              </div>

              {/* Sunset */}
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 text-rose-100">
                <div className="flex items-center gap-1 text-xs font-semibold text-rose-300">
                  <Sunset className="w-3.5 h-3.5 text-rose-400" />
                  ৩. সূর্যাস্তের সময়
                </div>
                <div className="text-sm font-bold text-white mt-1">
                  {formatTimeBengali(prayerTimes.forbiddenTimes.sunset.start)} হতে {formatTimeBengali(prayerTimes.sunset)}
                </div>
                <p className="text-[10px] text-rose-200/70 mt-1">
                  মাগরিবের পূর্বের ১৫ মিনিট (সেদিনের আসরের কাজা ব্যতীত)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
