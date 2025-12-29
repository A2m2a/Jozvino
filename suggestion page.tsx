'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiTrendingUp,
  FiArrowLeft,
  FiDownload,
  FiStar,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

import {
  sendInteraction,
  fetchRecommendations,
  generateRecommendations,
} from '@/lib/recommender';


/* ===============================
  Fake data (later → API)
================================*/


export default function Page() {
  const router = useRouter();
  
  const [recommendedItems, setRecommendedItems] = useState<any[]>([]);
  const viewedOnce = useRef(false);

  /* ===============================
     Soft-view on page load
  ================================*/
 function clarifyViewOnce(data: any[]) {
  if (viewedOnce.current) return;

  data.forEach((item) => {
    sendInteraction({
      contentType: item.type, // book | handout ✅
      objectId: item.id,
      action: 'view',
      weight: 0.3,
    });
  });

  viewedOnce.current = true;
}

useEffect(() => {
  async function load() {
    await generateRecommendations();

    let data = await fetchRecommendations();

    // ✅ COLD START → BOOK + HANDOUT
    if (data.length === 0) {
      const { fetchFallbackContent } = await import('@/lib/recommender');
      data = await fetchFallbackContent();
    }

    setRecommendedItems(data);

    clarifyViewOnce(data);
  }

  load();
}, []);

 


  return (
    <div
      className="min-h-screen bg-slate-100 text-slate-900 font-[Vazirmatn]"
      dir="rtl"
    >
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-200/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#48E4B5] to-cyan-500 flex items-center justify-center shadow-lg">
              🤖
            </div>
            <div>
              <h1 className="font-black text-lg">جزوبینو</h1>
              <p className="text-[10px] tracking-widest text-slate-400">
                SMART RECOMMENDER
              </p>
            </div>
          </div>

          <div className="relative w-64">
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="جستجوی هوشمند..."
              className="w-full h-11 pr-12 pl-4 rounded-2xl bg-slate-100 border border-slate-200 focus:outline-none focus:border-[#48E4B5]"
            />
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 text-white p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#48E4B5_0%,transparent_45%)] opacity-30" />

          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-2 text-[#48E4B5] mb-4">
              <FiTrendingUp />
              <span className="text-xs font-black">پیشنهادات شخصی‌سازی‌شده</span>
            </div>

            <h2 className="text-5xl font-black leading-tight mb-4">
              دقیقاً آنچه
              <br />
              باید بخوانی
            </h2>

            <p className="text-slate-300 text-sm">
              موتور پیشنهاددهی، بر اساس تعاملات واقعی شما در حال یادگیری است.
            </p>
          </div>
        </div>
      </section>

      {/* ================= RECOMMENDATIONS ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <h3 className="text-xl font-black mb-8">برای شما</h3>

        <div className="grid md:grid-cols-2 gap-10">
          {recommendedItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              className="group relative bg-white rounded-[3rem] p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]"
            >
              {/* Match badge */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white shadow-xl flex flex-col items-center justify-center rotate-12">
                <span className="text-[#36C298] text-sm font-black">
                  {Math.round(item.match * 100)}%
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">
                  Match
                </span>
              </div>

              <h4 className="text-2xl font-black mb-3 group-hover:text-[#36C298] transition">
                {item.title}
              </h4>

              <p className="text-xs text-slate-500 italic mb-8">
                «{item.reason}»
              </p>

              <div className="flex items-center justify-between">
                {/* Actions */}
                <div className="flex gap-3">
                  {/* Download */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      sendInteraction({
                        contentType: item.type,
                        objectId: item.id,
                        action: 'download',
                        weight: 3,
                      })
                    }
                    className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-[#48E4B5] hover:text-black transition"
                  >
                    <FiDownload />
                  </motion.button>

                  {/* Rate */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      sendInteraction({
                        contentType: item.type,
                        objectId: item.id,
                        action: 'rate',
                        weight: 5,
                      })
                    }
                    className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-yellow-400 transition"
                  >
                    <FiStar />
                  </motion.button>
                </div>

                {/* Open */}
                <motion.div
                  whileHover={{ x: -6 }}
                  onClick={() => {
                    sendInteraction({
                      contentType: item.type,
                      objectId: item.id,
                      action: 'view',
                      weight: 1,
                    });
                    router.push('/categories');
                  }}
                  className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-[#48E4B5] group-hover:text-black transition cursor-pointer"
                >
                  <FiArrowLeft />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-28 py-10 text-center text-xs text-slate-400">
        Powered by Intelligent Recommender Engine 🤖
      </footer>
    </div>
  );
}
