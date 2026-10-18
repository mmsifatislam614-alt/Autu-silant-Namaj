import React, { useState } from 'react';
import {
  X,
  MapPin,
  Navigation,
  Search,
  Check,
  Globe,
  Wifi,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  BANGLADESH_DISTRICTS,
  INTERNATIONAL_CITIES,
  District,
  findClosestDistrict,
} from '../utils/districtsData';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDistrict: District;
  onSelectDistrict: (district: District, isGps?: boolean) => void;
  isOnline: boolean;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentDistrict,
  onSelectDistrict,
  isOnline,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('সব');
  const [tab, setTab] = useState<'bd' | 'intl'>('bd');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isOpen) return null;

  const divisions = ['সব', 'ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ'];

  const filteredDistricts = BANGLADESH_DISTRICTS.filter((d) => {
    const matchesSearch =
      d.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiv =
      selectedDivision === 'সব' || d.divisionBn.includes(selectedDivision);
    return matchesSearch && matchesDiv;
  });

  const filteredIntl = INTERNATIONAL_CITIES.filter((d) =>
    d.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDetectGPS = () => {
    setGpsError(null);
    if (!('geolocation' in navigator)) {
      setGpsError('আপনার ডিভাইসে জিপিএস সাপোর্ট পাওয়া যায়নি।');
      return;
    }

    setIsDetectingGps(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const closest = findClosestDistrict(lat, lng);

        const customGpsDistrict: District = {
          id: 'custom-gps',
          nameBn: `${closest.nameBn} (জিপিএস)`,
          nameEn: `${closest.nameEn} (GPS)`,
          divisionBn: closest.divisionBn,
          divisionEn: closest.divisionEn,
          lat: Number(lat.toFixed(4)),
          lng: Number(lng.toFixed(4)),
        };

        setIsDetectingGps(false);
        onSelectDistrict(customGpsDistrict, true);
        onClose();
      },
      (error) => {
        setIsDetectingGps(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('লোকেশন পারমিশন দেওয়া হয়নি। ব্রাউজার থেকে পারমিশন দিন অথবা নিচের তালিকা থেকে জেলা বেছে নিন।');
        } else {
          setGpsError('লোকেশন পাওয়া যায়নি। অনুগ্রহ করে জেলা সিলেক্ট করুন।');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-lg rounded-2xl bg-emerald-950 border border-emerald-700/80 shadow-2xl flex flex-col max-h-[90vh] text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-900 border border-emerald-700 text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                লোকেশন ও জেলা নির্বাচন
              </h3>
              <p className="text-xs text-emerald-300/80">
                একবার সিলেক্ট করলে সম্পূর্ণ অফলাইনে কাজ করবে
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

        {/* GPS Quick Detect Button */}
        <div className="p-4 bg-emerald-900/40 border-b border-emerald-800/40 space-y-2">
          <button
            onClick={handleDetectGPS}
            disabled={isDetectingGps}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-950/40 transition active:scale-98 cursor-pointer disabled:opacity-70"
          >
            {isDetectingGps ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>লোকেশন সনাক্ত হচ্ছে...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>ডাটা/ইন্টারনেট চালু থাকলে অটো লোকেশন নিন (GPS)</span>
              </>
            )}
          </button>

          {gpsError && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-xs text-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{gpsError}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-emerald-300/80 px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              জিপিএস লোকেশন স্বয়ংক্রিয় ক্যাশ হয়ে যাবে
            </span>
            <span>{isOnline ? '🟢 ইন্টারনেট সংযোগ রয়েছে' : '⚪ অফলাইন মোড'}</span>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="p-4 border-b border-emerald-800/40 space-y-3">
          {/* Tabs */}
          <div className="flex rounded-lg bg-emerald-900/60 p-1 border border-emerald-800">
            <button
              onClick={() => setTab('bd')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                tab === 'bd'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              বাংলাদেশের ৬৪ জেলা ({BANGLADESH_DISTRICTS.length})
            </button>
            <button
              onClick={() => setTab('intl')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                tab === 'intl'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              আন্তর্জাতিক শহর
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={tab === 'bd' ? 'জেলার নাম দিয়ে খুঁজুন (যেমন: ঢাকা, বগুড়া)...' : 'শহরের নাম লিখুন...'}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-white placeholder-emerald-400/50 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Division chips for BD */}
          {tab === 'bd' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {divisions.map((div) => (
                <button
                  key={div}
                  onClick={() => setSelectedDivision(div)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition cursor-pointer ${
                    selectedDivision === div
                      ? 'bg-amber-400 text-emerald-950 font-bold'
                      : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* District list scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {tab === 'bd' ? (
            filteredDistricts.length === 0 ? (
              <p className="text-center py-6 text-xs text-emerald-400/70">
                কোনো জেলা খুঁজে পাওয়া যায়নি
              </p>
            ) : (
              filteredDistricts.map((d) => {
                const isSelected = currentDistrict.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      onSelectDistrict(d, false);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-800 border border-amber-400/80 text-white font-bold'
                        : 'bg-emerald-900/30 hover:bg-emerald-900/60 border border-emerald-800/40 text-emerald-100'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{d.nameBn}</div>
                      <div className="text-[11px] text-emerald-300/70">
                        {d.nameEn} • বিভাগ: {d.divisionBn}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="p-1 rounded-full bg-amber-400 text-emerald-950">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })
            )
          ) : (
            filteredIntl.map((d) => {
              const isSelected = currentDistrict.id === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => {
                    onSelectDistrict(d, false);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 border border-amber-400/80 text-white font-bold'
                      : 'bg-emerald-900/30 hover:bg-emerald-900/60 border border-emerald-800/40 text-emerald-100'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold">{d.nameBn}</div>
                    <div className="text-[11px] text-emerald-300/70">{d.nameEn}</div>
                  </div>
                  {isSelected && (
                    <div className="p-1 rounded-full bg-amber-400 text-emerald-950">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
