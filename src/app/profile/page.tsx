"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Lock,
  LogOut,
  FolderOpen,
  ArrowRight,
  Shield,
  Key,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Save,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout, refreshUser } = useAuth();
  const [caseCount, setCaseCount] = useState<number>(0);

  // Edit Name State
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState<string | null>(null);
  const [isSavingName, setIsSavingName] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/profile");
      return;
    }

    if (user) {
      setNewName(user.name);
      fetch("/api/cases")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.cases)) {
            setCaseCount(data.cases.length);
          }
        })
        .catch((err) => console.error("Could not fetch case count:", err));
    }
  }, [user, authLoading, router]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    setNameSuccess(null);

    if (!newName || newName.trim().length < 2) {
      setNameError("Name must be at least 2 characters long.");
      return;
    }

    setIsSavingName(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNameSuccess("Name updated successfully.");
        setIsEditingName(false);
        await refreshUser();
      } else {
        setNameError(data.error || "Failed to update name.");
      }
    } catch (err) {
      setNameError("Network error occurred.");
    } finally {
      setIsSavingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordSuccess("Password updated securely.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setPasswordError(data.error || "Could not update password.");
      }
    } catch (err) {
      setPasswordError("Network error updating password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07090e] bg-grid-pattern transition-colors duration-200">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-slate-500 dark:text-slate-400 font-mono text-xs">Loading profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const joinDateFormatted = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07090e] bg-grid-pattern relative transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Profile Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#090b14] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-2xl mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-[1px] shadow-lg shadow-blue-500/20 overflow-hidden">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-[15px]"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 dark:bg-[#0b0e17] rounded-[15px] flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold font-mono">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30 text-[10px] font-mono font-bold">
                    VERIFIED USER
                  </span>
                  {user.authProvider === "google" && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                      <span>Google Account</span>
                    </span>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5 flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 dark:bg-rose-600/15 dark:hover:bg-rose-600/25 dark:border-rose-500/30 text-rose-700 hover:text-rose-800 dark:text-rose-300 dark:hover:text-rose-200 text-xs font-mono font-semibold transition-all flex items-center gap-2 shadow-sm dark:shadow-none"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
            </button>
          </div>
        </div>

        {/* Account Details & Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Account Profile Edit */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#090b14] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Account Information</span>
              </h2>

              {!isEditingName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {nameSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{nameSuccess}</span>
              </div>
            )}

            {nameError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{nameError}</span>
              </div>
            )}

            {isEditingName ? (
              <form onSubmit={handleUpdateName} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/[0.1] focus:border-blue-500 text-slate-900 dark:text-white text-xs outline-none font-mono"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSavingName}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Name</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingName(false);
                      setNewName(user.name);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] text-slate-700 dark:text-slate-400 text-xs hover:text-slate-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
                  <span className="text-slate-500 dark:text-slate-400">Display Name</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{user.name}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
                  <span className="text-slate-500 dark:text-slate-400">Email Address</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{user.email}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
                  <span className="text-slate-500 dark:text-slate-400">Member Since</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{joinDateFormatted}</span>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Link
                href="/cases"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center justify-between transition-all shadow-sm dark:shadow-none"
              >
                <span>View My Cases ({caseCount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#090b14] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Change Password</span>
            </h2>

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/[0.1] focus:border-blue-500 text-slate-900 dark:text-white text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1">
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/[0.1] focus:border-blue-500 text-slate-900 dark:text-white text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-600 dark:text-slate-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-300 dark:border-white/[0.1] focus:border-blue-500 text-slate-900 dark:text-white text-xs outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSavingPassword}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 mt-2 shadow-md shadow-blue-600/20"
              >
                {isSavingPassword ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Security & Cryptographic Standard */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#090b14] border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Cryptographic Privacy & Isolation</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono text-slate-600 dark:text-slate-400">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">✓ Salted scrypt</span>
              <span>Zero plaintext password exposure with NIST standard hashing.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
              <span className="text-blue-600 dark:text-blue-400 font-bold block mb-1">✓ Signed HttpOnly</span>
              <span>HMAC-SHA256 session signatures immune to XSS token theft.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05]">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">✓ Strict User Scope</span>
              <span>All case queries isolated strictly to authenticated owner ID.</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
