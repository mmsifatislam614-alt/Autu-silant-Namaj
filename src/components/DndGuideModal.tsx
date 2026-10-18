import React from 'react';
import { X, Smartphone, CheckCircle2, Calendar, Settings, ShieldAlert, Download } from 'lucide-react';

interface DndGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportCalendar: () => void;
}

export const DndGuideModal: React.FC<DndGuideModalProps> = ({
  isOpen,
  onClose,
  onExportCalendar,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-lg rounded-2xl bg-emerald-950 border border-emerald-700/80 shadow-2xl flex flex-col max-h-[90vh] text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-900 border border-emerald-700 text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                ফোনে অটো সাইলেন্ট (DND) সেট করার নিয়ম
              </h3>
              <p className="text-xs text-emerald-300/80">
                অ্যান্ড্রয়েড এবং আইফোনে শতভাগ কার্যকর অটো সাইলেন্ট পদ্ধতি
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {/* Method 1: The easiest 1-Click Calendar Sync */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-900/60 to-emerald-950 border border-emerald-600/60 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Calendar className="w-4 h-4" />
              <span>পদ্ধতি ১: ক্যালেন্ডার সিঙ্ক (সবচেয়ে সহজ ও ১০০% কার্যকর)</span>
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed">
              অ্যান্ড্রয়েড এবং আইফোনে যেকোনো ক্যালেন্ডার ইভেন্টে ফোন স্বয়ংক্রিয় <strong>Do Not Disturb (DND)</strong> বা <strong>Silent</strong> করার অপশন থাকে।
            </p>

            <ol className="text-xs text-emerald-200/90 space-y-2 list-decimal list-inside bg-emerald-950/60 p-3 rounded-lg border border-emerald-800/60">
              <li>নিচের বাটনে চাপ দিয়ে <strong>.ICS ফাইল ডাউনলোড</strong> করুন।</li>
              <li>ডাউনলোড হওয়া ফাইলটিতে ক্লিক করে আপনার <strong>Google Calendar</strong> বা ফোনের ক্যালেন্ডারে যুক্ত (Import) করুন।</li>
              <li>
                ফোনের <strong>Settings &gt; Sound &gt; Do Not Disturb &gt; Schedules &gt; During Events</strong> এ গিয়ে সাইলেন্ট অন রাখুন। নামাজের সময় ফোন স্বয়ংক্রিয় সাইলেন্ট হয়ে যাবে!
              </li>
            </ol>

            <button
              onClick={onExportCalendar}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs shadow-md transition cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>১ মাসের নামাজের সাইলেন্ট ক্যালেন্ডার ডাউনলোড করুন</span>
            </button>
          </div>

          {/* Method 2: Android DND Rules */}
          <div className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-800/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>পদ্ধতি ২: অ্যান্ড্রয়েড Do Not Disturb শিডিউল</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>ফোনের <strong>Settings</strong> এ যান &gt; <strong>Sound &amp; Vibration</strong> এ ট্যাপ করুন।</li>
              <li><strong>Do Not Disturb (DND)</strong> অপশনে যান।</li>
              <li><strong>Schedules / Automation</strong> সিলেক্ট করে নামাজের ওয়াক্তগুলোর সময় যোগ করে দিন।</li>
            </ul>
          </div>

          {/* Method 3: In-App Prayer Stand Mode */}
          <div className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-800/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>পদ্ধতি ৩: ইন-অ্যাপ ইবাদত ও সাইলেন্ট স্ক্রিন</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              নামাজে দাঁড়ানোর আগে অ্যাপটি ওপেন করে <strong>ইবাদত স্ক্রিন</strong> অন রাখুন। অ্যাপটি কোনো সাউন্ড হতে দেবে না, স্ক্রিন স্লিপ মোডে যাবে না এবং নির্ধারিত সময় শেষে আপনাকে মৃদু ভাইব্রেশনে জানিয়ে দেবে।
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-emerald-800/60 flex justify-end bg-emerald-950">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold transition cursor-pointer"
          >
            বুঝেছি, ধন্যবাদ
          </button>
        </div>
      </div>
    </div>
  );
};
