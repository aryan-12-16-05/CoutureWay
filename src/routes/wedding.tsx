import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import weddingCouple from "@/assets/wedding-couple.jpg";

export const Route = createFileRoute("/wedding")({
  head: () => ({
    meta: [
      { title: "Wedding Couture — CoutureWay" },
      { name: "description", content: "Bespoke groom, bridal, and family wedding packages. Orchestrated as one." },
      { property: "og:title", content: "Wedding Couture — CoutureWay" },
      { property: "og:description", content: "Heirloom wedding tailoring for the modern celebration." },
      { property: "og:url", content: "/wedding" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "/wedding" }],
  }),
  component: WeddingPage,
});

const PACKAGES = [
  { name: "The Groom", from: 4500, desc: "Tuxedo, dress shirt, hand-finished bow tie, pocket square, and shoes.", items: ["Bespoke jacket & trouser", "French-cuff dress shirt", "Silk bow or neck tie", "Pocket square + cufflinks"] },
  { name: "Bridal Atelier", from: 8200, desc: "Custom bridal gown with hand-beaded details and a private fitting suite.", items: ["Couture gown design", "Three private fittings", "Veil & accessories", "Lifetime preservation"] },
  { name: "Family Ensemble", from: 12000, desc: "Coordinated couture for up to eight family members, designed in unison.", items: ["Coordinated palette", "Group fitting day", "On-site alterations", "Pre-event press"] },
  { name: "Estate Order", from: 32000, desc: "Wedding-party bulk — bridesmaids, groomsmen, and family — fully tailored.", items: ["20+ garment package", "On-location team", "Premium fabric tier", "Dedicated concierge"] },
];

function WeddingPage() {
  return (
    <div>
      <PageHero
        eyebrow="Wedding Couture"
        title={<>An Heirloom <em className="text-gold">Worth Wearing.</em></>}
        description="Every wedding deserves its own choreography of cloth. From groom to family, our maison orchestrates every silhouette."
      >
        <Link
          to="/booking"
          className="inline-block bg-gold px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink"
        >
          Reserve Wedding Concierge
        </Link>
      </PageHero>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <img
            src={weddingCouple}
            alt="Bride and groom in CoutureWay couture"
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold">The Ceremony</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">A garment that remembers the day.</h2>
            <p className="mt-6 leading-relaxed text-ivory/60">
              We treat each wedding as a singular project — assigning a dedicated atelier
              director, a master cutter, and a concierge. From engagement portrait to honeymoon
              departure, every piece is crafted in a unified palette and fabric story.
            </p>
            <ul className="mt-10 space-y-4 text-sm text-ivory/70">
              {["Private design consultations at your home", "Bridal preservation & restoration", "Travel-ready garment cases", "Same-week alterations"].map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-px w-6 bg-gold" /> {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-ivory/5 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center font-serif text-4xl">Wedding Packages</h2>
          <div className="grid gap-px bg-ivory/5 md:grid-cols-2">
            {PACKAGES.map((p) => (
              <div key={p.name} className="bg-ink p-10">
                <div className="flex items-baseline justify-between border-b border-ivory/10 pb-6">
                  <h3 className="font-serif text-2xl">{p.name}</h3>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold">From ${p.from.toLocaleString()}</span>
                </div>
                <p className="mt-6 text-sm text-ivory/60">{p.desc}</p>
                <ul className="mt-6 space-y-3 text-sm text-ivory/70">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-center gap-3">
                      <span className="size-1 rounded-full bg-gold" /> {it}
                    </li>
                  ))}
                </ul>
                <Link to="/booking" className="mt-8 inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  Request Consultation →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
