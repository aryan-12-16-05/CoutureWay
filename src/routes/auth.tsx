import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — CoutureWay Atelier" },
      { name: "description", content: "Access your CoutureWay account to manage orders, appointments, and saved measurements." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard", replace: true });
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        await auth.signUp({ email, password, full_name: fullName });
        toast.success("Welcome to the atelier — your account is ready.");
      } else {
        await auth.signIn({ email, password });
        toast.success("Welcome back.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    toast.error("Google sign-in requires OAuth configuration on the Flask backend — use email sign-in.");
  };

  return (
    <div className="min-h-dvh pt-32 pb-20">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-2">
        <div className="hidden flex-col justify-between lg:flex">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold">Private Atelier</p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05]">
              The maison <em className="text-gold">remembers you.</em>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/60">
              Your measurements, drafts, fittings, and orders — kept private to you and your concierge.
            </p>
          </div>
          <div className="border-l border-gold/40 pl-6 text-xs italic text-ivory/50">
            "A second skin, made only for you."
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="border border-ivory/10 p-10">
          <div className="mb-8 flex gap-2 border-b border-ivory/10">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 pb-3 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                  mode === m ? "border-b border-gold text-gold" : "text-ivory/40"
                }`}
              >
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <Field label="Full Name" value={fullName} onChange={setFullName} required />
            )}
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field label="Password" type="password" value={password} onChange={setPassword} required minLength={8} />

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-gold py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ivory disabled:opacity-50"
            >
              {busy ? "Working…" : mode === "signin" ? "Enter the Atelier" : "Create Account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-ivory/30">
            <div className="h-px flex-1 bg-ivory/10" /> or <div className="h-px flex-1 bg-ivory/10" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={busy}
            className="flex w-full items-center justify-center gap-3 border border-ivory/15 py-4 text-[11px] uppercase tracking-[0.22em] text-ivory/80 transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <p className="mt-8 text-center text-[10px] uppercase tracking-[0.25em] text-ivory/40">
            <Link to="/" className="hover:text-gold">← Return to the maison</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, minLength }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; minLength?: number }) {
  return (
    <div>
      <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        minLength={minLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-ivory/15 bg-transparent p-4 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5 17.7 35.5 12.5 30.3 12.5 24S17.7 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.9 6.3 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.9 6.3 29.2 4.5 24 4.5 16.3 4.5 9.6 8.9 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 43.5c5.1 0 9.8-1.9 13.3-5l-6.2-5.2c-1.9 1.4-4.3 2.3-7.1 2.3-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39 16.2 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.7-3.7 5l6.2 5.2c-.4.4 6.7-4.9 6.7-14.2 0-1.2-.1-2.4-.4-3.5z"/>
    </svg>
  );
}
