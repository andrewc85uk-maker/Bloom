"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-4xl text-center mb-2">Bloom</h1>
        <p className="text-center text-sm text-bloom-black/60 mb-8">Create your account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-bloom-black/20 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-bloom-gold"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border border-bloom-black/20 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-bloom-gold"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bloom-black text-bloom-cream rounded-lg px-4 py-3 text-sm font-medium hover:bg-bloom-black/80 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="text-center text-sm text-bloom-black/60 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-bloom-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
