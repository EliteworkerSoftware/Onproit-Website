"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

const inputClasses =
  "w-full rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:outline-none";

function AcceptInviteForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/admin/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set up your account");
      setStatus("done");
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set up your account");
      setStatus("error");
    }
  }

  if (!token) {
    return <p className="text-center text-white/70">This invite link is missing its token.</p>;
  }

  if (status === "done") {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">You&apos;re all set</h2>
        <p className="mt-2 text-sm text-white/60">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-white">Set your password</h2>
      <p className="mt-1 text-sm text-white/60">Choose a password to activate your admin account.</p>

      <label className="mt-6 block text-sm text-white/70">Password</label>
      <div className="relative mt-1.5">
        <input
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
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

      <label className="mt-4 block text-sm text-white/70">Confirm password</label>
      <input
        type={showPassword ? "text" : "password"}
        required
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className={`mt-1.5 ${inputClasses}`}
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 w-full rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "sending" ? "Setting up…" : "Activate account"}
      </button>
      {status === "error" && (
        <p className="mt-3 rounded-md border border-red-400/30 bg-red-500/15 px-3 py-2 text-sm text-red-100">
          {error}
        </p>
      )}
    </form>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <Image src="/images/logo.svg" alt="ONPRO IT" width={180} height={40} className="h-10 w-auto" priority />
          <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-white/50">
            Admin Dashboard
          </p>
        </div>
        <Suspense fallback={<p className="text-center text-white/70">Loading…</p>}>
          <AcceptInviteForm />
        </Suspense>
      </div>
    </div>
  );
}
