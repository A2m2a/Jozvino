"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/auth";
import { User } from "@/types/user";
import {
  FiLogOut,
  FiMail,
  FiUser,
  FiLock,
  FiCamera,
  FiEdit3,
  FiSave,
  FiMoon,
  FiSun,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

/* =======================
   Types
======================= */
interface UserProfileData extends User {
  email?: string;
  avatar?: string | null;
}

/* =======================
   Toast
======================= */
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="w-80 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900">
      <div
        className={`px-5 py-4 text-xs font-black text-white ${
          type === "success"
            ? "bg-gradient-to-r from-emerald-400 to-teal-500"
            : "bg-gradient-to-r from-red-500 to-rose-600"
        }`}
      >
        {message}
      </div>
      <div className="h-1 bg-white/30 relative">
        <div className="absolute inset-0 bg-white animate-toast-progress" />
      </div>
    </div>
  );
}

/* =======================
   Page
======================= */
export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [fetching, setFetching] = useState(true);

  /* UI */
  const [dark, setDark] = useState(false);
  const [editing, setEditing] = useState(false);

  /* Toast Stack */
  const [toasts, setToasts] = useState<
    { id: number; message: string; type: "success" | "error" }[]
  >([]);

  const pushToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  /* Cinematic Exit */
  const [isExiting, setIsExiting] = useState(false);

  /* Editable */
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  /* Password */
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPass, setChangingPass] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  /* =======================
     Theme
  ======================= */
  useEffect(() => {
    const saved = localStorage.getItem("profile-theme");
    setDark(saved === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("profile-theme", dark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  /* =======================
     Auth + Fetch
  ======================= */
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    api
      .get<UserProfileData>("/users/me/")
      .then((res) => {
        setProfile(res.data);
        setUsername(res.data.username);
        setEmail(res.data.email || "");
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          logoutUser();
        }
      })
      .finally(() => setFetching(false));
  }, [loading, user, router]);

  /* =======================
     Avatar
  ======================= */
  const uploadAvatar = async (file: File) => {
    const form = new FormData();
    form.append("avatar", file);
    await api.patch("/users/me/avatar/", form);
    const refreshed = await api.get("/users/me/");
    setProfile(refreshed.data);
    pushToast("آواتار بروزرسانی شد ✅", "success");
  };

  /* =======================
     Save Profile
  ======================= */
  const saveProfile = async () => {
    await api.patch("/users/me/", { username, email });
    setProfile((p) => (p ? { ...p, username, email } : p));
    setEditing(false);
    pushToast("اطلاعات ذخیره شد ✅", "success");
  };

  /* =======================
     Change Password + Exit
  ======================= */
  const changePassword = async () => {
    if (!oldPassword || !newPassword) {
      pushToast("رمز فعلی و جدید الزامی است", "error");
      return;
    }

    setChangingPass(true);

    try {
      const res = await api.post("/auth/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      pushToast(res.data.detail || "رمز عبور تغییر کرد", "success");

      if (res.data.force_logout) {
        setIsExiting(true);
        setTimeout(() => logoutUser(), 1600);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const d = error.response?.data;
        pushToast(
          d?.detail || d?.new_password?.[0] || "خطا در تغییر رمز عبور",
          "error"
        );
      }
    } finally {
      setChangingPass(false);
    }
  };

  if (loading || fetching || !profile) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-400">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <>
      {/* 🎭 CINEMATIC EXIT */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/70 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center text-white"
            >
              <FiLogOut className="mx-auto mb-4 text-emerald-400 text-6xl animate-pulse" />
              <h2 className="text-xl font-black mb-1">خروج امن</h2>
              <p className="text-xs opacity-70">
                برای امنیت دوباره وارد شوید
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-100 dark:bg-[#0B0F1A] flex justify-center py-14 px-4 transition-colors">
        <div className="w-full max-w-xl rounded-[2.5rem] bg-white dark:bg-[#111827] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-8 text-slate-900 dark:text-slate-100">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-black text-lg">پروفایل کاربری</h1>
            <button
              onClick={() => setDark(!dark)}
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              {dark ? <FiSun /> : <FiMoon />}
            </button>
          </div>

          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div
              onClick={() => fileRef.current?.click()}
              className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden cursor-pointer flex items-center justify-center"
            >
              {profile.avatar ? (
                <img src={profile.avatar} className="w-full h-full object-cover" />
              ) : (
                <FiCamera className="text-3xl text-slate-400" />
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                e.target.files && uploadAvatar(e.target.files[0])
              }
            />
          </div>

          {/* Fields */}
          <div className="space-y-4 mb-6">
            <Field icon={<FiUser />} label="نام کاربری" value={username} editing={editing} onChange={setUsername} />
            <Field icon={<FiMail />} label="ایمیل" value={email} editing={editing} onChange={setEmail} />
          </div>

          <button
            onClick={editing ? saveProfile : () => setEditing(true)}
            className="w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 text-white dark:text-black"
          >
            {editing ? <FiSave /> : <FiEdit3 />}
            {editing ? "ذخیره تغییرات" : "ویرایش اطلاعات"}
          </button>

          {/* Password */}
          <div className="mt-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-3">
            <h3 className="font-black text-sm flex items-center gap-2">
              <FiLock /> تغییر رمز عبور
            </h3>

            {/* OLD PASSWORD */}
            <div className="relative">
              <input
                className="input pr-12"
                type={showOldPass ? "text" : "password"}
                placeholder="رمز فعلی"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />

              <motion.button
                type="button"
                onClick={() => setShowOldPass(!showOldPass)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.85 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <AnimatePresence mode="wait">
                  {showOldPass ? (
                    <motion.span
                      key="old-off"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <FiEyeOff />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="old-on"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <FiEye />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* NEW PASSWORD */}
            <div className="relative">
              <input
                className="input pr-12"
                type={showNewPass ? "text" : "password"}
                placeholder="رمز جدید"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <motion.button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.85 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <AnimatePresence mode="wait">
                  {showNewPass ? (
                    <motion.span
                      key="new-off"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <FiEyeOff />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="new-on"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <FiEye />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            <button
              disabled={changingPass}
              onClick={changePassword}
              className="w-full py-2 rounded-xl bg-slate-800 dark:bg-slate-100 text-white dark:text-black font-black text-xs disabled:opacity-50"
            >
              تغییر رمز و خروج
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              setIsExiting(true);
              setTimeout(() => logoutUser(), 1200);
            }}
            className="mt-6 w-full py-3 rounded-xl bg-red-500 text-white font-black text-xs flex justify-center gap-2"
          >
            <FiLogOut /> خروج از حساب
          </button>
        </div>
      </div>

      {/* Toast Stack */}
      <AnimatePresence>
        <div className="fixed bottom-8 right-8 z-[999] space-y-3">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() =>
                  setToasts((prev) =>
                    prev.filter((t) => t.id !== toast.id)
                  )
                }
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <style jsx global>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-toast-progress {
          animation: progress 3.2s linear forwards;
        }
        .input {
          width: 100%;
          height: 44px;
          padding: 0 12px;
          border-radius: 12px;
          background: transparent;
          border: 1px solid rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
}

/* =======================
   Field Component
======================= */
function Field({
  icon,
  label,
  value,
  editing,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs">
      {icon}
      <span className="w-20 font-bold">{label}</span>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-right"
        />
      ) : (
        <span className="flex-1 font-black">{value || "—"}</span>
      )}
    </div>
  );
}
