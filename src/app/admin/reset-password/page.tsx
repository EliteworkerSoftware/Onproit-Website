"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const inputClasses =
  "w-full rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setStatus("error");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setStatus("error");
      return;
    }
    if (!supabase) {
      setError("Password reset is not configured.");
      setStatus("error");
      return;
    }

    setStatus("saving");
    // The recovery link Supabase emailed sets a temporary session in this
    // browser automatically (detectSessionInUrl) — updateUser acts on it.
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setStatus("error");
      return;
    }

    setStatus("done");
    setTimeout(() => router.push("/admin/login"), 2000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <Image src="/images/logo.svg" alt="ONPRO IT" width={180} height={40} className="h-10 w-auto" priority />
          <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-white/50">
            Admin Dashboard
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white">Set a new password</h2>
        <p className="mt-1 text-sm text-white/60">Choose a new password for your admin account.</p>

        {status === "done" ? (
          <div className="mt-6 rounded-md border border-green-400/30 bg-green-500/15 px-4 py-3 text-sm text-green-100">
            Password updated — redirecting to sign in…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6">
            <label className="text-sm text-white/70">New Password</label>
            <input
              type="password"
              required
              autoFocus
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1.5 ${inputClasses}`}
            />
            <label className="mt-4 block text-sm text-white/70">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`mt-1.5 ${inputClasses}`}
            />
            <button
              type="submit"
              disabled={status === "saving"}
              className="mt-5 w-full rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {status === "saving" ? "Updating…" : "Update Password"}
            </button>
            {status === "error" && (
              <p className="mt-3 rounded-md border border-red-400/30 bg-red-500/15 px-3 py-2 text-sm text-red-100">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
