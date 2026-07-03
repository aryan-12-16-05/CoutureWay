import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/booking")({
  head: () => ({
    meta: [
      { title: "Book a Session — CoutureWay" },
      { name: "description", content: "Schedule a private at-home tailoring session with a CoutureWay master tailor." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingPage,
});

const SERVICES = [
  { id: "bespoke", name: "Bespoke Tailoring", desc: "Custom-made garment from your measurements." },
  { id: "wedding", name: "Wedding Couture", desc: "Bridal, groom, or family wedding consultation." },
  { id: "corporate", name: "Corporate Program", desc: "Uniform program design for your organization." },
  { id: "alteration", name: "Heirloom Alteration", desc: "Restoration of a treasured piece." },
];

const TIMES = ["10:00", "11:30", "14:00", "15:30", "17:00"];
const STEPS = ["Service", "Date", "Time", "Address", "Confirm"] as const;

function BookingPage() {
  const { user, profile } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    service: "bespoke",
    date: "",
    time: "",
    name: profile?.full_name ?? "",
    address: profile?.shipping_address ?? "",
    email: user?.email ?? "",
    phone: profile?.phone ?? "",
  });
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const update = (k: keyof typeof data, v: string) => setData((d) => ({ ...d, [k]: v }));

  const canNext = [
    () => !!data.service,
    () => !!data.date,
    () => !!data.time,
    () => !!data.name && !!data.address && !!data.email,
    () => true,
  ][step]();

  const confirm = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await api.post("/appointments", {
        service: SERVICES.find((s) => s.id === data.service)?.name ?? data.service,
        scheduled_date: data.date,
        scheduled_time: data.time,
        full_name: data.name,
        email: data.email,
        address: data.address,
        phone: data.phone || null,
      });
    } catch (err) {
      setSubmitting(false);
      toast.error(err instanceof Error ? err.message : "Could not reserve your session");
      return;
    }
    setSubmitting(false);
    toast.success("Appointment confirmed — concierge will be in touch.");
    setDone(true);
  };

  if (done) {
    return (
      <PageHero
        eyebrow="Confirmed"
        title={<>Your private session is <em className="text-gold">reserved.</em></>}
        description="A confirmation notification has been added to your account and our concierge will follow up within the hour."
      >
        <Link to="/dashboard" className="inline-block bg-gold px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink">
          View My Account
        </Link>
      </PageHero>
    );
  }

  return (
    <div>
      <PageHero
        eyebrow="Private Session"
        title={<>Reserve your <em className="text-gold">atelier visit.</em></>}
        description="A master tailor will arrive at your residence with fabric books and the full atelier."
      />

      <section className="mx-auto max-w-4xl px-6 py-20">
        <ol className="mb-16 flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-3">
              <span className={`grid size-9 shrink-0 place-items-center border text-xs font-medium ${
                i < step ? "border-gold bg-gold text-ink" : i === step ? "border-gold text-gold" : "border-ivory/15 text-ivory/40"
              }`}>{i < step ? <Check className="size-4" /> : i + 1}</span>
              <span className={`hidden text-[10px] uppercase tracking-[0.2em] md:inline ${i === step ? "text-ivory" : "text-ivory/40"}`}>{s}</span>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-ivory/10" />}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }} className="min-h-[300px]">
            {step === 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {SERVICES.map((s) => (
                  <button key={s.id} onClick={() => update("service", s.id)} className={`border p-6 text-left transition-colors ${
                    data.service === s.id ? "border-gold bg-gold/5" : "border-ivory/15 hover:border-ivory/40"
                  }`}>
                    <h3 className="font-serif text-xl">{s.name}</h3>
                    <p className="mt-2 text-sm text-ivory/60">{s.desc}</p>
                  </button>
                ))}
              </div>
            )}
            {step === 1 && (
              <div>
                <label className="mb-3 block text-[10px] uppercase tracking-[0.25em] text-gold">Choose a date</label>
                <input type="date" value={data.date} min={new Date().toISOString().split("T")[0]} onChange={(e) => update("date", e.target.value)} className="w-full border border-ivory/15 bg-transparent p-4 text-lg focus:border-gold focus:outline-none [color-scheme:dark]" />
              </div>
            )}
            {step === 2 && (
              <div>
                <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-gold">Available time slots</p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                  {TIMES.map((t) => (
                    <button key={t} onClick={() => update("time", t)} className={`border py-4 text-sm transition-colors ${
                      data.time === t ? "border-gold bg-gold/10 text-gold" : "border-ivory/15 hover:border-ivory/40"
                    }`}>{t}</button>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-5">
                <Field label="Full Name" value={data.name} onChange={(v) => update("name", v)} />
                <Field label="Email" type="email" value={data.email} onChange={(v) => update("email", v)} />
                <Field label="Phone" value={data.phone} onChange={(v) => update("phone", v)} />
                <Field label="Address" value={data.address} onChange={(v) => update("address", v)} />
              </div>
            )}
            {step === 4 && (
              <div className="border border-ivory/15 p-8">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Confirm your booking</p>
                <dl className="mt-6 space-y-4 text-sm">
                  {[
                    ["Service", SERVICES.find((s) => s.id === data.service)?.name],
                    ["Date", data.date],
                    ["Time", data.time],
                    ["Name", data.name],
                    ["Address", data.address],
                    ["Email", data.email],
                    ["Phone", data.phone || "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-ivory/10 pb-3">
                      <dt className="text-ivory/50">{k}</dt>
                      <dd className="text-ivory">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-xs text-ivory/40">After confirming, you'll receive an in-app notification immediately. Our concierge will follow up with preparation details and (once your email domain is set up) a confirmation email.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between">
          <button onClick={back} disabled={step === 0} className="text-[11px] uppercase tracking-[0.22em] text-ivory/60 disabled:opacity-30">← Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={next} disabled={!canNext} className="inline-flex items-center gap-3 bg-gold px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink disabled:opacity-30">
              Continue <ArrowRight className="size-4" />
            </button>
          ) : (
            <button onClick={confirm} disabled={submitting} className="bg-gold px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink disabled:opacity-50">
              {submitting ? "Reserving…" : "Confirm Booking"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-ivory/15 bg-transparent p-4 text-sm focus:border-gold focus:outline-none" />
    </div>
  );
}
