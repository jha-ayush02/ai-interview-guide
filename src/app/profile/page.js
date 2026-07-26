"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile, getMe } from "@/services/api";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { User, FileText, Upload, CheckCircle, AlertCircle, Save, Sparkles, LogIn } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, setUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [defaultSelfDescription, setDefaultSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [saving, setSaving] = useState(false);

  // 🎯 GSAP Target Refs
  const containerRef = useRef(null);

  // Load existing description on mount
  useEffect(() => {
    if (user) {
      setDefaultSelfDescription(user.defaultSelfDescription || "");
    }
  }, [user]);

  useGSAP(() => {
    if (!authLoading) {
      gsap.fromTo(
        containerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [authLoading]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setStatus({ type: "info", message: `Selected file: ${file.name}` });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const updatedData = await updateProfile({
        defaultSelfDescription,
        resumeFile,
      });

      // Refresh global user state
      const freshUser = await getMe();
      setUser(freshUser.user || freshUser.data || freshUser);

      setStatus({
        type: "success",
        message: "🎉 Profile & Resume updated successfully!",
      });

      // Bounce effect on save success! 🎈
      gsap.fromTo(
        containerRef.current,
        { scale: 0.99 },
        { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" }
      );
    } catch (err) {
      console.error("Profile update failed:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to update profile. Please check file formatting or server status.",
      });
    } finally {
      setSaving(false);
    }
  };

  // While checking session cookie
  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-slate-500">
        <Sparkles className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // If user not logged in
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center mb-6">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Authentication Required</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Please sign in to configure your professional background and default resumes for AI evaluating.
        </p>
        <Link
          href="/login"
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm rounded-xl shadow-lg transition-all active:scale-95"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In Now</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div ref={containerRef} className="space-y-8">
        
        {/* Header Profile Title */}
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20">
            {user.username ? user.username[0].toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Developer Profile & Vault
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              @{user.username} &bull; {user.email}
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {status.message && (
          <div
            className={`p-4 rounded-2xl border flex items-center gap-3 text-sm transition-all ${
              status.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                : status.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-500"
                : "bg-blue-500/10 border-blue-500/20 text-blue-500 dark:text-cyan-400"
            }`}
          >
            {status.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Default Self Description */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <span>Professional Summary / Elevator Pitch</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This bio will automatically populate as your default background whenever you start an AI evaluation room.
              </p>
            </div>

            <textarea
              rows={5}
              value={defaultSelfDescription}
              onChange={(e) => setDefaultSelfDescription(e.target.value)}
              placeholder="e.g. I am a full-stack software engineer with 2 years of experience building scalable microservices in MERN and Next.js..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all leading-relaxed resize-y"
            />
          </div>

          {/* Master Resume Upload File Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <span>Default Resume PDF Vault</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Upload your latest master resume. Our backend AI parser uses this to analyze skill severity gaps against target job descriptions.
              </p>
            </div>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-cyan-400 rounded-2xl p-8 cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all group">
              <Upload className="w-10 h-10 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors mb-2 animate-bounce" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {resumeFile ? resumeFile.name : "Click or drag & drop to attach Resume (.PDF / .DOCX)"}
              </span>
              <span className="text-xs text-slate-400 mt-1">Maximum file size: 10MB</span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
            </label>

            {user.resumeUrl && !resumeFile && (
              <p className="text-xs text-emerald-500 font-medium flex items-center gap-1.5 pt-1">
                <CheckCircle className="w-4 h-4" />
                <span>You currently have a verified resume document stored in your vault!</span>
              </p>
            )}
          </div>

          {/* Submit Save Control */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Vault Settings..." : "Save Profile Configuration"}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
