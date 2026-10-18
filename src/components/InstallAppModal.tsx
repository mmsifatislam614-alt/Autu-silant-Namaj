import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'android' | 'ios' | 'qr'>('android');

  const appUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-5i75usg3s7jtmps4pwhaiv-731410300875.asia-northeast1.run.app';

  useEffect(() => {
    if (isOpen) {
      // Auto switch to iOS tab if on iOS device
      if (isIOS) {
        setSelectedTab('ios');
      } else if (!isInstallable && typeof window !== 'undefined' && window.innerWidth > 768) {
        setSelectedTab('qr');
      }

      QRCode.toDataURL(appUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#064e3b',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch(() => {});
    }
  }, [isOpen, appUrl, isIOS, isInstallable]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDirectInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-lg rounded-2xl bg-emerald-950 border border-emerald-700/80 shadow-2xl flex flex-col max-h-[92vh] text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                ফোনে অ্যাপটি ইনস্টল করুন
              </h3>
              <p className="text-xs text-emerald-300/80">
                ইনস্টল করার পর ১০০% অফলাইনে কোনো ডাটা ছাড়াই চলবে
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

        {/* Direct One-Click Install if supported on this browser */}
        {isInstallable && (
          <div className="p-4 bg-gradient-to-r from-amber-500/20 via-emerald-800/40 to-emerald-900/60 border-b border-amber-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  সরাসরি ১-ক্লিকে ইনস্টল উপলব্ধ!
                </span>
                <p className="text-xs text-slate-200 mt-0.5">
                  নিচের বাটনে চাপ দিলে আপনার ডিভাইসে সরাসরি অ্যাপ ইনস্টল শুরু হবে।
                </p>
              </div>

              <button
                onClick={handleDirectInstall}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition cursor-pointer shrink-0 active:scale-95"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>এখনই ইনস্টল করুন</span>
              </button>
            </div>
          </div>
        )}

        {/* Platform Selection Tabs */}
        <div className="p-4 border-b border-emerald-800/40 pb-3">
          <div className="flex rounded-xl bg-emerald-900/60 p-1 border border-emerald-800">
            <button
              onClick={() => setSelectedTab('android')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedTab === 'android'
                  ? 'bg-amber-400 text-emerald-950 font-bold shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>অ্যান্ড্রয়েড ফোন</span>
            </button>

            <button
              onClick={() => setSelectedTab('ios')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedTab === 'ios'
                  ? 'bg-amber-400 text-emerald-950 font-bold shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>iPhone / iOS</span>
            </button>

            <button
              onClick={() => setSelectedTab('qr')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedTab === 'qr'
                  ? 'bg-amber-400 text-emerald-950 font-bold shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR কোড স্ক্যান</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* ANDROID TAB */}
          {selectedTab === 'android' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Chrome বা Samsung Internet ব্রাউজারে ৩টি সহজ ধাপ:
              </h4>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-800/60 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ১
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Chrome ব্রাউজারের মেনুতে চাপ দিন
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      ব্রাউজারের উপরে ডানে অবস্থিত <strong>৩টি ডট (Menu ⋮)</strong> আইকনে ট্যাপ করুন।
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-800/60 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ২
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Install app বা Add to Home screen সিলেক্ট করুন
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      মেনু থেকে <strong>&ldquo;Install app&rdquo;</strong> অথবা <strong>&ldquo;Add to Home screen&rdquo;</strong> (হোম স্ক্রিনে যোগ করুন) অপশনটিতে চাপ দিন।
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-800/60 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ৩
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Install চাপুন — কাজ সম্পন্ন!
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      কনফার্মেশন পপআপে <strong>Install</strong> চাপলেই আপনার মোবাইলের অ্যাপস তালিকায় নামাজের আইকন চলে আসবে। এরপর থেকে ইন্টারনেট ছাড়াই চলবে।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* IOS TAB */}
          {selectedTab === 'ios' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Safari ব্রাউজারে ইনস্টল করার ৩টি সহজ ধাপ:
              </h4>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-800/60 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ১
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Safari ব্রাউজারে Share বাটনে চাপুন
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Safari ব্রাউজারের নিচে মাঝখানে থাকা <strong>Share (শেয়ার ⎋)</strong> আইকনটিতে ট্যাপ করুন।
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-800/60 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ২
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Add to Home Screen চাপুন
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      তালিকাটি সামান্য নিচে স্ক্রোল করে <strong>&ldquo;Add to Home Screen&rdquo;</strong> অপশনটি বেছে নিন।
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-800/60 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ৩
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      উপরে ডানে &lsquo;Add&rsquo; চাপুন
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      উপরে ডানে <strong>Add</strong> চাপলেই আইফোনের হোমস্ক্রিনে অ্যাপটি যোগ হয়ে যাবে।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QR CODE TAB */}
          {selectedTab === 'qr' && (
            <div className="flex flex-col items-center justify-center text-center space-y-3 py-2">
              <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-emerald-800">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Scan to open app on phone"
                    className="w-48 h-48 block"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-emerald-900 text-xs">
                    QR কোড লোড হচ্ছে...
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">
                  আপনার মোবাইল দিয়ে QR কোডটি স্ক্যান করুন
                </h4>
                <p className="text-xs text-emerald-300/80 max-w-xs mx-auto">
                  মোবাইলের ক্যামেরা বা Google Lens দিয়ে কোডটি স্ক্যান করলে অ্যাপটি সরাসরি ফোনে খুলে যাবে।
                </p>
              </div>
            </div>
          )}

          {/* App URL and Copy Link Box */}
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/60 space-y-1.5">
            <span className="text-[11px] text-emerald-300 font-semibold block">
              ফোনের ব্রাউজারে খোলার লিংক:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="w-full bg-emerald-900/50 border border-emerald-700/60 text-emerald-100 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none select-all font-mono truncate"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                    <span>কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>কপি লিংক</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Offline benefit assurance */}
          <div className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-800/40 flex items-center gap-2.5 text-xs text-emerald-200">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              ইনস্টল সম্পন্ন হলে ইন্টারনেট সংযোগ বন্ধ করে দিলেও অ্যাপটি সারাবছর নির্ভুলভাবে অফলাইনে চলবে।
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-emerald-800/60 flex items-center justify-between bg-emerald-950">
          <span className="text-[11px] text-emerald-400/80">
            {isInstalled ? '✓ অ্যাপটি ইতোমধ্যে ইনস্টল করা আছে' : 'সহজেই হোমস্ক্রিনে যুক্ত করুন'}
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold transition cursor-pointer"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
