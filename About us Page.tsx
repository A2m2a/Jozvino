"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Instagram, BookOpen, Sparkles, Star, TrendingUp, Award, Zap, CheckCircle } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutPage() {
  const [activeStat, setActiveStat] = useState(0);
  
  const stats = [
    { value: "5000+", label: "کتاب فروخته‌شده", icon: <BookOpen className="w-5 h-5" /> },
    { value: "98%", label: "رضایت مشتریان", icon: <Star className="w-5 h-5" /> },
    { value: "200+", label: "جزوه تخصصی", icon: <Award className="w-5 h-5" /> },
    { value: "24/7", label: "پشتیبانی", icon: <Zap className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 text-slate-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-100/10 rounded-full blur-3xl"></div>
      </div>

      <section className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">تجربه خرید متفاوت</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-700 bg-clip-text text-transparent mb-6 leading-tight">
            ما فقط کتاب نمی‌فروشیم
            <br />
            <span className="text-5xl md:text-5xl font-bold bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-700 bg-clip-text text-transparent mb-6 leading-tight">تجربه یادگیری می‌سازیم</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            اینجا جایی است که کتاب و جزوه، برای <span className="font-semibold text-cyan-600">خواندن واقعی</span> ساخته شده‌اند؛ 
            <span className="font-semibold text-cyan-600"> خلاصه</span>، 
            <span className="font-semibold text-cyan-600"> دقیق</span>، 
            <span className="font-semibold text-cyan-600"> بدون حاشیه </span> 
            و مناسب افرادی که <span className="font-bold text-cyan-600">زمانشان ارزشمند است</span>
          </p>
        </motion.div>

        {/* Hero Section with Image & Stats */}
        
        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          {/* Left Side - Image with Overlay */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group"
          >
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-teal-200/50">
              <Image
                src="/image/aks-ketab.jpg"
                alt="فضای حرفه‌ای کتابفروشی"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-teal-900/40 to-transparent"></div>
              
              {/* Floating Stats */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStat}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-2 rounded-lg">
                      {stats[activeStat].icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-teal-800">{stats[activeStat].value}</div>
                      <div className="text-sm text-slate-600">{stats[activeStat].label}</div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Content Overlay */}
             
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-2xl rotate-12 -z-10 opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl -rotate-12 -z-10 opacity-20"></div>
          </motion.div>

          {/* Right Side - Features */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8">
              چرا ما متفاوتیم؟
              <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mt-2 rounded-full"></div>
            </h3>
            
            {[
              { icon: <TrendingUp />, title: "بهینه‌سازی زمان", desc: "مطالب غیرضروری حذف شده تا در کمترین زمان بیشترین یادگیری را داشته باشید" },
              { icon: <CheckCircle />, title: "تضمین کیفیت", desc: "هر محتوا توسط متخصصان بررسی و تأیید نهایی می‌شود" },
              { icon: <Zap />, title: "آپدیت مداوم", desc: "محتوای ما همگام با جدیدترین تغییرات و استانداردها به‌روزرسانی می‌شود" },
              { icon: <Award />, title: "تخصص محوری", desc: "تمرکز بر منابع تخصصی و کاربردی برای هر رشته و حرفه" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="group"
              >
                <Card className="border border-slate-200/50 bg-white/50 backdrop-blur-sm hover:border-teal-200 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-3 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h4>
                        <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Contact Cards - Premium Design */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              در تماس باشید
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
              ما اینجا هستیم تا بهترین تجربه یادگیری را برای شما ایجاد کنیم
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "آدرس ما",
                content: "تهران، خیابان مکان، پلاک ۱۲",
                gradient: "from-blue-500 to-cyan-500",
                hover: "hover:shadow-blue-200"
              },
              {
                icon: <Phone className="w-8 h-8" />,
                title: "شماره تماس",
                content: "۰۹۱۲ ۰۰۰ ۰۰۰۰",
                gradient: "from-teal-500 to-emerald-500",
                hover: "hover:shadow-teal-200"
              },
              {
                icon: <Instagram className="w-8 h-8" />,
                title: "اینستاگرام",
                content: "@yourpage",
                gradient: "from-rose-500 to-pink-500",
                hover: "hover:shadow-rose-200",
                isLink: true
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className={`border-0 bg-gradient-to-br ${item.gradient} p-1 rounded-2xl shadow-lg ${item.hover} transition-all duration-300`}>
                  <CardContent className="bg-white rounded-xl p-8 h-full">
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${item.gradient} text-white`}>
                        {item.icon}
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                        {item.isLink ? (
                          <a
                            href="https://instagram.com/yourpage"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent hover:underline"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-lg font-semibold text-slate-700">{item.content}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial / Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 rounded-3xl"></div>
          <div className="relative p-8 md:p-12 rounded-3xl border border-teal-100/50 backdrop-blur-sm">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-block p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <blockquote className="text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed mb-8">
                کتاب‌های ما برای <span className="text-teal-600">تغییر زندگی</span> ساخته شده‌اند
                <br />
                نه فقط برای پر کردن قفسه‌ها
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full"></div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800">تیم حرفه‌ای ما</p>
                  <p className="text-slate-600">مؤلفان و مترجمان متخصص</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-4 rounded-full shadow-2xl shadow-teal-500/30 z-50"
      >
        <Phone className="w-6 h-6" />
      </motion.button>
    </main>
  );
}