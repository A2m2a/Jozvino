'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiBookOpen, FiActivity, FiUser, FiSearch, FiCheckCircle, FiShield, FiUsers,FiX, FiAward,FiMessageCircle,FiVolume2,FiCpu,FiTarget,FiUpload,FiEdit3,FiFileText,
  FiPlus, FiBell, FiZap, FiStar, FiChevronLeft, FiTrash2, FiEye,FiHash, FiClock,FiMapPin, FiArrowUpRight ,FiMoon,FiBookmark ,FiCreditCard,FiArrowLeft,FiCheck,FiTrendingUp
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

// --- انواع داده‌ها (Types) ---
interface Note {
  id: number;
  title: string;
  progress: number;
  date: string;
  category: string;
  icon: string;
  color: string;
}

const sliderImages = [
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
];
const userData = {
  name: "امیرحسین رضایی",
  email: "amirhossein.rezaei.79@gmail.com", // ایمیل ثبت‌نامی کاربر
  level: "طلایی",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  balance: "۵۴۰,۰۰۰",
  stats: {
    notesCount: 12,
    downloads: 45,
    rank: 124
  }
};
const categories = [
  { id: 1, name: 'کتب درسی', icon: '📚', color: 'from-emerald-400 to-cyan-500', count: '۱۴۰ فایل' },
  { id: 2, name: 'جزوات برتر', icon: '✍️', color: 'from-orange-400 to-rose-500', count: '۸۵ فایل' },
  { id: 3, name: 'نمونه سوال', icon: '📝', color: 'from-blue-400 to-indigo-600', count: '۲۱۰ فایل' },
  { id: 4, name: 'کنکور و تست', icon: '🎯', color: 'from-fuchsia-500 to-purple-600', count: '۹۵ فایل' },
];
const weeklyData = [
  { day: 'شنیه', value: 40 }, { day: 'یکشنبه', value: 70 }, { day: 'دوشنبه', value: 50 },
  { day: 'سه‌شنبه', value: 90 }, { day: 'چهارشنبه', value: 65 }, { day: 'پنجشنبه', value: 80 }, { day: 'جمعه', value: 30 }
];
// --- کامپوننت سرچ هوشمند ---
const SmartSearch = ({ onStatusChange }: { onStatusChange: (status: boolean) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = [
    { id: 1, title: 'ریاضیات گسسته', type: 'جزوه', icon: 'Σ' },
    { id: 2, title: 'دکتر علوی', type: 'استاد', icon: '👨‍🏫' },
    { id: 3, title: 'هوش مصنوعی', type: 'دسته', icon: '🤖' },
  ].filter(item => item.title.includes(query));

  useEffect(() => {
    onStatusChange(isOpen);
  }, [isOpen, onStatusChange]);

  useEffect(() => {
    const handleKbd = (e: any) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKbd);
    return () => window.removeEventListener('keydown', handleKbd);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
          />
        )}
      </AnimatePresence>
    <div className="relative w-full max-w-2xl z-[110] group perspective-1000">
  {/* هاله نوری محیطی (Ambient Glow) - فقط در حالت فوکوس با انیمیشن پالس */}
  <div className={`absolute -inset-4 bg-gradient-to-r from-[#48E4B5]/20 via-cyan-400/10 to-[#48E4B5]/20 rounded-[3rem] blur-2xl transition-all duration-700 opacity-0 ${isOpen ? 'opacity-100 animate-pulse' : 'group-hover:opacity-40'}`} />

  <div className="relative flex items-center">
    {/* آیکون جستجو با افکت نئونی */}
    <div className={`absolute right-6 z-20 p-2 rounded-2xl transition-all duration-500 ${isOpen ? 'bg-[#48E4B5] text-slate-900 rotate-[90deg] shadow-[0_0_20px_rgba(72,228,181,0.5)]' : 'text-slate-400'}`}>
      <FiSearch size={20} strokeWidth={3} />
    </div>
    
    <input 
      type="text" 
      value={query}
      onFocus={() => setIsOpen(true)}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="جستجوی هوشمند در منابع..." 
      className={`w-full bg-white/70 backdrop-blur-3xl border-2 transition-all duration-700 py-6 pr-16 pl-24 rounded-[2.5rem] text-sm outline-none font-black tracking-tight
        ${isOpen 
          ? 'border-[#48E4B5] shadow-[0_20px_50px_rgba(0,0,0,0.1)] scale-[1.02] text-slate-900' 
          : 'border-transparent shadow-[0_10px_30px_rgba(0,0,0,0.04)] text-slate-500 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)]'}`} 
    />

    {/* میانبر کیبورد با استایل اپل داک */}
    <div className="absolute left-6 flex items-center gap-1.5 pointer-events-none">
      <kbd className="h-8 px-2.5 bg-slate-900 text-[#48E4B5] rounded-xl text-[10px] font-black flex items-center justify-center border-b-4 border-slate-700 shadow-lg">⌘</kbd>
      <kbd className="h-8 px-2.5 bg-slate-900 text-[#48E4B5] rounded-xl text-[10px] font-black flex items-center justify-center border-b-4 border-slate-700 shadow-lg">K</kbd>
    </div>
  </div>

  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: -15, scale: 0.9 }}
        animate={{ opacity: 1, y: 15, rotateX: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, rotateX: 10, scale: 0.9 }}
        className="absolute top-full w-full bg-white/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-white/50 p-6 z-20 overflow-hidden origin-top"
      >
        {query.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4 mb-2">
                <p className="text-[10px] font-[1000] text-slate-400 uppercase tracking-[0.4em]">برترین نتایج</p>
                <span className="text-[9px] font-bold bg-[#48E4B5]/10 text-[#36C298] px-3 py-1 rounded-full">{results.length} یافت شد</span>
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {results.length > 0 ? results.map((item, i) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-[2rem] hover:bg-white hover:shadow-xl hover:scale-[1.01] cursor-pointer transition-all group/item mb-2 border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center text-2xl group-hover/item:bg-[#48E4B5]/20 group-hover/item:rotate-6 transition-all duration-500">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 group-hover/item:text-[#36C298] transition-colors">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md uppercase">{item.type}</span>
                        <span className="text-[9px] font-bold text-slate-400">بروزرسانی شده</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center opacity-0 group-hover/item:opacity-100 group-hover/item:bg-[#1A1F2B] group-hover/item:text-white transition-all shadow-lg">
                    <FiArrowUpRight size={18} />
                  </div>
                </motion.div>
              )) : (
                <div className="py-16 text-center">
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl mb-4">🔭</motion.div>
                  <p className="text-xs font-[1000] text-slate-400 uppercase tracking-widest">موردی یافت نشد...</p>
                </div>
              )}
            </div>
            
            {/* فوتر Command-Bar */}
            <div className="mt-4 pt-6 border-t border-slate-100 flex items-center justify-between px-4">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                   <kbd className="p-1 bg-slate-100 rounded text-[8px] font-black border-b-2 border-slate-300">ESC</kbd>
                   <span className="text-[9px] font-bold text-slate-400 uppercase">بستن</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <kbd className="p-1 bg-slate-100 rounded text-[8px] font-black border-b-2 border-slate-300">↵</kbd>
                   <span className="text-[9px] font-bold text-slate-400 uppercase">انتخاب</span>
                </div>
              </div>
              <p className="text-[9px] font-black text-[#48E4B5] animate-pulse">جستجوی هوشمند فعال است</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            <div>
              <p className="text-[10px] font-[1000] text-slate-400 uppercase tracking-[0.4em] mb-4 px-2">پیشنهادهای داغ</p>
              <div className="flex flex-wrap gap-2">
                {['جزوه معماری', 'هوش مصنوعی', 'ریاضی ۲', 'فیزیک کوانتوم', 'داده‌کاوی'].map((tag, i) => (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={tag} 
                    className="px-5 py-2.5 bg-slate-50 hover:bg-[#1A1F2B] hover:text-white rounded-[1.2rem] text-[10px] font-black text-slate-600 transition-all border border-slate-100 hover:border-[#1A1F2B] shadow-sm active:scale-95"
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    )}
  </AnimatePresence>
</div>
    </>
  );
};
export default function UltimateMintDashboard() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // اگر از قبل useState را دارید، فقط خط دوم را اضافه کنید
const [isUploadOpen, setIsUploadOpen] = useState(false);
  const router = useRouter();
  // مدیریت انتخاب نوع فایل (جزوه یا کتاب)
const [fileType, setFileType] = useState('note'); // مقدار پیش‌فرض روی جزوه است
  const [activeTab, setActiveTab] = useState('خانه');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSearchActive, setIsSearchActive] = useState(false); 
  const [isExiting, setIsExiting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
const [rating, setRating] = useState(0); // برای ذخیره امتیاز ستاره‌ها
  
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds]
      .map((v) => v < 10 ? "0" + v : v)
      .join(":");
  };

  useEffect(() => {
    if (isSearchActive) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isSearchActive]);

  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: 'ریاضیات گسسته', progress: 75, date: '۲ روز پیش', category: 'مهندسی', icon: 'Σ', color: 'bg-blue-50 text-blue-500' },
    { id: 2, title: 'برنامه‌نویسی وب', progress: 40, date: 'دیروز', category: 'کامپیوتر', icon: '</>', color: 'bg-orange-50 text-orange-500' },
    { id: 3, title: 'هوش مصنوعی', progress: 15, date: '۳ ساعت پیش', category: 'تکنولوژی', icon: 'AI', color: 'bg-purple-50 text-purple-500' },
  ]);

  useEffect(() => {
    if (activeTab === 'خانه') {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeTab]);
  // این متغیر وضعیت شب یا روز بودن سایت را نگه می‌دارد
const [isDark, setIsDark] = useState(false);

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleLoginTransition = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push('/login');
    }, 1200);
  };
  return (
<div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-[#0F172A] text-slate-100' : 'bg-[#F8FAFB] text-slate-800'} font-['Vazirmatn',sans-serif] selection:bg-[#48E4B5]/30 overflow-hidden relative`}>  {/* دقیقا اینجا اضافه کن */}
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div 
      animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#48E4B5]/10 blur-[120px] rounded-full" 
    />
    <motion.div 
      animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-[40%] -right-[5%] w-[35%] h-[35%] bg-blue-400/10 blur-[100px] rounded-full" 
    />
  </div>
      <AnimatePresence>
        {isExiting && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2336C298' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
            />
            <div className="relative flex flex-col items-center">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [6, -6, 6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 mint-gradient rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-[#48E4B5]/40 mb-8"
              >
                <FiBookOpen className="text-white text-5xl" />
              </motion.div>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">جزو<span className="text-[#36C298]">ینو</span></h2>
                <p className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase mt-2">Smart Learning Platform</p>
                {/* دکمه تغییر تم */}
              </motion.div>
              <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-10 overflow-hidden relative">
                <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 mint-gradient w-1/2 rounded-full" />
              </div>
            </div>
          </motion.div>
          
        )}
      </AnimatePresence>
<style jsx global>{`
  body { 
    direction: rtl; 
    background-color: ${isDark ? '#0B0F1A' : '#F8FAFB'} !important;
  }
  
  .mint-gradient { 
    background: linear-gradient(135deg, #48E4B5 0%, #36C298 100%) !important; 
  }

  ${isDark ? `
    /* سفید کردن تمام متن‌ها با اولویت بالا */
    h1, h2, h3, h4, h5, h6, p, span, div, svg, 
    .text-slate-900, .text-slate-800, .text-slate-700, .text-slate-600 {
      color: #f8fafc !important; 
    }
    
    .text-slate-400, .text-slate-500 {
      color: #94a3b8 !important;
    }

    /* تیره کردن کارت‌ها و سایدبار */
    .bg-white, aside, .glass-card, header {
      background-color: #1A1F2B !important;
      border-color: rgba(255,255,255,0.1) !important;
    }

    /* اصلاح رنگ پس‌زمینه اینپوت سرچ در حالت شب */
    input {
      background-color: #0F172A !important;
      color: white !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
    }
  ` : ''}

  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { 
    background: ${isDark ? '#334155' : '#E2E8F0'}; 
    border-radius: 10px; 
  }
`}</style>
      <div className="flex h-screen overflow-hidden relative">
        <aside className="w-80 h-full bg-white/60 backdrop-blur-xl border-l border-slate-100 flex flex-col z-30">
          <div className="p-12 flex items-center gap-4">
            <div className="w-12 h-12 mint-gradient rounded-[1.2rem] rotate-6 flex items-center justify-center shadow-xl shadow-[#48E4B5]/30">
              <FiBookOpen className="text-white text-2xl -rotate-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">جزو<span className="text-[#36C298]">ینو</span></h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Smart Learning</p>
            </div>
          </div>
          <button 
  onClick={() => setIsDark(!isDark)}
  className={`mx-8 mb-4 p-3 rounded-2xl flex items-center justify-center transition-all ${isDark ? 'bg-slate-800 text-yellow-400' : 'bg-white text-slate-400 shadow-sm'}`}
>
  {isDark ? <FiZap /> : <FiMoon />} {/* اگر شب بود آیکون جرقه، اگر روز بود ماه */}
  <span className="mr-3 text-xs font-bold">{isDark ? 'حالت روز' : 'حالت شب'}</span>
</button>

          <nav className="flex-1 px-8 space-y-2">
            {[
              { name: 'خانه', icon: FiHome }, 
              { name: 'جزوات من', icon: FiBookOpen }, 
              { name: 'درباره ما', icon: FiVolume2 },
              { name: 'نظرات و امتیازدهی', icon: FiMessageCircle}, 
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                  activeTab === item.name ? 'bg-white shadow-xl shadow-slate-200/50 text-[#36C298]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="text-xl" />
                  <span className="text-sm font-bold">{item.name}</span>
                </div>
                {activeTab === item.name && <motion.div layoutId="activeTab" className="w-1.5 h-6 mint-gradient rounded-full" />}
              </button>
            ))}
            <button onClick={handleLoginTransition} className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:bg-[#48E4B5]/10 hover:text-[#36C298] transition-all duration-300 mt-4">
              <FiUser className="text-xl" />
              <span className="text-sm font-bold">ورود به حساب</span>
            </button>
          </nav>

          <div className="p-8">
            <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-xs opacity-60 mb-1">نسخه حرفه‌ای</p>
                <p className="text-sm font-bold mb-4">دسترسی نامحدود</p>
                <button className="bg-[#48E4B5] text-black text-[10px] font-black px-4 py-2 rounded-xl hover:scale-105 transition-transform">ارتقا حساب</button>
              </div>
              <FiZap className="absolute -bottom-4 -left-4 text-7xl opacity-10 group-hover:rotate-12 transition-transform duration-700" />
            </div>
          </div>
        </aside>
 
        <main className="flex-1 flex flex-col relative overflow-hidden">
         <header className="h-24 flex items-center justify-between px-12 z-[101] relative">
  {/* بخش سمت راست: جستجو */}
  <SmartSearch onStatusChange={setIsSearchActive} />
  
  {/* بخش سمت چپ: دکمه‌ها */}
  <div className="flex items-center gap-4">
    {/* دکمه پروفایل */}
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsProfileOpen(true)}
      className="w-12 h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-500 border border-white/50 dark:border-slate-700 shadow-sm hover:text-[#36C298] transition-colors"
    >
      <FiUser size={20} />
    </motion.button>

    {/* دکمه ورود */}
    <button 
      onClick={handleLoginTransition} 
      className="flex items-center gap-3 bg-[#48E4B5] hover:bg-[#36C298] text-black px-6 py-3 rounded-2xl shadow-lg shadow-[#48E4B5]/20 transition-all font-black text-xs group"
    >
      <span>ورود / ثبت‌نام</span>
      <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" />
    </button>
  </div>
</header>
          <div className="flex-1 overflow-y-auto px-12 pb-12 pt-4 custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === 'خانه' ? (
                <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
{/* --- Ultra-Wide Cinematic Hero Section --- */}
<section className="relative w-full h-[550px] group">
  {/* هاله نوری پس‌زمینه برای کل بخش */}
  <div className="absolute -inset-10 bg-[#48E4B5]/5 blur-[120px] rounded-full opacity-50" />

  <div className="relative h-full bg-slate-950 rounded-[4.5rem] overflow-hidden border-[1px] border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]">
    
    {/* اسلایدر اصلی */}
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <img 
          src={sliderImages[currentSlide]} 
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[15s] ease-linear" 
          alt="Hero"
        />
        {/* لایه‌های رنگی روی تصویر برای خوانایی متن */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </motion.div>
    </AnimatePresence>

    {/* محتوای متنی در سمت راست (کشیده و بزرگ) */}
    <div className="absolute inset-y-0 right-0 w-full md:w-2/3 p-20 flex flex-col justify-center items-start text-right">
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-8"
      >
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#48E4B5] animate-ping" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Trending Now</span>
        </div>

        <h2 className="text-8xl font-[1000] text-white leading-none tracking-tighter">
          دنیای <span className="text-[#48E4B5]">یادگیری</span> <br/> 
          <span className="text-slate-400">بدون مرز</span>
        </h2>

        <p className="max-w-xl text-lg text-slate-400 font-medium leading-relaxed">
          به پیشرفته‌ترین پلتفرم آموزشی کشور خوش آمدید. جایی که هوش مصنوعی مسیر یادگیری شما را طراحی می‌کند.
        </p>

        <div className="flex items-center gap-6 pt-4">
        
          
          <div className="flex flex-col gap-1 pr-6 border-r border-white/10">
            <span className="text-2xl font-black text-white">+۱۵۰۰</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">جزوه و کتاب فعال</span>
          </div>
        </div>
      </motion.div>
    </div>

    {/* ایندیکیتورهای پایین اسلایدر */}
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
      {sliderImages.map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentSlide(i)}
          className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-16 bg-[#48E4B5]' : 'w-4 bg-white/20 hover:bg-white/40'}`}
        />
      ))}
    </div>
  </div>
</section>
  <section className="mt-28 relative px-4 overflow-hidden">
  {/* پس‌زمینه مهندسی شده (خطوط گرید بسیار نازک) */}
  <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

  {/* هِدِر بخش با استایل Lab-Style */}
  <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
    <div className="flex items-start gap-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-[#48E4B5] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="relative w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center border border-white/10 overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-[#48E4B5]/30 rounded-full scale-110" 
          />
          <FiZap className="text-[#48E4B5]" size={28} />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="h-[1px] w-8 bg-[#48E4B5]" />
          <span className="text-[10px] font-black text-[#36C298] uppercase tracking-[0.4em]">Engineered for You</span>
        </div>
        <h3 className="text-4xl font-[1000] text-slate-900 tracking-tighter">پیشنهادات <span className="text-slate-400">هوشمند</span></h3>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
    {[1, 2].map((item) => (
      <motion.div
        key={item}
        whileHover={{ y: -8 }}
        className="group relative bg-white rounded-[3.5rem] p-2 border border-slate-200/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center gap-8 overflow-hidden min-h-[280px]"
      >
        {/* المان هندسی پس‌زمینه (اشکال نامتقارن ۲۰۲۵) */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-bl-[10rem] -z-0 transition-transform group-hover:scale-110 duration-700" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#48E4B5]/5 rounded-full blur-3xl" />

        {/* بخش ویژوال کتاب (سه بعدی و سایه‌دار) */}
        <div className="relative z-10 p-6">
          <div className="relative w-36 h-48 perspective-1000">
            <motion.div 
              whileHover={{ rotateY: -20, rotateX: 5 }}
              className="w-full h-full rounded-2xl overflow-hidden shadow-[20px_20px_40px_rgba(0,0,0,0.2)] border-l-[6px] border-white/20 relative"
            >
              <img 
                src={item === 1 ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400" : "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=400"} 
                className="w-full h-full object-cover" 
                alt="book"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>
            
            {/* بَج درصد تطابق با استایل Glassmorphism */}
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/80 backdrop-blur-md border border-white flex flex-col items-center justify-center shadow-xl rotate-12">
              <span className="text-[#36C298] text-[11px] font-[1000] leading-none">{item === 1 ? '۹۸%' : '۹۲%'}</span>
              <span className="text-[6px] font-black text-slate-400 uppercase">Match</span>
            </div>
          </div>
        </div>

        {/* محتوای متنی با چیدمان مهندسی */}
        <div className="relative z-10 flex-1 p-6 md:pr-0 space-y-6">
          <div className="space-y-2">
            <h4 className="text-2xl font-[1000] text-slate-900 tracking-tighter group-hover:text-[#36C298] transition-colors">
              {item === 1 ? 'الگوریتم‌های پیشرفته' : 'هوش مصنوعی در پزشکی'}
            </h4>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest">Comp Science</span>
              <div className="h-[1px] w-8 bg-slate-200" />
            </div>
          </div>

          {/* باکس Reason با استایل مدرن کپسولی */}
          <div className="relative">
             <div className="absolute left-0 top-0 w-1 h-full bg-[#48E4B5] rounded-full" />
             <div className="pl-4">
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed italic">
                  "تحلیل هوش مصنوعی نشان می‌دهد با توجه به تسلط شما بر <span className="text-slate-900">ساختمان داده</span>، این محتوا گام بعدی نبوغ شماست."
                </p>
             </div>
          </div>
          

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center shadow-lg transform group-hover:translate-x-1 transition-transform">
                      <span className="text-[8px]">👤</span>
                    </div>
                  ))}
               </div>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mr-2">Joined by 1.2k learners</span>
            </div>
            
            <motion.div 
              whileHover={{ x: 5 }}
         onClick={() => window.location.href = '/categories'} 
  
  // استایل‌های دکمه
  className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-[#48E4B5] group-hover:text-slate-950 transition-all cursor-pointer shadow-sm relative overflow-hidden"
>
  {/* افکت کلیک (اختیاری) */}
  <motion.div 
    whileTap={{ scale: 0.9 }} 
    className="absolute inset-0 bg-white/20 rounded-full"
  />
              <FiArrowLeft size={20} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</section> {/* --- The Masterpiece: Ultra-Dynamic Categories --- */}
<section className="mt-32 px-6 max-w-7xl mx-auto">
    {/* پس‌زمینه مهندسی شده (خطوط گرید بسیار نازک) */}
  <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

  {/* هِدِر بخش با استایل Lab-Style */}
  <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
    <div className="flex items-start gap-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-[#48E4B5] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="relative w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center border border-white/10 overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-dashed border-[#48E4B5]/30 rounded-full scale-110" 
          />
          <FiBookOpen className="text-[#48E4B5]" size={28} />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="h-[1px] w-8 bg-[#48E4B5]" />
          <span className="text-[10px] font-black text-[#36C298] uppercase tracking-[0.4em]">Engineered for You</span>
        </div>
        <h3 className="text-4xl font-[1000] text-slate-900 tracking-tighter">طبقه بندی <span className="text-slate-400">هوشمند</span></h3>
      </div>
    </div>
          </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {categories.map((cat) => (
      <motion.div
        key={cat.id}
          onClick={() => {
          // چک کردن اینکه آیا روی کارت‌های مورد نظر کلیک شده یا نه
          if (cat.name === 'کتب درسی' || cat.name === 'جزوات برتر') {
            setIsExiting(true); // اجرای انیمیشن لودینگ خفن شما
            
            setTimeout(() => {
              if (cat.name === 'کتب درسی') {
                router.push('/user_dashboard');
              } else if (cat.name === 'جزوات برتر') {
                router.push('/Jozavat'); 
            } }, 1300); // زمان مکث برای تکمیل انیمیشن لودینگ
          }
        }}
        // افکت سه‌بعدی ظریف
        whileHover={{ rotateX: 5, rotateY: -5, y: -10 }}
        style={{ perspective: "1000px" }}
        className="group relative bg-[#F8FAFC] rounded-[3rem] p-8 border border-white transition-all duration-500 cursor-pointer overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)]"
      >
        {/* ۱. پرتو نوری متحرک حاشیه (Border Beam) */}
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#36C298_360deg)] opacity-20"
          />
        </div>

        {/* ۲. لایه شیشه‌ای داخلی (Inner Glass) */}
        <div className="absolute inset-[1px] bg-white rounded-[2.9rem] z-10 overflow-hidden">
          {/* Spotlight هوشمند */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),_rgba(72,228,181,0.1)_0%,transparent_40%)]`} />
        </div>

        {/* ۳. بخش آیکون: مهندسی‌شده و مدرن */}
        <div className="relative z-20 mb-8 inline-block">
          {/* سایه نئونی پشت آیکون */}
          <div className={`absolute inset-0 blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-700 bg-gradient-to-br ${cat.color}`} />
          
          <motion.div 
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
            className="relative w-20 h-20 rounded-[2.2rem] bg-gradient-to-b from-white to-slate-50 border border-slate-100 flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)]"
          >
            <span className="text-4xl filter drop-shadow-[0_5px_5px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_8px_15px_rgba(54,194,152,0.3)] transition-all">
              {cat.icon}
            </span>
          </motion.div>
          
          {/* نشانگر وضعیت "آنلاین" در گوشه آیکون */}
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#36C298] opacity-20"></span>
            <div className="relative inline-flex rounded-full h-4 w-4 bg-white border-[3px] border-[#36C298] shadow-sm"></div>
          </div>
        </div>

        {/* ۴. متن با استایل تایپوگرافی نسل بعد */}
        <div className="relative z-20 space-y-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-[#36C298] uppercase tracking-[0.3em] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              Premium Content
            </span>
            <h4 className="text-2xl font-[900] text-slate-800 tracking-tight group-hover:tracking-normal transition-all duration-500">
              {cat.name}
            </h4>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-[#36C298]/10 group-hover:border-[#36C298]/20 transition-all">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36C298]" />
              <span className="text-[11px] font-bold text-slate-500 group-hover:text-[#36C298]">
                {cat.count} منبع
              </span>
            </div>
            
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 shadow-xl">
              <FiArrowUpRight size={22} />
            </div>
          </div>
        </div>

        {/* ۵. لاین پیشرفت نئونی (Progress Pulse) */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100/50 overflow-hidden z-20">
          <motion.div 
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className={`h-full bg-gradient-to-r ${cat.color} relative`}
          >
            <div className="absolute top-0 right-0 h-full w-8 bg-white/40 blur-md animate-pulse" />
          </motion.div>
        </div>
      </motion.div>
    ))}
  </div>
</section>
{/* --- بخش درباره ما فوق حرفه‌ای --- */}
<section className="mt-28 mb-20 relative">
  {/* المان‌های نوری تزئینی پشت زمینه */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
    <div className="absolute top-0 left-10 w-64 h-64 bg-[#48E4B5]/5 blur-[100px] rounded-full" />
    <div className="absolute bottom-0 right-10 w-80 h-80 bg-blue-400/5 blur-[120px] rounded-full" />
  </div>

  <div className="grid grid-cols-12 gap-12 items-center">
    
    {/* سمت چپ: محتوای متنی */}
    <div className="col-span-12 lg:col-span-6 space-y-8">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <span className="w-12 h-[2px] bg-[#36C298]"></span>
          <span className="text-[#36C298] text-xs font-black tracking-[0.2em] uppercase">Why Juzvino?</span>
        </div>
        <h3 className="text-5xl font-black text-slate-900 leading-[1.2]">
 تجربه یادگیری مدرن<br />
  {/* لایه درخشش پشت متن (Glow) */}
  <span className="absolute inset-0 blur-2xl bg-[#48E4B5]/20 group-hover:bg-[#48E4B5]/40 transition-all duration-700" aria-hidden="true">
    نسل جدید آموزش
  </span>     </h3>
   
        <p className="text-slate-500 text-sm leading-8 font-medium text-justify">
          جزوه ناب فقط یک مخزن فایل نیست؛ یک اکوسیستم هوشمند برای دانشجویان بلندپرواز است. ما با ترکیب تکنولوژی و آموزش، راهی ساخته‌ایم که در آن دسترسی به برترین جزوات دانشگاهی، فقط با یک کلیک امکان‌پذیر باشد. هدف ما ساده است: <span className="text-slate-900 font-bold">هیچ دانشجویی نباید به خاطر نبود منابع از یادگیری باز بماند.</span>
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {[
          { icon: <FiShield />, title: "امنیت محتوا", desc: "تایید اصالت فایل‌ها" },
          { icon: <FiAward />, title: "کیفیت برتر", desc: "جزوات اساتید برتر" }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center text-[#36C298] text-xl border border-slate-50">
              {item.icon}
            </div>
            <div>
              <h5 className="text-sm font-black text-slate-800">{item.title}</h5>
              <p className="text-[10px] text-slate-400 font-bold mt-1">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* سمت راست: ویژوال و آمار (خفن‌ترین بخش بصری) */}
    <div className="col-span-12 lg:col-span-6 relative h-[450px]">
      {/* کارت اصلی معلق */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 right-10 bottom-10 glass-card rounded-[4rem] border border-white shadow-2xl z-20 overflow-hidden flex flex-col items-center justify-center text-center p-10"
      >
        <div className="absolute top-0 left-0 w-full h-2 mint-gradient" />
        <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-6 shadow-inner">
          <FiUsers className="text-4xl text-[#36C298]" />
        </div>
        <h4 className="text-4xl font-black text-slate-900 mb-2">+۵۰,۰۰۰</h4>
        <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">دانشجوی فعال در پلتفرم</p>
        
        <div className="mt-8 flex -space-x-3 rtl:space-x-reverse">
          {[1,2,3,4,5].map(i => (
            <img 
              key={i}
              className="w-10 h-10 rounded-full border-4 border-white object-cover shadow-sm"
              src={`https://i.pravatar.cc/150?u=${i}`}
              alt="user"
            />
          ))}
          <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-900 text-white text-[8px] flex items-center justify-center font-bold">
            +10k
          </div>
        </div>
      </motion.div>

      {/* کارت‌های کوچک جانبی برای حس عمق */}
      <motion.div 
        initial={{ rotate: -10 }}
        animate={{ rotate: [-10, -5, -10], x: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-0 right-0 w-40 h-40 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-xl z-10 flex flex-col items-center justify-center p-4"
      >
        <FiStar className="text-yellow-400 text-2xl mb-2" />
        <span className="text-lg font-black text-slate-800">۴.۹/۵</span>
        <span className="text-[8px] font-bold text-slate-400 uppercase">رضایت کاربران</span>
      </motion.div>

      <motion.div 
        initial={{ rotate: 15 }}
        animate={{ rotate: [15, 20, 15], y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-44 h-24 bg-slate-900 rounded-[2rem] shadow-2xl z-30 flex items-center gap-4 p-5"
      >
        <div className="w-10 h-10 rounded-full bg-[#48E4B5] flex items-center justify-center text-black">
          <FiZap />
        </div>
        <div>
          <p className="text-[10px] font-black text-white">سرعت دانلود</p>
          <p className="text-[8px] text-[#48E4B5] font-bold">Ultra Fast</p>
        </div>
      </motion.div>
    </div>
  </div>
</section>
{/* ... انتهای بخش فعالیت‌ها که قبلاً داشتی ... */}
    </motion.div>

  ) : activeTab === 'نظرات و امتیازدهی' ? (
    /* --- شروع بخش نظرات میکس شده --- */
    <motion.div 
      key="reviews" 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -30 }}
      className="space-y-12 pb-20"
    >
      {/* --- ۱. بخش آمار خیره‌کننده (Bento Style Stats) --- */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* کارت امتیاز عددی */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-white flex flex-col items-center justify-center relative overflow-hidden group">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-[#48E4B5] blur-[80px] rounded-full -z-10"
          />
          <h4 className="text-7xl font-[1000] text-slate-900 tracking-tighter">۴.۹</h4>
          <div className="flex gap-2 my-5 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} fill="currentColor" size={24} className="drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
            ))}
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">میانگین رضایت دانشجویان</p>
        </div>

       {/* کارت اکشن ثبت نظر - نسخه Ultra UX */}
<div className="col-span-12 lg:col-span-8 bg-slate-900 rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between group transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(72,228,181,0.2)]">
  
  {/* لایه نوری پس‌زمینه که با هاور حرکت می‌کند */}
  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#48E4B5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

  <div className="relative z-10 space-y-8 text-center md:text-right">
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#48E4B5] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#48E4B5]"></span>
        </span>
        <span className="text-[10px] font-black uppercase tracking-tighter text-[#48E4B5]">بیش از ۱,۲۰۰ نظر جدید در این هفته</span>
      </motion.div>

      <h3 className="text-3xl md:text-4xl font-[1000] leading-tight">
        تجربه‌ات رو <br/> به <span className="text-[#48E4B5] relative">اشتراک بزار <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 138 9" fill="none"><path d="M1 7.5C30.5 2.5 107.5 -2.5 137 7.5" stroke="#48E4B5" strokeWidth="3" strokeLinecap="round"/></svg></span>
      </h3>
      
      <p className="text-slate-400 text-sm font-medium max-w-sm leading-7 mx-auto md:mr-0">
        نظرات شما مثل فانوس راه رو برای دانشجوهای دیگه روشن می‌کنه. یک دقیقه وقت بزار و نظرت رو بگو.
      </p>
    </div>

    <div className="flex flex-col md:flex-row items-center gap-6">
      <motion.button 
        onClick={() => setShowReviewModal(true)}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[#48E4B5] text-black px-12 py-6 rounded-[2.2rem] font-[1000] text-base flex items-center gap-4 shadow-[0_20px_40px_rgba(72,228,181,0.3)] transition-all"
      >
        بنویس برامون <FiPlus size={24} strokeWidth={3} />
      </motion.button>

      {/* بخش نمایش سریع آواتارها برای حس اجتماعی (Social Proof) */}
      <div className="flex -space-x-3 rtl:space-x-reverse items-center">
        {[1, 2, 3, 4].map((i) => (
          <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-slate-900 ring-2 ring-slate-800" alt="user" />
        ))}
        <span className="mr-4 text-[10px] font-bold text-slate-500">+۵۰ هزار دانشجو</span>
      </div>
    </div>
  </div>
  
  {/* آیکون پس‌زمینه با انیمیشن Floating */}
  <motion.div 
    animate={{ 
      y: [0, -20, 0],
      rotate: [-12, -8, -12]
    }}
    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    className="absolute left-[-2%] top-1/2 -translate-y-1/2 opacity-20 hidden lg:block"
  >
    <FiMessageCircle size={350} className="text-[#48E4B5]" />
  </motion.div>
</div>
      </div>

      {/* --- ۲. لیست نظرات (Pinterest / Masonry Style) --- */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {[
          { id: 1, name: "مهندس سهرابی", role: "ترم ۷ کامپیوتر", text: "واقعاً سرعت دانلود و کیفیت فایل‌ها شوکه کننده‌ است. دمتون گرم!", rate: 5, color: "bg-emerald-500", avatar: "11" },
          { id: 2, name: "دکتر مریم زارعی", role: "استاد دانشگاه", text: "منابع بسیار دقیق و دسته‌بندی شده هستند. برای دانشجوهایم پیشنهاد دادم.", rate: 5, color: "bg-blue-500", avatar: "5" },
          { id: 3, name: "رضا محمدی", role: "کنکوری", text: "بخش نمونه سوالات ریاضی واقعاً منو نجات داد. دسترسی خیلی سریعه.", rate: 4, color: "bg-orange-500", avatar: "8" },
          { id: 4, name: "نیلوفر اسدی", role: "دانشجوی معماری", text: "رابط کاربری سایت خیلی روان هست. اگر امکان پیش‌نمایش ویدئویی هم اضافه بشه عالیه.", rate: 5, color: "bg-purple-500", avatar: "12" },
          { id: 5, name: "علی تهرانی", role: "فارغ‌التحصیل", text: "بهترین پلتفرمی که تا حالا برای اشتراک جزوه دیدم.", rate: 5, color: "bg-cyan-500", avatar: "3" },
        ].map((rev, i) => (
          <motion.div 
            key={rev.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="break-inside-avoid bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-500 group relative mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img src={`https://i.pravatar.cc/150?u=${rev.avatar}`} className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border-2 border-slate-50" alt="" />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${rev.color} border-4 border-white rounded-full shadow-sm`} />
              </div>
              <div>
                <h5 className="text-sm font-[900] text-slate-800">{rev.name}</h5>
                <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{rev.role}</p>
              </div>
            </div>

            <p className="text-slate-500 text-xs leading-8 font-medium italic mb-8 relative z-10">
              “{rev.text}”
            </p>

            <div className="flex items-center justify-between border-t border-slate-50 pt-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <FiStar key={j} size={10} fill={j < rev.rate ? "#FACC15" : "none"} className={j < rev.rate ? "text-yellow-400" : "text-slate-200"} />
                ))}
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-1 text-[10px] font-black text-slate-400 hover:text-rose-500 transition-all">
                  <FiActivity size={14} /> {i + 2}
                </button>
                <button className="flex items-center gap-1 text-[10px] font-black text-slate-400 hover:text-[#36C298] transition-all">
                  <FiMessageCircle size={14} /> پاسخ
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        <AnimatePresence>
  {showReviewModal && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay با افکت Glassmorphism غلیظ برای تمرکز حواس */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setShowReviewModal(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-[12px]"
      />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        className="relative bg-white w-full max-w-xl rounded-[3.5rem] p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden"
      >
        {/* المان‌های تزئینی نوری */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#48E4B5]/20 blur-[80px] rounded-full" />
        
        {/* هدر مودال با چیدمان UX-Friendly */}
        <div className="relative z-10 flex justify-between items-center mb-8">
          <button 
            onClick={() => setShowReviewModal(false)}
            className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-rose-500 hover:text-white transition-all order-1"
          >
            <FiPlus size={20} className="rotate-45" />
          </button>
          <div className="text-right order-2">
            <h3 className="text-2xl font-[1000] text-slate-900">نقد و بررسی</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-1">تجربه شما به دیگران کمک می‌کند</p>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          
          {/* بخش امتیازدهی با ایموجی (فیدبک لحظه‌ای UX) */}
          <div className="bg-slate-50 rounded-[2.5rem] p-6 text-center border border-slate-100">
            <div className="text-3xl mb-3 animate-bounce">
              {rating === 1 ? "☹️" : rating === 2 ? "😐" : rating === 3 ? "🙂" : rating === 4 ? "😊" : rating === 5 ? "🤩" : "⭐"}
            </div>
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                >
                  <FiStar 
                    size={32} 
                    fill={star <= rating ? "#FACC15" : "none"} 
                    className={star <= rating ? "text-yellow-400" : "text-slate-200"} 
                  />
                </motion.button>
              ))}
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {rating === 0 ? "یک امتیاز انتخاب کنید" : `امتیاز شما: ${rating} از ۵`}
            </span>
          </div>

          {/* فیلد متن با تمرکز بالا */}
          <div className="space-y-3">
            <textarea 
              placeholder="نقاط قوت و ضعف این منبع را بنویسید..."
              className="w-full bg-slate-50 border-2 border-transparent focus:border-[#48E4B5] focus:bg-white rounded-[2rem] p-6 text-sm font-medium transition-all outline-none resize-none placeholder:text-slate-300 text-slate-700"
            />
          </div>

          {/* دکمه عملیاتی (Primary Action) */}
          <div className="flex flex-col gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-slate-900 text-[#48E4B5] py-5 rounded-[2rem] font-[1000] text-sm shadow-xl flex items-center justify-center gap-3"
            >
              ارسال و انتشار عمومی <FiMessageCircle size={18} />
            </motion.button>
            <p className="text-[9px] text-center text-slate-400 font-medium">
              با ارسال این فرم، با <span className="underline cursor-pointer">قوانین انتشار</span> جزوینو موافقت می‌کنید.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
      </div>
    </motion.div>
    /* --- پایان بخش نظرات میکس شده --- */
                
              ) : activeTab === 'جزوات من' ? (
                <motion.div key="notes" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-10">
                  {/* بخش آپلود جزوه با قابلیت کلیک برای باز شدن دراور */}
<section 
  onClick={() => setIsUploadOpen(true)} // این استیت را در بالا تعریف کنید
  className="relative h-64 glass-card rounded-[3.5rem] border-4 border-dashed border-[#48E4B5]/20 flex flex-col items-center justify-center group hover:border-[#48E4B5] transition-all duration-500 cursor-pointer overflow-hidden"
>
  <div className="absolute inset-0 bg-[#48E4B5]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
  
  <motion.div 
    whileHover={{ scale: 1.1, rotate: 90 }} 
    className="relative z-10 w-20 h-20 mint-gradient rounded-[2rem] flex items-center justify-center text-white shadow-lg mb-4"
  >
    <FiPlus size={32} />
  </motion.div>
  
  <div className="relative z-10 text-center">
    
    <h3 className="text-xl font-black text-slate-800">اشتراک‌گذاری جزوه جدید</h3>
    <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-widest">وارد کردن مشخصات استاد و دانشگاه</p>
  </div>
</section>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                      {notes.map((note) => (
                        <motion.div layout key={note.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 custom-shadow group relative overflow-hidden">
                          <div className="flex justify-between mb-6">
                            <div className={`w-14 h-14 ${note.color} rounded-2xl flex items-center justify-center text-xl font-black shadow-sm`}>{note.icon}</div>
                            <button onClick={() => deleteNote(note.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"><FiTrash2 /></button>
                          </div>
                          <h4 className="font-black text-lg text-slate-800 mb-1">{note.title}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold mb-6 italic"><FiClock /> {note.date} • {note.category}</div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black">
                              <span className="text-slate-400">پیشرفت مطالعه</span>
                              <span className="text-[#36C298]">{note.progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${note.progress}%` }} className="h-full mint-gradient rounded-full" />
                            </div>
                          </div>
                          <button className="w-full mt-6 py-4 bg-slate-900 text-white rounded-[1.5rem] text-xs font-black flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all hover:bg-black"><FiEye /> مطالعه سریع</button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
<motion.div 
  key="about-portal-full" 
  initial={{ opacity: 0, y: 30 }} 
  animate={{ opacity: 1, y: 0 }} 
  className="w-full mt-12"
>
  {/* کانتینر اصلی تمام‌صفحه */}
  <div className="w-full bg-slate-950 rounded-[4rem] p-8 md:p-16 relative overflow-hidden min-h-[700px] border border-slate-800 shadow-2xl flex flex-col justify-between group">
    
    {/* پس‌زمینه کهکشانی متحرک */}
    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#48E4B5]/10 rounded-full blur-[150px] animate-pulse" />
    <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px]" />

    {/* بخش اول: تیتر و متن اصلی (مرکزچین شده برای اثرگذاری بیشتر) */}
    <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
      <div className="inline-flex items-center gap-3 text-[#48E4B5] font-black text-[10px] tracking-[0.4em] uppercase bg-white/5 px-6 py-2 rounded-full border border-white/10">
        <span className="w-2 h-2 rounded-full bg-[#48E4B5] animate-ping" />
        The Future of Learning
      </div>
      
      <h3 className="text-5xl md:text-7xl font-[1000] text-white tracking-tighter leading-tight">
        ما فراتر از یک  <span className="text-[#48E4B5] drop-shadow-[0_0_30px_rgba(72,228,181,0.3)]">پلتفرم</span> هستیم
      </h3>
      
      <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-bold max-w-2xl mx-auto">
        در جزوینو، دانش با تکنولوژی ترکیب شده تا مرزهای یادگیری جابجا شود. ما به دنبال خلق تجربه‌ای هستیم که در آن هر کلیک، یک گام به سوی نبوغ باشد.
      </p>
    </div>

    {/* بخش دوم: ارزش‌های انتزاعی (چیدمان منظم افقی) */}
    <div className="relative z-10 flex flex-wrap justify-center gap-8 md:gap-16 py-12">
      {[
        { label: 'نوآوری', icon: '🚀', color: 'bg-[#48E4B5]', shadow: 'shadow-[#48E4B5]/20' },
        { label: 'سرعت', icon: '⚡', color: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
        { label: 'دقت', icon: '🎯', color: 'bg-purple-500', shadow: 'shadow-purple-500/20' }
      ].map((item, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.6 }}
          className="flex flex-col items-center gap-5"
        >
          <div className={`w-32 h-32 rounded-[3rem] border-2 border-white/10 ${item.color}/10 backdrop-blur-xl flex items-center justify-center text-5xl shadow-2xl relative group/ball transition-all hover:border-[#48E4B5]/50`}>
             <div className={`absolute inset-0 ${item.color} opacity-0 group-hover/ball:opacity-20 blur-2xl transition-all rounded-[3rem]`} />
             {item.icon}
          </div>
          <span className="text-[12px] font-[1000] text-white uppercase tracking-[0.3em]">{item.label}</span>
        </motion.div>
      ))}
    </div>

    {/* بخش سوم: فوتر و دکمه اصلی (تمام‌عرض) */}
    <div className="relative z-10 flex flex-col items-center gap-10 mt-8">
      
      {/* جداکننده نوری */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
        <div className="flex items-center gap-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
            <span className="w-12 h-[1px] bg-slate-800" />
            خلاقیت بی‌پایان در جریان است
            <span className="w-12 h-[1px] bg-slate-800" />
        </div>

        {/* دکمه انتقال با نهایت دیزاین (دقیقاً همان دکمه‌ای که دوست داشتی) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/about-details'}
          className="relative group/btn min-w-[320px]"
        >
          <div className="absolute inset-0 bg-[#48E4B5] rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-60 transition-all" />
          
          <div className="relative h-28 bg-[#1A1F2B] rounded-[2.5rem] flex items-center justify-between px-8 overflow-hidden border border-white/10 shadow-2xl">
            <div className="text-right">
              <span className="text-white text-xl font-[1000] block mb-0.5 tracking-tighter">مشاهده داستان ما</span>
              <span className="text-[#48E4B5] text-[9px] font-black uppercase tracking-widest">Discover our journey</span>
            </div>
            
            <div className="w-14 h-14 bg-[#48E4B5] rounded-2xl flex items-center justify-center text-slate-950 group-hover:rotate-[360deg] transition-transform duration-700 shadow-[0_0_30px_rgba(72,228,181,0.5)]">
              <FiArrowLeft size={24} strokeWidth={3} />
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  </div>
</motion.div>

              )}
              
            </AnimatePresence>
          </div>
          {/* --- Fixed AI Assistant Button --- */}
<div className="fixed bottom-8 left-8 z-[9999]">
  <motion.div
    initial={{ scale: 0, rotate: -20 }}
    animate={{ scale: 1, rotate: 0 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="relative group cursor-pointer"
  >
    {/* ۱. هاله نوری در حال تپش (Pulse Effect) */}
    <div className="absolute inset-0 bg-[#36C298] blur-2xl opacity-40 group-hover:opacity-70 animate-pulse transition-opacity" />

    {/* ۲. بدنه اصلی دکمه */}
    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-[2rem] border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl overflow-hidden group">
      
      {/* افکت نوری چرخشی داخل دکمه */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#48E4B5_360deg)] opacity-20"
      />

      {/* اموجی ربات با انیمیشن معلق */}
      <motion.span 
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 text-3xl md:text-4xl filter drop-shadow-[0_0_10px_rgba(72,228,181,0.5)]"
      >
        🤖
      </motion.span>

   <div className="relative group cursor-pointer">
  <motion.div 
    onClick={() => router.push('/test')} 
    // هدایت به صفحه تست
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    
    className="relative w-20 h-20 md:w-24 md:h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10"
  >
    {/* افکت نوری چرخشی داخل دکمه */}
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#48E4B5_360deg)] opacity-20"
    />

    {/* اموجی ربات با انیمیشن معلق */}
    <motion.span 
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10 text-3xl md:text-4xl filter drop-shadow-[0_0_10px_rgba(72,228,181,0.5)]"
    >
      🤖
    </motion.span>
      {/* ۳. تول‌تیپ (Tooltip) که با هاور ظاهر میشه */}
  <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
    <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3">
      <div className="flex flex-col text-right">
      </div>
      <div className="w-2 h-2 rounded-full bg-[#48E4B5] animate-ping" />
    </div>
    {/* فلش تول‌تیپ */}
    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45 border-t border-r border-white/10" />
  </div>
  </motion.div>

  </div>

    </div>

    {/* ۴. نشانگر اعلان (Notification Badge) */}
    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#FF4757] rounded-full border-4 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg">
      1
    </div>
     </motion.div>
    <AnimatePresence>
  {isProfileOpen && (
    <>
      {/* لایه تیره پشت پنل */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsProfileOpen(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150]"
      />

      {/* پنل اصلی */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white dark:bg-[#0F172A] shadow-[-20px_0_50px_rgba(0,0,0,0.2)] z-[151] p-8 border-l border-slate-100 dark:border-slate-800"
      >
        <div className="flex flex-col h-full">
          {/* هدر پنل */}
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-slate-800 dark:text-white">پروفایل کاربری</h3>
            <button 
              onClick={() => setIsProfileOpen(false)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
            >
              <FiPlus className="rotate-45 text-2xl" />
            </button>
          </div>

          {/* محتوا - کاربر */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img src="https://i.pravatar.cc/150?u=a" className="w-24 h-24 rounded-[2.2rem] border-4 border-[#48E4B5] p-1 object-cover" alt="avatar" />
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-xl shadow-lg text-white">
                <FiAward />
              </div>
            </div>
            <h4 className="mt-4 text-lg font-black text-slate-900 dark:text-white">نام کاربر</h4>
            <p className="text-xs text-slate-400 font-bold">عضو سطح طلایی جروینو</p>
          </div>

          {/* لیست آخرین فعالیت‌ها با قابلیت اسکرول */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">آخرین فعالیت‌ها</p>
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-4 mb-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-[1.5rem] transition-all cursor-pointer group border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-500">
                  <FiClock />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">مطالعه جزوه الگوریتم</p>
                  <p className="text-[10px] text-slate-400">۲ ساعت پیش • بخش ۳</p>
                </div>
              </div>
            ))}
          </div>

          {/* دکمه تنظیمات */}
          <button className="mt-8 w-full py-4 bg-slate-900 dark:bg-white dark:text-black text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
            <FiUser size={18} />
            تنظیمات حساب کاربری
          </button>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
  <AnimatePresence>
  {isUploadOpen && (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setIsUploadOpen(false)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xl z-[100] cursor-pointer"
      />
      
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-3xl rounded-t-[5rem] z-[101] p-1 shadow-[0_-20px_80px_-20px_rgba(54,194,152,0.3)] border-t border-white/50 overflow-hidden"
      >
        <div className="relative z-10 max-w-5xl mx-auto p-12 text-right">
          <div className="w-20 h-2 bg-slate-200/50 rounded-full mx-auto mb-12 shadow-inner" />
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
             <div className="order-2 md:order-1 flex gap-4">
                <div className="bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-white shadow-sm">
                   <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Max Capacity</p>
                   <p className="text-xl font-[1000] text-slate-800">۵۰ MB</p>
                </div>
             </div>
             <div className="order-1 md:order-2">
                <h3 className="text-5xl font-[1000] text-slate-900 tracking-tighter mb-2">میز کار <span className="text-emerald-500">انتشار</span></h3>
                <p className="text-slate-500 font-bold text-lg">نوع فایل و مشخصات آن را تعیین کنید</p>
             </div>
          </div>

          <div className="grid grid-cols-12 gap-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
            
            {/* انتخاب نوع فایل: جزوه یا کتاب */}
            <div className="col-span-12 space-y-4">
               <p className="text-xs font-[1000] text-slate-400 uppercase tracking-widest mr-4">Select Category / انتخاب دسته‌بندی</p>
               <div className="flex gap-4 p-2 bg-slate-100/50 rounded-[2.5rem] w-full max-w-md mr-auto md:mr-0">
                  <button 
                    onClick={() => setFileType('note')}
                    className={`flex-1 py-4 rounded-[2rem] font-black text-sm transition-all flex items-center justify-center gap-2 ${fileType === 'note' ? 'bg-white shadow-xl text-emerald-500' : 'text-slate-400'}`}
                  >
                    <FiEdit3 /> جزوه کلاسی
                  </button>
                  <button 
                    onClick={() => setFileType('book')}
                    className={`flex-1 py-4 rounded-[2rem] font-black text-sm transition-all flex items-center justify-center gap-2 ${fileType === 'book' ? 'bg-white shadow-xl text-emerald-500' : 'text-slate-400'}`}
                  >
                    <FiBookOpen /> کتاب مرجع
                  </button>
               </div>
            </div>

            {/* باکس آپلود فایل */}
            <div className="col-span-12 lg:col-span-5">
               {/* دکمه برگشت/بستن مدرن */}
<motion.button
  whileHover={{ scale: 1.1, rotate: -90 }}
  whileTap={{ scale: 0.9 }}
  onClick={() => setIsUploadOpen(false)}
  className="absolute top-8 left-8 z-[110] w-14 h-14 bg-white/50 backdrop-blur-2xl border border-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-xl shadow-slate-200/50 group"
>
  <FiX size={24} className="group-hover:stroke-[3px]" />
</motion.button>
               <label className="group relative flex flex-col items-center justify-center w-full h-full min-h-[350px] border-4 border-dashed border-slate-200 rounded-[4rem] bg-white/40 hover:bg-white hover:border-emerald-400/50 transition-all cursor-pointer">
                  <div className="flex flex-col items-center p-8 text-center">
                    <div className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl">
                       <FiFileText size={30} />
                    </div>
                    <p className="text-xl font-black text-slate-800 mb-2">انتخاب فایل اصلی</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Click or Drag & Drop</p>
                  </div>
                  <input type="file" className="hidden" />
               </label>
            </div>

            {/* فیلدها با آیکون اختصاصی */}
            <div className="col-span-12 lg:col-span-7 space-y-5">
               <div className="relative">
                  <FiHash className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input type="text" placeholder="عنوان دقیق (مثلاً: جزوه آناتومی ترم ۱)" className="w-full h-20 px-10 bg-white/60 border border-white rounded-[2.5rem] font-black text-lg outline-none focus:border-emerald-400 shadow-sm text-right" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                     <FiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                     <input type="text" placeholder="نام استاد / نویسنده" className="w-full h-18 px-10 bg-white/60 border border-white rounded-[2.5rem] font-bold outline-none focus:border-emerald-400 shadow-sm text-right" />
                  </div>
                  <div className="relative">
                     <FiMapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                     <input type="text" placeholder="دانشگاه / ناشر" className="w-full h-18 px-10 bg-white/60 border border-white rounded-[2.5rem] font-bold outline-none focus:border-emerald-400 shadow-sm text-right" />
                  </div>
               </div>

               {/* کارت نهایی انتشار */}
               <div className="p-8 bg-slate-900 rounded-[3rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center gap-4 relative z-10">
                     <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                        <FiCheck size={24} />
                     </div>
                     <div>
                        <p className="text-sm font-black">آماده برای انتشار</p>
                        <p className="text-[10px] text-slate-400">فایل توسط سیستم بررسی اولیه شد</p>
                     </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="h-14 px-8 bg-emerald-500 rounded-2xl font-black text-xs shadow-lg shadow-emerald-500/20"
                  >
                    تایید نهایی
                  </motion.button>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
</div>

        </main>
      </div>
    </div>
  );
}
