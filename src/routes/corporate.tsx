import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import corporateTeam from "@/assets/corporate-team.jpg";
import { Building2, GraduationCap, Stethoscope, Briefcase } from "lucide-react";

export const Route = createFileRoute("/corporate")({
  head: () => ({
    meta: [
      { title: "Corporate Solutions — CoutureWay" },
      { name: "description", content: "Tailored uniforms and formal attire for companies, schools, hospitals, and organizations." },
      { property: "og:title", content: "Corporate Solutions — CoutureWay" },
      { property: "og:description", content: "Premium corporate uniform programs at scale." },
      { property: "og:url", content: "/corporate" },
    ],
    links: [{ rel: "canonical", href: "/corporate" }],
  }),
  component: CorporatePage,
});

const SECTORS = [
  { Icon: Briefcase, h: "Companies", p: "Executive uniforms, hospitality fleets, and team-wide identity programs." },
  { Icon: GraduationCap, h: "Schools", p: "Heritage school crests, blazers, and accessories built to last." },
  { Icon: Stethoscope, h: "Hospitals", p: "Premium medical wear engineered for comfort and dignity." },
  { Icon: Building2, h: "Organizations", p: "Government, embassy, and institutional uniform programs." },
];

function CorporatePage() {
  return (
    <div>
      <PageHero
        eyebrow="Corporate Solutions"
        title={<>Tailoring at <em className="text-gold">Institutional Scale.</em></>}
        description="Premium corporate identity, woven into every uniform. From boutique brands to enterprise fleets."
      />

      <section className="mx-auto max-w-7xl px-6 py-24">
        <img
          src={corporateTeam}
          alt="A team of professionals in coordinated CoutureWay tailoring"
          loading="lazy"
          className="aspect-[16/9] w-full object-cover"
        />
      </section>

      <section className="border-y border-ivory/5 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 font-serif text-4xl">Sectors We Serve</h2>
          <div className="grid gap-px bg-ivory/5 md:grid-cols-2 lg:grid-cols-4">
            {SECTORS.map(({ Icon, h, p }) => (
              <div key={h} className="group bg-ink p-10 transition-colors hover:bg-gold/5">
                <Icon className="size-7 text-gold" />
                <h3 className="mt-6 font-serif text-2xl">{h}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/60">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-12 text-center font-serif text-4xl">Programs & Pricing Tiers</h2>
          <div className="space-y-px bg-ivory/5">
            {[
              { tier: "Boutique", range: "20 – 100 garments", lead: "8 weeks", price: "From $180/unit" },
              { tier: "Enterprise", range: "100 – 1,000 garments", lead: "10 weeks", price: "From $140/unit" },
              { tier: "Institutional", range: "1,000+ garments", lead: "Custom timeline", price: "Quote on request" },
            ].map((row) => (
              <div key={row.tier} className="grid items-center gap-4 bg-ink p-8 md:grid-cols-4">
                <h3 className="font-serif text-2xl text-gold">{row.tier}</h3>
                <p className="text-sm text-ivory/60">{row.range}</p>
                <p className="text-sm text-ivory/60">Lead: {row.lead}</p>
                <p className="text-right text-sm text-ivory">{row.price}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/contact"
              className="inline-block bg-gold px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink"
            >
              Request a Corporate Proposal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
