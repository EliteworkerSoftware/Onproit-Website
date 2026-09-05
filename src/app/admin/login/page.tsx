"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

async function parseJsonSafe(res: Response): Promise<{ error?: string }> {
  try {
    return await res.json();
  } catch {
    return { error: `Unexpected response from server (${res.status})` };
  }
}

const inputClasses =
  "w-full rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [forgotStatus, setForgotStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setForgotStatus("sending");
    if (supabase) {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
    }
    // Always show success, whether or not the email exists — don't let this
    // form be used to check which addresses have admin accounts.
    setForgotStatus("sent");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Failed to sign in");

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      setStatus("error");
    }
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

        {mode === "login" ? (
          <>
            <h2 className="text-2xl font-bold text-white">Sign in</h2>
            <p className="mt-1 text-sm text-white/60">Enter your email and password to continue.</p>

            <form onSubmit={handleSubmit} className="mt-6">
              <label className="text-sm text-white/70">Email address</label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@onproit.com"
                className={`mt-1.5 ${inputClasses}`}
              />
              <div className="mt-4 flex items-center justify-between">
                <label className="block text-sm text-white/70">Password</label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs font-medium text-white/60 hover:text-white"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`${inputClasses} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3.5 text-white/50 hover:text-white/80"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-5 w-full rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
              >
                {status === "sending" ? "Signing in…" : "Sign in"}
              </button>
              {status === "error" && (
                <p className="mt-3 rounded-md border border-red-400/30 bg-red-500/15 px-3 py-2 text-sm text-red-100">
                  {error}
                </p>
              )}
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white">Reset password</h2>
            <p className="mt-1 text-sm text-white/60">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            {forgotStatus === "sent" ? (
              <div className="mt-6 rounded-md border border-green-400/30 bg-green-500/15 px-4 py-3 text-sm text-green-100">
                If an account exists for that email, a reset link is on its way.
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-6">
                <label className="text-sm text-white/70">Email address</label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@onproit.com"
                  className={`mt-1.5 ${inputClasses}`}
                />
                <button
                  type="submit"
                  disabled={forgotStatus === "sending"}
                  className="mt-5 w-full rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
                >
                  {forgotStatus === "sending" ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => {
                setMode("login");
                setForgotStatus("idle");
              }}
              className="mt-4 text-sm text-white/60 hover:text-white"
            >
              ← Back to sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
}
