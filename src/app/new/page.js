"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { generateInterviewReport } from "@/services/api";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Sparkles, FileText, Upload, Briefcase, Zap, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const GENERATION_STEPS = [
  "Parsing target job requirements & tech stack...",
  "Cross-referencing candidate competencies vs requirements...",
  "Calculating 0-100% role compatibility match score...",
  "Synthesizing interviewer intentions & technical deep-dives...",
  "Formulating STAR-method behavioral response architectures...",
  "Compiling tailored resume optimization metrics..."
];

export default function NewEvaluationPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  
  const [generating, setGenerating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState("");

  // 🎯 GSAP Target Refs
  const containerRef = useRef(null);
  const loadingCardRef = useRef(null);

  // Prefill default background from profile vault!
  useEffect(() => {
    if (user && user.defaultSelfDescription && !selfDescription) {
      setSelfDescription(user.defaultSelfDescription);
    }
  }, [user]);

  // Entrance animation
  useGSAP(() => {
    if (!authLoading && !generating) {
      gsap.fromTo(
        containerRef.current,
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      );
    }
  }, [authLoading, generating]);

  // Rotate diagnostic steps during active GenAI generation
  useEffect(() => {
    let interval;
    if (generating) {
      interval = setInterval(() => {
        setStepIndex((prev) => (prev + 1) % GENERATION_STEPS.length);
      }, 2500);
    } else {
      setStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [generating]);

  // Animate text transition during generation steps
  useGSAP(() => {
    if (generating && loadingCardRef.current) {
      gsap.fromTo(
        loadingCardRef.current,
        { scale: 0.98, opacity: 0.6 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [stepIndex, generating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError("Please provide a target job description to evaluate.");
      return;
    }

    setError("");
    setGenerating(true);

    try {
      const res = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      // Extract new interview ID whether Express returned report directly or inside { data: ... }
       const newReportId = res?.interviewReport?._id || res?._id || res?.data?._id;

      if (newReportId) {
        router.push(`/interview/${newReportId}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
      setError(
        err.response?.data?.message || "Failed to complete AI evaluation. Please check server connection or AI API key."
      );
      setGenerating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-slate-500">
        <Sparkles className="w-8 h-8 animate-spin text-blue-500 dark:text-cyan-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Authentication Required</h1>
        <p className="mt-2 text-sm text-slate-500 max-w-md">You must be signed in to access the Neural Interview Prep & Scorecard engine.</p>
        <Link href="/login" className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold text-sm rounded-xl shadow-md hover:bg-blue-500 transition-all">
          Sign In Now
        </Link>
      </div>
    );
  }

  // 🌟 MESH GENERATION SCREEN WHEN RUNNING AI INTAKE
  if (generating) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 relative overflow-hidden text-center">
        {/* Deep Pulsing Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/30 via-violet-600/30 to-cyan-400/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />

        <div ref={loadingCardRef} className="max-w-md w-full p-10 rounded-3xl bg-white/80 dark:bg-[#121620]/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-500/25 animate-bounce">
            <Zap className="w-8 h-8 animate-pulse" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Intelligence Synthesis
          </h2>

          <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/20 text-blue-600 dark:text-cyan-300 font-semibold text-sm">
            <span className="inline-block animate-pulse">{GENERATION_STEPS[stepIndex]}</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Our neural algorithms are dissecting candidate compatibility and formatting your custom ATS PDF resume. This process typically requires 5–15 seconds...
          </p>
        </div>
      </div>
    );
  }

  // 🌟 STANDARD INTAKE FORM STUDIO
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      
      {/* Subtle background flair */}
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-violet-500/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div ref={containerRef} className="space-y-8">
        
        {/* Page Title & Breadcrumbs */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>AI Diagnostic Room</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            New Job Readiness Evaluation
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Paste your target role below. Our neural engine will generate intension coaching, skill gap severities, and tailored ATS resume architectures.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Target Job Description */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <span>Target Job Description & Requirements *</span>
              </label>
              <span className="text-xs font-semibold text-rose-500">Required</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste the complete hiring description, responsibilities, and expected technical proficiency stack here.
            </p>
            <textarea
              required
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer — Next.js & React App Router. Requirements: 3+ years experience designing scalable architecture, Tailwind CSS, REST APIs..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all leading-relaxed resize-y font-sans"
            />
          </div>

          {/* Section 2: Candidate Bio / Pitch (Auto-Prefilled from Vault) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <span>Candidate Background / Elevator Pitch</span>
              </label>
              {user?.defaultSelfDescription && (
                <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Prefilled from Vault</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review or fine-tune your summary specifically for this evaluation.
            </p>
            <textarea
              rows={4}
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
              placeholder="Provide context on your engineering journey and relevant achievements..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all leading-relaxed resize-y"
            />
          </div>

          {/* Section 3: Resume PDF Override (Optional if stored in Vault) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Custom Resume Attachment (Optional)</span>
              </label>
              {user?.resumeUrl ? (
                <span className="text-xs font-semibold text-blue-500 dark:text-cyan-400">Vault Default Active</span>
              ) : (
                <span className="text-xs font-semibold text-amber-500">No Vault Default Found</span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Attach a custom PDF/DOCX for this job analysis, or leave empty to evaluate against your master resume stored in your Profile Vault.
            </p>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-2xl p-6 cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 transition-all group">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors mb-2" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {resumeFile ? resumeFile.name : "Click or drag & drop to attach Job-Specific Resume"}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
              <span>Synthesize AI Evaluation & Scorecard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
