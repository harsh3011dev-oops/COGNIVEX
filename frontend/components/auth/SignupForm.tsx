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
  ][passwordStrength - 1] || "bg-slate-700";

  const passwordStrengthLabel = ["Weak", "Fair", "Good", "Strong"][
    passwordStrength - 1
  ] || "Very Weak";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
        <p className="text-slate-400">Join Cognivex and start learning</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex gap-3 items-start"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSignup} className="space-y-5">
        {/* Full Name Field */}
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-300"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 space-y-2"
            >
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= passwordStrength
                        ? passwordStrengthColor
                        : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400">
                Password Strength: <span className="font-semibold text-slate-300">{passwordStrengthLabel}</span>
              </p>
            </motion.div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-300"
              disabled={loading}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
            {confirmPassword && password === confirmPassword && (
              <CheckCircle2 className="absolute right-10 top-3.5 w-5 h-5 text-green-500" />
            )}
          </div>
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-700"></div>
        <span className="text-slate-500 text-sm">Or sign up with</span>
        <div className="flex-1 h-px bg-slate-700"></div>
      </div>

      {/* Google Signup */}
      <button
        onClick={handleGoogleSignup}
        disabled={loading}
        className="w-full py-3 rounded-lg border border-slate-700 hover:border-blue-500/50 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
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
        Continue with Google
      </button>

      {/* Switch to Login */}
      <p className="text-center text-slate-400">
        Already have an account?{" "}
        <button
          onClick={onSwitchTab}
          className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
        >
          Login
        </button>
      </p>
    </div>
  );
}
