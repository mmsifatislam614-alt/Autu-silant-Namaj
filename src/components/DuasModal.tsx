import React, { useState } from 'react';
import { X, BookOpen, Search } from 'lucide-react';

interface DuasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DuaItem {
  id: string;
  titleBn: string;
  category: string;
  arabic: string;
  pronunciationBn: string;
  meaningBn: string;
}

const DUAS_LIST: DuaItem[] = [
  {
    id: 'azan',
    titleBn: 'আজানের দোয়া',
    category: 'আজান',
    arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    pronunciationBn: 'আল্লাহুম্মা রব্বা হাজিহিদ দাওয়াতিত তাম্মাহ, ওয়াস সালাতিল কায়িমাহ, আতি মুহাম্মাদানিল ওয়াসীলাতা ওয়াল ফাদীলাহ, ওয়াবআছহু মাক্বামাম মাহমূদানিল্লাজি ওয়াআদতাহ।',
    meaningBn: 'হে আল্লাহ! এই পরিপূর্ণ আহ্বান এবং প্রতিষ্ঠিত নামাজের তুমিই একমাত্র রব। মুহাম্মদ (সাঃ) কে দান করুন ওসীলা (জান্নাতের বিশেষ মর্যাদা) এবং মর্যাদাশীল স্থান। আর তাঁকে পৌঁছিয়ে দিন সেই প্রশংসিত স্থানে যার ওয়াদা আপনি তাঁকে দিয়েছেন।',
  },
  {
    id: 'thana',
    titleBn: 'ছানা (নামাজের শুরু)',
    category: 'নামাজ',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
    pronunciationBn: 'সুবহানাকা আল্লাহুম্মা ওয়া বিহামদিকা, ওয়া তাবারাকাসমুকা, ওয়া তাআলা জাদ্দুকা, ওয়া লা ইলাহা গাইরুক।',
    meaningBn: 'হে আল্লাহ! আমি আপনার প্রশংসা সহকারে পবিত্রতা ঘোষণা করছি। আপনার নাম বরকতময়, আপনার মাহাত্ম্য সর্বোচ্চ এবং আপনি ব্যতীত কোনো উপাস্য নেই।',
  },
  {
    id: 'tashahhud',
    titleBn: 'তাশাহহুদ (আত্তাহিয়্যাতু)',
    category: 'নামাজ',
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    pronunciationBn: 'আত্তাহিয়্যাতু লিল্লাহি ওয়াস সালাওয়াতু ওয়াত তাইয়্যিবাতু, আসসালামু আলাইকা আইয়্যুহান নাবিয়্যু ওয়া রহমাতুল্লাহি ওয়া বারাকাতুহু, আসসালামু আলাইনা ওয়া আলা ইবাদিল্লাহিস সালিহীন, আশহাদু আল্লা ইলাহা ইল্লাল্লাহু ওয়া আশহাদু আন্না মুহাম্মাদান আবদুহু ওয়া রাসুলুহু।',
    meaningBn: 'সকল মৌখিক, শারীরিক ও আর্থিক ইবাদত আল্লাহর জন্য। হে নবী! আপনার উপর আল্লাহর শান্তি, রহমত ও বরকত বর্ষিত হোক। আমাদের উপর এবং আল্লাহর নেক বান্দাদের উপর শান্তি বর্ষিত হোক। আমি সাক্ষ্য দিচ্ছি যে, আল্লাহ ছাড়া কোনো উপাস্য নেই এবং মুহাম্মদ (সাঃ) তাঁর বান্দা ও রাসুল।',
  },
  {
    id: 'durood',
    titleBn: 'দুরুদে ইবরাহীম',
    category: 'নামাজ',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    pronunciationBn: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদিঁও ওয়া আলা আলি মুহাম্মাদ, কামা সাল্লাইতা আলা ইবরাহীমা ওয়া আলা আলি ইবরাহীম, ইন্নাকা হামীদুম মাজীদ। আল্লাহুম্মা বারিক আলা মুহাম্মাদিঁও ওয়া আলা আলি মুহাম্মাদ, কামা বারাকতা আলা ইবরাহীমা ওয়া আলা আলি ইবরাহীম, ইন্নাকা হামীদুম মাজীদ।',
    meaningBn: 'হে আল্লাহ! মুহাম্মদ (সাঃ) ও তাঁর পরিবারের উপর রহমত বর্ষণ করুন, যেমন আপনি ইবরাহীম (আঃ) ও তাঁর পরিবারের উপর রহমত বর্ষণ করেছিলেন। নিশ্চয়ই আপনি প্রশংসিত ও মহিমান্বিত। হে আল্লাহ! মুহাম্মদ (সাঃ) ও তাঁর পরিবারের উপর বরকত নাযিল করুন, যেমন আপনি ইবরাহীম (আঃ) ও তাঁর পরিবারের উপর বরকত নাযিল করেছিলেন। নিশ্চয়ই আপনি প্রশংসিত ও মহিমান্বিত।',
  },
  {
    id: 'dua-masura',
    titleBn: 'দোয়ায়ে মাসূরা',
    category: 'নামাজ',
    arabic: 'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
    pronunciationBn: 'আল্লাহুম্মা ইন্নি জালামতু নাফসি জুলমান কাসীরা, ওয়া লা ইয়াগফিরুজ জুনুবা ইল্লা আনতা, ফাগফিরলি মাগফিরাতাম মিন ইনদিকা ওয়ারহামনি, ইন্নাকা আনতাল গাফুরুর রাহীম।',
    meaningBn: 'হে আল্লাহ! নিশ্চয়ই আমি নিজের উপর অনেক বেশি অন্যায় ও জুলুম করেছি। আপনি ব্যতীত গুনাহ মাফ করার কেউ নেই। অতএব আপনার পক্ষ থেকে আমাকে বিশেষ ক্ষমায় ক্ষমা করে দিন এবং আমার উপর দয়া করুন। নিশ্চয়ই আপনি পরম ক্ষমাশীল ও অসীম দয়ালু।',
  },
  {
    id: 'qunoot',
    titleBn: 'দোয়ায়ে কুনূত (বিতর নামাজ)',
    category: 'বিতর',
    arabic: 'اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ وَنَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ. اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ وَإِلَيْكَ نَسْعَى وَنَحْفِدُ وَنَرْجُو رَحْمَتَكَ وَنَخْشَى عَذَابَكَ إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ',
    pronunciationBn: 'আল্লাহুম্মা ইন্না নাসতাঈনুকা ওয়া নাসতাগফিরুকা ওয়া নু’মিনু বিকা ওয়া নাতাওয়াক্কালু আলাইকা ওয়া নুছনি আলাইকাল খাইর, ওয়া নাশকুরুকা ওয়া লা নাকফুরুক, ওয়া নাখলাউ ওয়া নাতরুকু মাইঁ ইয়াফজুরুক। আল্লাহুম্মা ইয়্যাকা না’বুদু ওয়া লাকা নুসল্লি ওয়া নাসজুদু ওয়া ইলাইকা নাস’আ ওয়া নাহফিদ, ওয়া নারজু রাহমাতাকা ওয়া নাখশা আজাবাক, ইন্না আজাবাকা বিল কুফফারি মুলহিক্ব।',
    meaningBn: 'হে আল্লাহ! আমরা আপনারই সাহায্য চাই, আপনার কাছেই ক্ষমা প্রার্থনা করি, আপনার উপর ঈমান রাখি এবং আপনারই উপর ভরসা করি। আপনার উত্তম প্রশংসা করি, আপনার কৃতজ্ঞতা প্রকাশ করি এবং আপনাকে অস্বীকার করি না। যে ব্যক্তি আপনার অবাধ্য হয় তাকে আমরা বর্জন ও পরিত্যাগ করি। হে আল্লাহ! আমরা কেবল আপনারই ইবাদত করি, আপনারই উদ্দেশ্যে নামাজ পড়ি ও সিজদা করি। আপনার দিকেই আমরা ধাবিত হই এবং প্রস্তুত থাকি। আমরা আপনার রহমতের আশা করি এবং আপনার শাস্তিকে ভয় করি। নিশ্চয়ই আপনার কঠিন শাস্তি কাফেরদের ঘিরে ফেলবে।',
  },
  {
    id: 'ayatul-kursi',
    titleBn: 'আয়াতুল কুরসী',
    category: 'কুরআন',
    arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    pronunciationBn: 'আল্লাহু লা ইলাহা ইল্লা হুয়াল হাইয়্যুল ক্বাইয়্যুম। লা তা’খুজুহু সিনাতুওঁ ওয়ালা নাওম। লাহু মা ফিস সামাওয়াতি ওয়ামা ফিল আরদ্ব। মান জাল্লাজি ইয়াশফা’উ ইনদাহু ইল্লা বিইজনিহ। ইয়া’লামু মা বাইনা আইদিহিম ওয়ামা খালফাহুম, ওয়ালা ইউহিতুনা বিশাইয়িম মিন ইলমিহি ইল্লা বিমা শাআ। ওয়াসি’আ কুরসিইয়্যুহুস সামাওয়াতি ওয়াল আরদ্ব, ওয়ালা ইয়াউদুহু হিফজুহুমা, ওয়াহুয়াল আলিয়্যুল আজীম।',
    meaningBn: 'আল্লাহ, যিনি ছাড়া কোনো উপাস্য নেই, তিনি চিরঞ্জীব, সবকিছুর ধারক। তন্দ্রা বা নিদ্রা তাঁকে স্পর্শ করতে পারে না। আকাশমণ্ডলী ও পৃথিবীতে যা কিছু আছে সবই তাঁর। কে আছে যে তাঁর অনুমতি ছাড়া তাঁর নিকট সুপারিশ করবে? তাদের সম্মুখে ও পেছনে যা কিছু আছে তা তিনি জানেন। তাঁর জ্ঞানের কোনো কিছু তারা আয়ত্ত করতে পারে না, কেবল যতটুকু তিনি ইচ্ছা করেন। তাঁর কুরসী সমস্ত আকাশ ও পৃথিবীকে পরিবেষ্টন করে আছে। এ দুটির রক্ষণাবেক্ষণ তাঁকে বিন্দুমাত্র ক্লান্ত করে না। তিনি সর্বোচ্চ ও মহান।',
  },
];

