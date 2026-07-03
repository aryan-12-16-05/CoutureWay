import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CoutureWay" },
      { name: "description", content: "Reach the CoutureWay concierge — appointments, corporate enquiries, press." },
      { property: "og:title", content: "Contact — CoutureWay" },
      { property: "og:description", content: "Speak with our concierge." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <PageHero
        eyebrow="Contact"
        title={<>Speak with our <em className="text-gold">concierge.</em></>}
        description="For appointments, corporate enquiries, or press — we respond within one business day."
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-8">
            {[
              { Icon: Mail, h: "Email", v: "concierge@coutureway.com" },
              { Icon: Phone, h: "Phone", v: "+1 (212) 555-0117" },
              { Icon: MapPin, h: "Flagship Atelier", v: "27 Rue Saint-Honoré, Paris" },
            ].map(({ Icon, h, v }) => (
              <div key={h} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center border border-gold/30 text-gold">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gold">{h}</p>
                  <p className="mt-1 text-ivory">{v}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Name" id="name" required />
              <Field label="Email" id="email" type="email" required />
            </div>
            <Field label="Subject" id="subject" />
            <div>
              <label htmlFor="msg" className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">Message</label>
              <textarea id="msg" rows={6} required className="w-full border border-ivory/15 bg-transparent p-4 text-sm focus:border-gold focus:outline-none" />
            </div>
            <button
              type="submit"
              className="bg-gold px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink"
            >
              {sent ? "Message Received ✓" : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({ label, id, ...props }: { label: string; id: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-ivory/50">{label}</label>
      <input id={id} {...props} className="w-full border border-ivory/15 bg-transparent p-4 text-sm focus:border-gold focus:outline-none" />
    </div>
  );
}
