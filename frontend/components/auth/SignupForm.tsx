"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface SignupFormProps {
  onSwitchTab: () => void;
}

export default function SignupForm({ onSwitchTab }: SignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { signup, googleSignIn } = useAuth();
  const router = useRouter();

  const checkPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) strength++;
    if (pwd.match(/\d/)) strength++;
    if (pwd.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    checkPasswordStrength(e.target.value);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await signup(name, email, password);
      router.push("/onboarding");
    } catch (err: any) {
      const errorMessage = err?.message || "Signup failed";
      if (errorMessage.includes("email-already-in-use")) {
        setError("Email already registered. Please login instead.");
      } else if (errorMessage.includes("weak-password")) {
        setError("Password is too weak. Use at least 8 characters with mixed case and numbers.");
      } else if (errorMessage.includes("invalid-email")) {
        setError("Please enter a valid email.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const { isNewUser } = await googleSignIn();
      if (isNewUser) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ][passwordStrength - 1] || "bg-zinc-800";

  const passwordStrengthLabel = ["Weak", "Fair", "Good", "Strong"][
    passwordStrength - 1
  ] || "Very Weak";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Create Account</h2>
        <p className="text-zinc-400 text-xs mt-1">Start your active learning and assessment sandbox</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex gap-2 items-start"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        {/* Full Name Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-800 bg-[#121214] text-xs text-white placeholder-zinc-650 outline-none transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-800 bg-[#121214] text-xs text-white placeholder-zinc-650 outline-none transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-zinc-800 bg-[#121214] text-xs text-white placeholder-zinc-650 outline-none transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 space-y-1.5"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= passwordStrength
                        ? passwordStrengthColor
                        : "bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-zinc-500">
                Complexity rating: <span className="font-semibold text-zinc-300">{passwordStrengthLabel}</span>
              </p>
            </motion.div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-zinc-800 bg-[#121214] text-xs text-white placeholder-zinc-650 outline-none transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              disabled={loading}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            {confirmPassword && password === confirmPassword && (
              <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
            )}
          </div>
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-blue-500/20 shadow-md cursor-pointer mt-6"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Creating Environment...</span>
            </>
          ) : (
            "Deploy Environment"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 py-1">
        <div className="flex-1 h-px bg-zinc-900"></div>
        <span className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest font-bold">Or OAuth</span>
        <div className="flex-1 h-px bg-zinc-900"></div>
      </div>

      {/* Google Signup */}
      <button
        onClick={handleGoogleSignup}
        disabled={loading}
        className="w-full h-11 rounded-xl border border-zinc-800 bg-[#141416] hover:bg-zinc-800 text-xs font-bold text-zinc-200 transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span>Sign up with Google</span>
      </button>

      {/* Switch to Login */}
      <p className="text-center text-zinc-500 text-xs">
        Already have credentials?{" "}
        <button
          onClick={onSwitchTab}
          className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
        >
          Login
        </button>
      </p>
    </div>
  );
}
