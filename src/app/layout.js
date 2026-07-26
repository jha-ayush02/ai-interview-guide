import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Interview Assistant — Master Technical & Behavioral Readiness",
  description: "Ace your software developer engineering interviews with 0-100% job match scoring, intention-based question coaching, skill gap severity tagging, and tailored resumes.",
};

export default function RootLayout({ children }) {
  return (
    // 💡 suppressHydrationWarning stops React from showing harmless development warnings when next-themes dynamically injects dark mode classes on load
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300`}
        suppressHydrationWarning
      >
        {/* Notice: ThemeProvider must wrap BOTH Navbar and {children} so all views inherit theme toggles! */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
