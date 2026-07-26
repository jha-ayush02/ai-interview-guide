"use client"; // Required for GSAP timelines, useRefs, and smooth interactive animations!

import React, { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Sparkles, ArrowRight, CheckCircle2, Zap, Target, FileText, TrendingUp } from "lucide-react";

export default function LandingPage() {
  // 🎯 GSAP DOM Element Refs
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const cardsRef = useRef(null);

  // 1️⃣ GSAP Master Entrance Timeline
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Staggered reveal of hero text elements
    tl.fromTo(badgeRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(titleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.3")
      .fromTo(subtitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4")
      .fromTo(buttonsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
      .fromTo(
        cardsRef.current.children,
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.5)" },
        "-=0.2"
      );
  }, []);

  // 2️⃣ GSAP Interactive Card Levitation on Hover
  const handleCardHover = (e, enter) => {
    gsap.to(e.currentTarget, {
      y: enter ? -8 : 0,
      scale: enter ? 1.02 : 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden relative">
      
      {/* Subtle Background Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-violet-600/20 to-cyan-400/10 rounded-full blur-[120px] pointer-events-none -z-10 dark:opacity-70 opacity-40 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-indigo-500/15 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Main Hero Suite */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center flex flex-col items-center">
        
        {/* Animated Pill Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-cyan-400/30 text-blue-600 dark:text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 animate-spin" />
          <span>Next-Gen AI Career & Interview Coaching</span>
        </div>

        {/* Hero Title */}
        <h1 ref={titleRef} className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.15] text-slate-900 dark:text-white">
          Master Technical Interviews with{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-cyan-400 dark:via-blue-500 dark:to-violet-500 bg-clip-text text-transparent">
            AI-Driven Insight.
          </span>
        </h1>

        {/* Subtitle Pitch */}
        <p ref={subtitleRef} className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-normal leading-relaxed">
          Stop guessing why interviewers reject candidates. Our AI analyzes your job descriptions, pinpoints exact skill deficits by severity, reveals interviewer questions & intentions, and crafts tailored resume PDFs in seconds.
        </p>

        {/* Action Buttons */}
        <div ref={buttonsRef} className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
          <Link
            href="/new"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transition-all duration-200"
          >
            <span>Start AI Prep Evaluation</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-slate-700 dark:text-slate-200 bg-slate-200/60 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-2xl transition-all duration-200"
          >
            <span>View Past Reports & History</span>
          </Link>
        </div>
      </section>

      {/* Feature Value Showcase Cards (GSAP Staggered + Levitation Hover) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Match Score & Diagnostics */}
          <div
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
            className="p-8 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none transition-all duration-300 cursor-default group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">0-100% Job Match Scoring</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Our neural engine reads your profile against any target job description to compute real-time compatibility scores and categorize missing skills by High, Medium, or Low severity.
            </p>
          </div>

          {/* Card 2: Intention vs Model Answer */}
          <div
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
            className="p-8 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none transition-all duration-300 cursor-default group"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Interviewer Intention Revealer</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Don&apos;t just memorize answers. Learn exactly *why* senior hiring managers ask technical architecture or behavioral questions, alongside tailored STAR-method responses.
            </p>
          </div>

          {/* Card 3: Tailored AI Resumes & Roadmap */}
          <div
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
            className="p-8 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none transition-all duration-300 cursor-default group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Tailored Resume Export</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Instantly re-engineer your resume directly from your interview analysis and export a clean, high-ATS-scoring customized PDF optimized specifically for that role.
            </p>
          </div>

        </div>
      </section>

      {/* Infinite Skills Marquee / Footer Teaser */}
      <div className="w-full border-t border-slate-200/60 dark:border-slate-800/60 py-8 bg-slate-50/50 dark:bg-[#090b10]/50 backdrop-blur-sm mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
            Evaluated Technologies & Competency Roadmaps
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Data Structures & Algorithms</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">•</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">System Design & Architecture</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">•</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Next.js & React App Router</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">•</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Node.js & Express Security</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">•</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Behavioral Leadership (STAR)</span>
          </div>
        </div>
      </div>

    </div>
  );
}