export const DuasModal: React.FC<DuasModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredDuas = DUAS_LIST.filter(
    (d) =>
      d.titleBn.toLowerCase().includes(search.toLowerCase()) ||
      d.meaningBn.toLowerCase().includes(search.toLowerCase()) ||
      d.pronunciationBn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-xl rounded-2xl bg-emerald-950 border border-emerald-700/80 shadow-2xl flex flex-col max-h-[90vh] text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-900 border border-emerald-700 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                নামাজের প্রয়োজনীয় দোয়া সমূহ
              </h3>
              <p className="text-xs text-emerald-300/80">আরবি, উচ্চারণ ও বাংলা অর্থসহ</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-800/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 bg-emerald-900/40 border-b border-emerald-800/40">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="দোয়া খুঁজুন (যেমন: আজান, তাশাহহুদ, দুরুদ)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-emerald-900/60 border border-emerald-700/60 text-white placeholder-emerald-400/50 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredDuas.map((dua) => (
            <div
              key={dua.id}
              className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-800/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-amber-300">{dua.titleBn}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200">
                  {dua.category}
                </span>
              </div>

              {/* Arabic text with high readability font */}
              <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800/50 text-right leading-loose font-arabic text-xl sm:text-2xl text-amber-100 select-text">
                {dua.arabic}
              </div>

              {/* Pronunciation */}
              <div>
                <span className="text-[11px] font-semibold text-emerald-400 block mb-0.5">
                  উচ্চারণ:
                </span>
                <p className="text-xs text-emerald-100 leading-relaxed bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-900">
                  {dua.pronunciationBn}
                </p>
              </div>

              {/* Meaning */}
              <div>
                <span className="text-[11px] font-semibold text-amber-400 block mb-0.5">
                  অর্থ:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-900">
                  {dua.meaningBn}
                </p>
              </div>
            </div>
          ))}
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
