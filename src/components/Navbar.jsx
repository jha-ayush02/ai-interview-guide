"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Sun, Moon, Sparkles, LayoutDashboard, User, LogIn, LogOut, FileText } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  const navRef = useRef(null);
  const toggleBtnRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -80,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  const handleThemeToggle = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    if (toggleBtnRef.current) {
      gsap.fromTo(
        toggleBtnRef.current,
        { rotation: -180, scale: 0.3 },
        { rotation: 0, scale: 1, duration: 0.6, ease: "back.out(2)" }
      );
    }
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-[#0b0e14]/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            Ready<span className="text-fuchsia-500 dark:text-fuchsia-400">2</span><span className="text-violet-600 dark:text-purple-500">Role</span>
          </span>
        </Link>

        {/* Navigation & Action Controls */}
        <nav className="flex items-center gap-2 sm:gap-4">

          <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60">
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link href="/new" className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-cyan-400 bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/20 hover:bg-blue-500/20 px-3.5 py-1.5 rounded-xl transition-all">
            <FileText className="w-4 h-4 animate-bounce" />
            <span className="hidden md:inline">+ New Prep</span>
          </Link>

          <Link href="/profile" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </Link>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 my-auto hidden sm:block" />

          {/* Theme Toggle Button */}
          <button ref={toggleBtnRef} onClick={handleThemeToggle} aria-label="Toggle theme" className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 shadow-inner transition-colors cursor-pointer">
            {!mounted ? (
              <div className="w-5 h-5 opacity-0" />
            ) : resolvedTheme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {/* Dynamic Session Controls */}
          {user ? (
            <div className="flex items-center gap-2 pl-2">
              <span className="hidden sm:inline-block px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-500/30 text-blue-700 dark:text-cyan-300 rounded-lg">
                @{user.username || "dev"}
              </span>
              <button
                onClick={logout}
                title="Logout"
                className="p-2.5 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all duration-200">
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}

        </nav>
      </div>
    </header>
  );
}
