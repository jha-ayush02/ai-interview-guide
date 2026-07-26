"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getAllInterviewReports } from "@/services/api";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { 
  LayoutDashboard, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  CheckCircle2 
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🎯 GSAP References
  const statsRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    async function fetchReports() {
      if (!user) return;
      try {
        const res = await getAllInterviewReports();
        // Handle whether backend returns array directly or inside { data: [...] }
        const reportList = res?.interviewReports || (Array.isArray(res) ? res : []);
        setReports(reportList);
      } catch (err) {
        console.error("Failed to load interview reports:", err);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) {
      fetchReports();
    }
  }, [user, authLoading]);

  // 🌟 GSAP Animations when reports load
  useGSAP(() => {
    if (!loading && reports.length >= 0) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (statsRef.current) {
        tl.fromTo(statsRef.current.children, { y: 25, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 0.6 });
      }
      if (gridRef.current && gridRef.current.children.length > 0) {
        tl.fromTo(gridRef.current.children, { y: 30, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.6 }, "-=0.3");
      }
    }
  }, [loading, reports]);

  // 🧮 Compute Executive KPIs
  const totalEvaluations = reports.length;
  const avgMatchScore = totalEvaluations
    ? Math.round(reports.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / totalEvaluations)
    : 0;
  
  // Count total high severity missing skills across reports
  const totalHighSeverityGaps = reports.reduce((acc, curr) => {
    const highGaps = (curr.skillGaps || []).filter((gap) => gap.severity?.toLowerCase() === "high");
    return acc + highGaps.length;
  }, 0);

  // Loading spinner
  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-slate-500 gap-3">
        <Sparkles className="w-9 h-9 animate-spin text-blue-500 dark:text-cyan-400" />
        <span className="text-sm font-medium">Analyzing career intelligence data...</span>
      </div>
    );
  }

  // Not logged in guard
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
        <p className="mt-2 text-sm text-slate-500 max-w-md">Please sign in to view your executive career scorecard and interview roadmap history.</p>
        <Link href="/login" className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold text-sm rounded-xl shadow-md hover:bg-blue-500 transition-all">
          Sign In to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner & Action Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-cyan-400 mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Executive Intelligence Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interview Readiness Scorecard
          </h1>
        </div>

        <Link
          href="/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl active:scale-95 transition-all duration-200 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>New AI Job Evaluation</span>
        </Link>
      </div>

      {/* Top Analytics KPI Cards */}
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Metric 1: Total Evaluated Roles */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Evaluations</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{totalEvaluations}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Average Readiness Match Score */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Job Match Score</p>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{avgMatchScore}%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Critical Skill Gap Alerts */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Critical Skill Gaps</p>
            <p className="text-3xl font-black text-amber-500 dark:text-amber-400 mt-2">{totalHighSeverityGaps}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Reports Vault Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <span>Recent Interview Scorecards & Roadmaps</span>
        </h2>

        {reports.length === 0 ? (
          /* Empty Vault Prompt */
          <div className="p-12 rounded-3xl bg-slate-50 dark:bg-[#10141d] border border-dashed border-slate-300 dark:border-slate-800 text-center max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-500/20 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No AI Reports Generated Yet</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Ready to test yourself against your next target software job? Paste any target job description and let our generative AI uncover intention questions, roadmap study guides, and ATS resume adjustments.
            </p>
            <Link
              href="/new"
              className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Launch First Evaluation Room</span>
            </Link>
          </div>
        ) : (
          /* Report Cards Grid */
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => {
              const score = report.matchScore || 0;
              const scoreColor =
                score >= 80
                  ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                  : score >= 60
                  ? "text-amber-500 border-amber-500/30 bg-amber-500/10"
                  : "text-red-500 border-red-500/30 bg-red-500/10";

              return (
                <Link
                  key={report._id}
                  href={`/interview/${report._id}`}
                  className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800/80 hover:border-blue-500/40 dark:hover:border-cyan-400/40 shadow-xl shadow-slate-100 dark:shadow-none transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Match Score Badge & Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`px-4 py-1.5 rounded-2xl border text-sm font-black tracking-tight flex items-center gap-1.5 ${scoreColor}`}>
                        <span>Match Score: {score}%</span>
                      </div>
                      <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(report.createdAt || Date.now()).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Job Title or Description Snippet */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {report.title || "Software Engineer Application Analysis"}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {report.matchScoreReason || "Comprehensive breakdown of technical competency requirements and interviewer intention questioning."}
                    </p>
                  </div>

                  {/* Bottom Footer: Quick Action Indicator */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform duration-200">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Ready for Review</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>View Full Report & Roadmaps</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
