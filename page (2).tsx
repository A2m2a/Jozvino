'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'; import {
  FiUser, FiDownload, FiArrowRight, FiSearch, FiLayers,
  FiBookOpen, FiActivity, FiAward, FiLoader, FiZap
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface Handout {
  id: string | number;
  title: string;
  subject: string;
  master: string;
  university: string;
  pages: number;
  image: string;
  fileUrl?: string;
  reason?: string; // فیلد جدید اضافه شد
}

const HandoutCard = ({ item, index }: { item: Handout, index: number }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // افکت چرخش ۳ بعدی ملایم در هنگام حرکت موس
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(16,185,129,0.12)] transition-all duration-500"
    >
      <div className="relative h-72 rounded-[2rem] overflow-hidden mb-6 shadow-inner">
        <motion.img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm">
            {item.university}
          </span>
        </div>
      </div>

      <div className="space-y-4 px-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg mb-2 uppercase tracking-tighter">
              {item.subject}
            </span>
            <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">
              {item.title}
            </h3>
          </div>
          <div className="text-left">
            <span className="text-[14px] font-black text-slate-300">#{index + 1}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 py-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <FiUser className="text-slate-500 group-hover:text-emerald-600" size={14} />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold">مدرس دوره</p>
            <p className="text-xs font-black text-slate-700">{item.master}</p>
          </div>
          <div className="mr-auto text-left">
            <p className="text-[9px] text-slate-400 font-bold">حجم</p>
            <p className="text-xs font-black text-slate-700">{item.pages} ص</p>
          </div>
        </div>

        <button
          onClick={() => setIsDownloading(true)}
          className="w-full h-14 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center gap-3 text-xs font-bold hover:bg-emerald-500 transition-all duration-300 group/btn overflow-hidden relative"
        >
          <AnimatePresence mode="wait">
            {isDownloading ? (
              <motion.div key="loader" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}>
                <FiLoader className="animate-spin" size={18} />
              </motion.div>
            ) : (
              <motion.div key="text" className="flex items-center gap-2" initial={{ y: 20 }} animate={{ y: 0 }}>
                <FiDownload className="group-hover/btn:-translate-y-1 transition-transform" />
                <span>دریافت نسخه اصلی</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

export default function UserDashboard() {
  const [handouts, setHandouts] = useState<Handout[]>([]);
  // ۱. اضافه کردن استیت جدید برای پیشنهادات
  const [recommendations, setRecommendations] = useState<Handout[]>([]);
  const router = useRouter();

  useEffect(() => {
    // لیست اصلی جزوات (کد قبلی خودت)
    setHandouts([
      { id: 1, title: "اصول بیوشیمی پزشکی", subject: "پزشکی", master: "دکتر مهدوی", university: "دانشگاه تهران", pages: 156, image: "https://images.unsplash.com/photo-1532187863486-abf9d397198a?q=80&w=400" },
      { id: 2, title: "تحلیل سازه‌های بتنی", subject: "عمران", master: "مهندس نوری", university: "صنعتی شریف", pages: 92, image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400" },
      { id: 3, title: "مبانی هنرهای تجسمی", subject: "هنر", master: "استاد رضوانی", university: "دانشگاه هنر", pages: 45, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400" },
    ]);

    // ۲. پر کردن لیست پیشنهادات هوشمند (با فیلد reason)
    setRecommendations([
      { id: 101, title: "ریاضیات مهندسی پیشرفته", subject: "ریاضی", master: "دکتر نیکوکار", university: "صنعتی امیرکبیر", pages: 210, image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=400", reason: "چون ریاضی ۱ را خواندید" },
      { id: 102, title: "فیزیک کوانتوم ۱", subject: "فیزیک", master: "دکتر گلشنی", university: "صنعتی شریف", pages: 185, image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400", reason: "بر اساس علاقه شما به فیزیک" },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['Vazirmatn'] text-slate-900 pb-20 selection:bg-emerald-100 selection:text-emerald-900" dir="rtl">

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-50/50 rounded-full blur-[100px]" />
      </div>
      <nav className="max-w-7xl mx-auto px-8 py-10 flex justify-between items-center relative z-20">
        <motion.button
          onClick={() => router.back()}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: 5 }} // حرکت ملایم به سمت راست (در جهت برگشت در RTL)
          className="group flex items-center gap-4 cursor-pointer"
        >
          {/* باکس آیکون برگشت */}
          <div className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-[1.2rem] shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-300">
            <FiArrowRight
              className="text-slate-600 group-hover:text-white transition-colors"
              size={22}
            />
          </div>

          {/* متن دکمه */}
          <div className="flex flex-col items-start">
          </div>
        </motion.button>

        {/* المان سمت چپ (اختیاری - مثل زمان یا وضعیت سیستم) */}
        <div className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">
          Ocean System v2.0
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-8 mt-16 mb-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* بخش متن و تیتر */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-center lg:text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black mb-6 border border-emerald-100/50 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              بروزرسانی شده با ۱۲۰۰ جزوه جدید امروز
            </div>
            <h1 className="text-6xl md:text-8xl font-[1000] tracking-[calc(-0.05em)] leading-[1] mb-8 text-slate-900 relative">
              جستجو در <br />
              <span className="relative inline-block">
                {/* --- پالت رنگی متحرک پشت متن --- */}
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute -inset-4 bg-gradient-to-r from-emerald-400/30 via-cyan-400/30 to-blue-400/30 blur-2xl rounded-full -z-10"
                />
                <span className="relative z-10 bg-gradient-to-l from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                  اقیانوس علم.
                </span>

                {/* خط موج‌دار زیر متن با انیمیشن دریایی */}
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="absolute -bottom-4 right-0 w-full h-4 text-emerald-300/40"
                  viewBox="0 0 300 20"
                >
                  <motion.path
                    animate={{
                      d: [
                        "M0 10 Q37.5 0 75 10 T150 10 T225 10 T300 10",
                        "M0 10 Q37.5 20 75 10 T150 10 T225 10 T300 10",
                        "M0 10 Q37.5 0 75 10 T150 10 T225 10 T300 10"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
            </h1>
            <p className="text-slate-400 font-medium text-xl leading-relaxed mb-10 max-w-lg">
              دسترسی به عمیق‌ترین منابع آموزشی دانشگاه‌های برتر ایران، با رابط کاربری که اجازه می‌دهد فقط روی <span className="text-slate-900 font-black">یادگیری</span> تمرکز کنید.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-2xl shadow-slate-300 hover:bg-emerald-600 transition-all active:scale-95">
                شروع کاوش سریع
              </button>
              <button className="px-8 py-4 bg-white text-slate-600 border border-slate-100 rounded-2xl font-black hover:bg-slate-50 transition-all">
                مشاهده ویدیو معرفی
              </button>
            </div>
          </motion.div>

          {/* المان بصری خیره‌کننده (اقیانوس انتزاعی) */}
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            {/* دایره‌های شناور در پس‌زمینه */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-blue-50 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl opacity-50"
            />

            {/* کارت شناور هدر */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 bg-white/80 backdrop-blur-2xl p-8 rounded-[3rem] border border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] ring-1 ring-slate-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <FiBookOpen size={24} />
                </div>
                <div>
                  <div className="h-2 w-24 bg-slate-100 rounded-full mb-2" />
                  <div className="h-2 w-16 bg-slate-50 rounded-full" />
                </div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100" />
                    <div className="h-2 flex-1 bg-slate-50 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                <span className="text-xs font-black text-emerald-500 uppercase">Live Stats</span>
                <span className="text-xs font-bold text-slate-400">4.9/5 Rating</span>
              </div>
            </motion.div>

            {/* آیکون‌های شناور جانبی */}
            <motion.div
              animate={{ y: [0, 30, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute top-0 right-0 p-4 bg-white rounded-2xl shadow-xl border border-slate-50"
            >
              <FiAward className="text-orange-400" size={24} />
            </motion.div>
          </div>

        </div>
      </header>
      

      <main className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <FiLayers className="text-emerald-500" />
            آخرین جزوات اضافه شده
          </h3>
          <div className="flex gap-2">
            <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-500 cursor-pointer transition-colors">
              <FiSearch />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {handouts.map((item, idx) => (
            <HandoutCard key={item.id} item={item} index={idx} />
          ))}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-8 mt-32 relative z-10">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3.5rem] p-10 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 blur-[100px]" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-right">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">جزوه خاصی مد نظرت است؟</h2>
              <p className="text-slate-400 text-lg font-medium max-w-md">کافیست نام درس یا استاد را برای ما بفرستید، ما آن را برایتان پیدا می‌کنیم.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-base flex items-center gap-4 hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-xl shadow-emerald-500/20"
            >
              ثبت درخواست هوشمند
              <FiArrowRight className="group-hover:translate-x-[-5px] transition-transform" />
            </motion.button>
          </div>
        </div>
        <div className="mt-12 text-center text-slate-400 text-[11px] font-bold tracking-widest uppercase">
          Designed for Excellence • 2024
        </div>
      </footer>
    </div>
  );
}