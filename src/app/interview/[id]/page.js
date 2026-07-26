"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getInterviewReportById, generateResumePdf } from "@/services/api";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { 
  Target, 
  AlertTriangle, 
  Zap, 
  FileText, 
  Download, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  Code2, 
  Users, 
  HelpCircle,
  BookmarkCheck,
  Calendar,
  CheckSquare
} from "lucide-react";
import Link from "next/link";

export default function InterviewReportStudio() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); 
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // 🎯 GSAP Refs
  const headerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    async function fetchReport() {
      if (!id || !user) return;
      try {
        const res = await getInterviewReportById(id);
        // 🚨 FIXED: Pull interviewReport directly from Express payload!
        const data = res?.interviewReport || res?.data || res;
        setReport(data);
      } catch (err) {
        console.error("Failed to load evaluation report:", err);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) {
      fetchReport();
    }
  }, [id, user, authLoading]);

  useGSAP(() => {
    if (!loading && report && headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [loading, report]);

  useGSAP(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const blobData = await generateResumePdf(id);
      const url = window.URL.createObjectURL(new Blob([blobData], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Tailored_Resume_${id.slice(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to synthesize custom resume PDF:", err);
      alert("Notice: Could not synthesize custom PDF at this moment. Please verify backend template routes.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-slate-500 gap-3">
        <Sparkles className="w-9 h-9 animate-spin text-blue-500 dark:text-cyan-400" />
        <span className="text-sm font-medium">Decrypting neural interview diagnostics...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-3" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Report Not Found</h1>
        <p className="mt-2 text-sm text-slate-500 max-w-md">This evaluation ID does not exist in your vault or has been restricted.</p>
        <Link href="/dashboard" className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold text-sm rounded-xl shadow-md transition-all">
          Return to Dashboard Hub
        </Link>
      </div>
    );
  }

  const score = report.matchScore || 0;
  const scoreBadgeColor =
    score >= 80
      ? "from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/30"
      : score >= 60
      ? "from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/30"
      : "from-rose-500/20 to-red-500/20 text-red-500 border-red-500/30";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* 🚀 Top Navigation Action Header */}
      <div ref={headerRef} className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-[#121620] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none">
        
        <div className="space-y-3">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Executive Dashboard</span>
          </Link>
          
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {report.title || "Software Engineering Role Diagnostic"}
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-4">
            <span>Evaluation ID: <strong className="font-mono text-slate-700 dark:text-slate-300">{id}</strong></span>
            <span>&bull;</span>
            <span>Generated via Google GenAI Engine</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
          {/* Match Score Display */}
          <div className={`px-6 py-4 rounded-2xl bg-gradient-to-r border flex flex-col items-center justify-center text-center shadow-inner ${scoreBadgeColor}`}>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-300">Job Compatibility</span>
            <span className="text-3xl font-black">{score}%</span>
          </div>

          {/* PDF Export Control */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 animate-bounce" />
            <span>{downloadingPdf ? "Synthesizing PDF..." : "Export AI-Tailored Resume"}</span>
          </button>
        </div>
      </div>

      {/* 🧭 Animated Navigation Tabs Control */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {[
          { id: "overview", label: "Readiness & Skill Gaps", icon: Target },
          { id: "technical", label: "Technical Intention Room", icon: Code2 },
          { id: "behavioral", label: "Behavioral STAR Coaching", icon: Users },
          { id: "roadmap", label: "Competency Study Roadmap", icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-2xl font-semibold text-xs sm:text-sm flex items-center gap-2.5 transition-all whitespace-nowrap cursor-pointer ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 🌟 TAB CONTENT AREA (GSAP Faded Panel) */}
      <div ref={contentRef} className="pb-12">
        
        {/* TAB 1: READINESS OVERVIEW & SKILL DEFICIENCY SEVERITY */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            
            {/* AI Score Rationale & Job Summary */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <span>Executive Role Diagnostic</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                {report.jobDescription ? (
                  <span><strong>Target Position Snapshot:</strong> {report.jobDescription.slice(0, 400)}...</span>
                ) : (
                  "Comprehensive alignment between candidate experience vault and core job description responsibilities."
                )}
              </p>
            </div>

            {/* Severity Tagged Skill Gaps Grid */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Identified Skill Deficit Gaps (Categorized by Severity)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prioritize brushing up on High-Severity gaps before scheduled screening interviews.
              </p>

              {(!report.skillGaps || report.skillGaps.length === 0) ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold text-center text-sm">
                  🎉 No critical skill gap deficiencies identified! Your profile demonstrates full competency for this role.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {report.skillGaps.map((gap, index) => {
                    const severity = (gap.severity || "medium").toLowerCase();
                    const pillColor =
                      severity === "high"
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                        : severity === "medium"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                        : "bg-blue-500/10 border-blue-500/30 text-blue-500 dark:text-cyan-400";

                    return (
                      <div
                        key={index}
                        className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-base font-extrabold text-slate-900 dark:text-white">{gap.skill || "Core Competency"}</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${pillColor}`}>
                              {severity} severity
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Recommended to bolster practical architectural fluency and project demos for this skillset before technical screening.
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: TECHNICAL INTENTION QUESTION ROOM */}
        {activeTab === "technical" && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <span>Technical Architecture & Deep-Dive Coaching</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Learn exactly *why* senior interviewers craft these questions and master the ideal tailored responses.
              </p>
            </div>

            {(!report.technicalQuestions || report.technicalQuestions.length === 0) ? (
              <p className="text-slate-500 text-sm italic">No technical questions recorded for this evaluation.</p>
            ) : (
              report.technicalQuestions.map((item, index) => (
                <div key={index} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-400 font-black flex items-center justify-center shrink-0 text-sm mt-1">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <div className="ml-0 sm:ml-12 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Interviewer Psychology & Intention</span>
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.intention}
                    </p>
                  </div>

                  <div className="ml-0 sm:ml-12 space-y-2">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <BookmarkCheck className="w-4 h-4" />
                      <span>Recommended Model Response Architecture</span>
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 bg-emerald-500/5 dark:bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 leading-relaxed font-mono">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: BEHAVIORAL LEADERSHIP SUITE (STAR METHOD) */}
        {activeTab === "behavioral" && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <span>Behavioral & STAR Leadership Competency Room</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Demonstrate engineering maturity, communication acuity, and stakeholder alignment under pressure.
              </p>
            </div>

            {(!report.behavioralQuestions || report.behavioralQuestions.length === 0) ? (
              <p className="text-slate-500 text-sm italic">No behavioral questions recorded for this evaluation.</p>
            ) : (
              report.behavioralQuestions.map((item, index) => (
                <div key={index} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 font-black flex items-center justify-center shrink-0 text-sm mt-1">
                      {index + 1}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {item.question}
                    </h3>
                  </div>

                  <div className="ml-0 sm:ml-12 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Target Leadership Signal & Intention</span>
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.intention}
                    </p>
                  </div>

                  <div className="ml-0 sm:ml-12 space-y-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1.5">
                      <BookmarkCheck className="w-4 h-4" />
                      <span>Structured STAR Narrative</span>
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 bg-blue-500/5 dark:bg-cyan-500/10 p-5 rounded-2xl border border-blue-500/20 leading-relaxed font-mono">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: COMPETENCY STUDY ROADMAP (DAY-BY-DAY SCHEDULE) */}
        {activeTab === "roadmap" && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Day-by-Day Preparation Itinerary</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your personalized study schedule compiled by AI to eliminate technical vulnerabilities.
              </p>
            </div>

            {(!report.preparationPlan || report.preparationPlan.length === 0) ? (
              <div className="p-8 rounded-3xl bg-white dark:bg-[#121620] border text-slate-500 text-sm">
                No day-by-day study roadmap was generated for this role structure.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.preparationPlan.map((plan, index) => (
                  <div key={index} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-lg space-y-5 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Header Badge */}
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                        <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>Day {plan.day || index + 1}</span>
                        </span>
                        <span className="text-xs font-semibold text-slate-400">Target Focus</span>
                      </div>

                      {/* Day Focus Title */}
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {plan.focus || "System Design Fundamentals"}
                      </h3>

                      {/* Task Items List */}
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Action Tasks:</span>
                        <ul className="space-y-2.5">
                          {(plan.tasks || []).map((task, tIndex) => (
                            <li key={tIndex} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              <CheckSquare className="w-4 h-4 text-blue-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
