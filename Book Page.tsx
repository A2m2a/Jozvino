'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, FiDownload, FiStar, FiArrowRight,
  FiClock, FiLayers, FiAlertTriangle, FiX, FiActivity 
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

// --- ۱. کامپوننت امتیازدهی (بالای فایل تعریف شود) ---
const FileRating = ({ fileId }: { fileId: number }) => {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRate = (s: number) => {
    setScore(s);
    console.log(`امتیاز ${s} برای فایل ${fileId} ثبت شد.`);
  };

  return (
    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
      <span className="text-[10px] font-black text-slate-400 ml-2">امتیاز:</span>
      <div className="flex flex-row-reverse gap-1">
        {[5, 4, 3, 2, 1].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <FiStar
              size={16}
              className={`transition-colors ${
                star <= (hover || score) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
              }`}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const books = [
  { id: 1, title: 'زیست‌شناسی جامع', publisher: 'خیلی سبز', release: '۱۴۰۳/۰۵/۱۲', grade: 'دوازدهم', rating: 4.9, color: 'rgba(54, 194, 152, 0.5)', shadow: 'shadow-[#36C298]/20', img: 'https://images.unsplash.com/photo-1532187875605-2fe358511423?q=80&w=400' },
  { id: 2, title: 'فیزیک پایه نوین', publisher: 'گاج', release: '۱۴۰۳/۰۴/۳۰', grade: 'یازدهم', rating: 4.7, color: 'rgba(79, 70, 229, 0.5)', shadow: 'shadow-[#4F46E5]/20', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400' },
  { id: 3, title: 'ریاضیات تجربی الگو', publisher: 'نشر الگو', release: '۱۴۰۲/۱۱/۱۵', grade: 'جامع', rating: 4.8, color: 'rgba(244, 63, 94, 0.5)', shadow: 'shadow-[#F43F5E]/20', img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=400' },
  { id: 4, title: 'شیمی دوازدهم تک', publisher: 'مبتکران', release: '۱۴۰۳/۰۶/۰۱', grade: 'دوازدهم', rating: 5.0, color: 'rgba(139, 92, 246, 0.5)', shadow: 'shadow-[#8B5CF6]/20', img: 'https://images.unsplash.com/photo-1532187875605-2fe358511423?q=80&w=400' },
];

export default function LuxuryLightBooksPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedBookFiles, setSelectedBookFiles] = useState<any | null>(null);
  // --- ۲. استیت جدید برای مدیریت گزارش تخلف ---
  const [reportFileId, setReportFileId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const openFileDrawer = (book: any) => {
    const mockFiles = [
      { id: 101, title: 'نسخه اصلی (PDF)', file_size: '24MB', file_type: 'PDF', download_count: 1250 },
      { id: 102, title: 'پاسخنامه تشریحی', file_size: '5MB', file_type: 'PDF', download_count: 840 },
      { id: 103, title: 'خلاصه نموداری (ZIP)', file_size: '12MB', file_type: 'ZIP', download_count: 310 },
    ];
    setSelectedBookFiles({ ...book, files: mockFiles });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-['Vazirmatn'] overflow-x-hidden" dir="rtl">
      
      {/* Background Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#36C298]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4F46E5]/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="max-w-[1600px] mx-auto pt-20 px-8 md:px-20 relative z-10">
        
        {/* دکمه بازگشت */}
        <motion.button 
          onClick={() => router.back()}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-6 py-3 mb-8 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-500 font-bold text-sm hover:bg-slate-900 hover:text-white transition-all group"
        >
          <FiArrowRight className="text-lg transition-transform group-hover:translate-x-1" />
        </motion.button>
        
        {/* هدر */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-[#36C298] font-black text-xs uppercase tracking-[0.3em]">
              <div className="w-12 h-[2px] bg-[#36C298]" />
              Digital Library v2.0
            </motion.div>
            <h1 className="text-7xl md:text-8xl font-[1000] tracking-tighter leading-none text-slate-900">
              آرشیو <br /> <span className="text-[#36C298]">کتب درسی</span>
            </h1>
          </div>

          <div className="flex flex-col items-end gap-8 w-full md:w-auto">
             <div className="flex gap-6">
                <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Update Status</p>
                    <p className="text-sm font-black text-slate-700">درحال بروزرسانی</p>
                </div>
                <div className="w-[1px] h-10 bg-slate-200" />
                <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Active Books</p>
                    <p className="text-sm font-black text-[#36C298]">۲,۴۸۰ کتاب</p>
                </div>
             </div>
             
             <div className="relative w-full md:w-[450px] group">
                <FiSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#36C298] transition-colors size-5" />
                <input 
                    type="text" 
                    placeholder="جستجو در منابع..." 
                    className="w-full bg-white border border-slate-100 pr-16 pl-6 py-5 rounded-3xl outline-none shadow-sm focus:ring-2 focus:ring-[#36C298]/20 transition-all text-right"
                />
             </div>
          </div>
        </div>

        {/* گرید کتاب‌ها */}
        <div className="grid grid-cols-12 gap-8">
          {books.map((book, idx) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`relative group col-span-12 ${idx % 3 === 0 ? 'md:col-span-8' : 'md:col-span-4'} h-[550px] overflow-hidden rounded-[3.5rem] bg-white border border-slate-100 shadow-xl`}
            >
              <div className="absolute inset-0 w-full h-full">
                <img src={book.img} className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110" alt={book.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
              </div>

              <div className="absolute inset-0 p-12 flex flex-col justify-between z-20 text-right">
                <div className="flex justify-between items-start flex-row-reverse">
                  <span className="px-5 py-2 rounded-2xl bg-white shadow-sm border border-slate-50 text-[11px] font-black text-slate-800">{book.publisher}</span>
                  <div className="flex items-center gap-1.5 text-yellow-500 text-sm font-black bg-white px-3 py-1 rounded-xl shadow-sm">
                    <FiStar fill="currentColor" /> {book.rating}
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-5xl font-[1000] leading-[1.1] text-slate-900">{book.title}</h3>
                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-8">
                    <motion.button 
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      style={{ backgroundColor: book.color.replace('0.5', '1') }}
                      className="w-16 h-16 rounded-[2rem] text-white flex items-center justify-center shadow-2xl"
                      onClick={() => openFileDrawer(book)}
                    >
                      <FiDownload size={26} />
                    </motion.button>
                    <div className="flex gap-6 text-[11px] font-black text-slate-400 uppercase">
                      <span className="flex items-center gap-2">{book.grade} <FiLayers className="text-[#36C298]" /></span>
                      <span className="flex items-center gap-2">بروزرسانی <FiClock className="text-[#36C298]" /></span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
  {selectedBookFiles && (
    <>
      {/* لایه تاریک‌کننده پس‌زمینه با بلر شدید */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setSelectedBookFiles(null)}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xl z-[100] cursor-pointer"
      />
      
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-3xl rounded-t-[5rem] z-[101] p-1 shadow-[0_-20px_80px_-20px_rgba(54,194,152,0.3)] border-t border-white/50 overflow-hidden"
      >
        {/* نورهای خیره‌کننده متحرک در پس‌زمینه دراور */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden rounded-t-[5rem]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-400/20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto p-12 text-right">
          <div className="w-20 h-2 bg-slate-200/50 rounded-full mx-auto mb-12 shadow-inner" />
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
             <div className="order-2 md:order-1 flex gap-4">
                <div className="bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-white shadow-sm">
                   <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Total Assets</p>
                   <p className="text-xl font-[1000] text-slate-800">{selectedBookFiles.files.length} فایل</p>
                </div>
                <div className="bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-white shadow-sm">
                   <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Rating</p>
                   <p className="text-xl font-[1000] text-yellow-500 flex items-center gap-1">۴.۹ <FiStar fill="currentColor" size={14}/></p>
                </div>
             </div>
             <div className="order-1 md:order-2">
                <h3 className="text-5xl font-[1000] text-slate-900 tracking-tighter mb-2">میز کار <span className="text-emerald-500">دریافت</span></h3>
                <p className="text-slate-500 font-bold text-lg">{selectedBookFiles.title}</p>
             </div>
          </div>

          <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
            {selectedBookFiles.files.map((file: any, idx: number) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                {/* کارت فایل با استایل شیشه‌ای و نور لبه‌ها */}
                <div className="relative overflow-hidden p-8 rounded-[3.5rem] bg-white/40 border border-white/60 hover:border-emerald-400/50 transition-all duration-500 shadow-xl shadow-slate-200/50 group-hover:shadow-emerald-500/20">
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* دکمه دانلود با نور نئونی */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <motion.button 
                        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(54, 194, 152, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 md:flex-none h-16 px-12 bg-slate-900 text-white rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 relative overflow-hidden"
                      >
                        <span className="relative z-10">دانلود نسخه نهایی</span>
                        <FiDownload size={20} className="relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                      
                      <button 
                        onClick={() => setReportFileId(file.id)}
                        className="w-16 h-16 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-red-500 hover:shadow-lg hover:shadow-red-500/10 transition-all"
                      >
                        <FiActivity size={22} />
                      </button>
                    </div>

                    <div className="text-right flex-1">
                      <h4 className="font-[1000] text-slate-800 text-2xl mb-2">{file.title}</h4>
                      <div className="flex flex-row-reverse items-center gap-4">
                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-xl text-[10px] font-black">{file.file_type}</span>
                        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">{file.file_size}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-slate-400 font-bold text-xs">{file.download_count} بارگیری</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200/30 flex items-center justify-between">
                     <FileRating fileId={file.id} />
                     <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                        Ready to Sync
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
        {/* --- ۴. مدال گزارش تخلف (در انتهای تگ main) --- */}
        <AnimatePresence>
          {reportFileId && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={() => setReportFileId(null)}
                 className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" 
               />
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                 className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl text-right"
               >
                 <h3 className="text-2xl font-[1000] text-slate-900 mb-6 flex items-center justify-end gap-2">
                    گزارش مشکل فایل <FiAlertTriangle className="text-red-500" />
                 </h3>
                 <div className="space-y-4">
                    <select className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold outline-none focus:border-red-500">
                      <option>فایل باز نمی‌شود</option>
                      <option>محتوای اشتباه</option>
                      <option>کیفیت پایین اسکن</option>
                    </select>
                    <textarea 
                      placeholder="توضیحات تکمیلی..."
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl h-32 outline-none focus:border-red-500"
                    />
                    <button 
                      onClick={() => setReportFileId(null)}
                      className="w-full py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
                    >
                      ثبت گزارش
                    </button>
                 </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>


      </main>

      {/* استایل‌های CSS سفارشی */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap');
        body { background-color: #F8FAFC; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}