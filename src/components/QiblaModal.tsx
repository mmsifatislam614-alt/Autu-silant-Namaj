import React, { useState, useEffect } from 'react';
import { X, Compass, Navigation2, Sparkles, AlertCircle } from 'lucide-react';
import { calculateQiblaDirection, toBengaliNumber } from '../utils/prayerEngine';
import { District } from '../utils/districtsData';

interface QiblaModalProps {
  isOpen: boolean;
  onClose: () => void;
  district: District;
}

export const QiblaModal: React.FC<QiblaModalProps> = ({
  isOpen,
  onClose,
  district,
}) => {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [hasOrientationPermission, setHasOrientationPermission] = useState<boolean | null>(null);

  const qiblaBearing = Math.round(calculateQiblaDirection(district.lat, district.lng));

  useEffect(() => {
    if (!isOpen) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;
      // webkitCompassHeading for iOS Safari
      if ('webkitCompassHeading' in e && typeof (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading === 'number') {
        heading = (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Chromium / Android standard alpha (0 is North)
        heading = 360 - e.alpha;
      }

      if (heading !== null) {
        setDeviceHeading(heading);
        setHasOrientationPermission(true);
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate relative angle to Qibla
  const relativeQiblaAngle =
    deviceHeading !== null ? (qiblaBearing - deviceHeading + 360) % 360 : qiblaBearing;

  const isFacingQibla =
    deviceHeading !== null && Math.abs(relativeQiblaAngle < 180 ? relativeQiblaAngle : relativeQiblaAngle - 360) < 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-sm rounded-2xl bg-emerald-950 border border-emerald-700/80 shadow-2xl flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-900 border border-emerald-700 text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ক্বিবলা দিক নির্দেশক</h3>
              <p className="text-xs text-emerald-300/80">{district.nameBn} থেকে ক্বিবলা</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-800/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compass Visualization */}
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 rounded-full border-4 border-emerald-800/80 bg-emerald-900/40 flex items-center justify-center shadow-inner">
            {/* Cardinal Marks */}
            <span className="absolute top-2 text-xs font-bold text-rose-400">উ (N)</span>
            <span className="absolute bottom-2 text-xs font-bold text-emerald-400">দ (S)</span>
            <span className="absolute right-3 text-xs font-bold text-emerald-400">পূ (E)</span>
            <span className="absolute left-3 text-xs font-bold text-emerald-400">প (W)</span>

            {/* Dial Tick Marks */}
            <div className="absolute inset-4 rounded-full border border-dashed border-emerald-700/50 pointer-events-none" />

            {/* Rotating Needle / Arrow pointing to Qibla */}
            <div
              className="absolute w-full h-full flex items-center justify-center transition-transform duration-300 ease-out pointer-events-none"
              style={{
                transform: `rotate(${deviceHeading !== null ? relativeQiblaAngle : qiblaBearing}deg)`,
              }}
            >
              <div className="flex flex-col items-center -translate-y-16">
                <div className="px-2 py-0.5 rounded-md bg-amber-400 text-emerald-950 font-black text-xs shadow-md">
                  🕋 কাবা
                </div>
                <Navigation2 className="w-10 h-10 text-amber-400 fill-amber-400 -mt-1" />
              </div>
            </div>

            {/* Center Hub */}
            <div className="w-10 h-10 rounded-full bg-emerald-800 border-2 border-amber-400 flex items-center justify-center shadow-lg z-10">
              <span className="w-3 h-3 rounded-full bg-amber-300" />
            </div>
          </div>

          {/* Facing feedback */}
          <div className="mt-5 text-center space-y-1">
            <div className="text-xl font-black text-amber-400">
              {toBengaliNumber(qiblaBearing)}° ডিগ্রি
            </div>
            <div className="text-xs text-emerald-200">
              উত্তর হতে ঘড়ির কাঁটার দিকে পশ্চিম-দক্ষিণ কোণ
            </div>

            {deviceHeading !== null ? (
              <p
                className={`text-xs font-bold mt-2 py-1 px-3 rounded-full inline-block ${
                  isFacingQibla
                    ? 'bg-amber-400 text-emerald-950'
                    : 'bg-emerald-900/80 text-emerald-300'
                }`}
              >
                {isFacingQibla ? '✓ আপনি ক্বিবলার মুখোমুখি আছেন' : 'তীরচিহ্নের দিকে মোবাইলটি ঘুরান'}
              </p>
            ) : (
              <p className="text-[11px] text-emerald-400/80 mt-2 bg-emerald-900/40 p-2 rounded-lg">
                মোবাইলের কম্পাস সেন্সর সক্রিয় থাকলে তীরটি সরাসরি ক্বিবলা নির্দেশ করবে।
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-emerald-950 border-t border-emerald-800/60 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-xs font-semibold text-emerald-200 transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
