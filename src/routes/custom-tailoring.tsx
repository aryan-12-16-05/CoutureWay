import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Check } from "lucide-react";

export const Route = createFileRoute("/custom-tailoring")({
  head: () => ({
    meta: [
      { title: "Custom Tailoring — CoutureWay" },
      { name: "description", content: "Design your own garment. Choose fabric, collar, sleeves, buttons, and fit — visualized in real time." },
      { property: "og:title", content: "Custom Tailoring — CoutureWay" },
      { property: "og:description", content: "The flagship CoutureWay customizer." },
      { property: "og:url", content: "/custom-tailoring" },
    ],
    links: [{ rel: "canonical", href: "/custom-tailoring" }],
  }),
  component: CustomTailoringPage,
});

type OptionGroup = { key: string; label: string; options: { id: string; label: string; swatch?: string }[] };

const GROUPS: OptionGroup[] = [
  {
    key: "fabric",
    label: "Fabric",
    options: [
      { id: "merino", label: "Midnight Merino Wool", swatch: "#1a1d22" },
      { id: "linen", label: "Ivory Italian Linen", swatch: "#e9e3d4" },
      { id: "velvet", label: "Burgundy Velvet", swatch: "#5b1a2a" },
      { id: "tweed", label: "Highland Tweed", swatch: "#5e5440" },
    ],
  },
  {
    key: "collar",
    label: "Collar",
    options: [
      { id: "peak", label: "Peak Lapel" },
      { id: "notch", label: "Notch Lapel" },
      { id: "shawl", label: "Shawl Collar" },
      { id: "mandarin", label: "Mandarin" },
    ],
  },
  {
    key: "sleeve",
    label: "Sleeve",
    options: [
      { id: "standard", label: "Standard Cuff" },
      { id: "french", label: "French Square" },
      { id: "rolled", label: "Hand-Rolled" },
    ],
  },
  {
    key: "buttons",
    label: "Buttons",
    options: [
      { id: "horn", label: "Buffalo Horn", swatch: "#2a1f17" },
      { id: "gold", label: "Polished Gold", swatch: "#D4AF37" },
      { id: "mop", label: "Mother of Pearl", swatch: "#f1ece3" },
      { id: "onyx", label: "Black Onyx", swatch: "#0d0d0d" },
    ],
  },
  {
    key: "fit",
    label: "Fit",
    options: [
      { id: "slim", label: "Slim Modern" },
      { id: "classic", label: "Classic Cut" },
      { id: "relaxed", label: "Relaxed Drape" },
    ],
  },
  {
    key: "pocket",
    label: "Pocket",
    options: [
      { id: "flap", label: "Flap" },
      { id: "jetted", label: "Jetted" },
      { id: "patch", label: "Patch" },
    ],
  },
  {
    key: "cuff",
    label: "Cuff Style",
    options: [
      { id: "barrel", label: "Barrel" },
      { id: "double", label: "Double / French" },
      { id: "convertible", label: "Convertible" },
    ],
  },
  {
    key: "color",
    label: "Lining",
    options: [
      { id: "ivory", label: "Ivory Silk", swatch: "#F8F5F0" },
      { id: "midnight", label: "Midnight Blue", swatch: "#0b1a3a" },
      { id: "rose", label: "Rose Champagne", swatch: "#c89a8b" },
      { id: "emerald", label: "Emerald", swatch: "#0d4d3a" },
    ],
  },
];

function CustomTailoringPage() {
  const [sel, setSel] = useState<Record<string, string>>(
    Object.fromEntries(GROUPS.map((g) => [g.key, g.options[0].id])),
  );

  const activeFabric = GROUPS[0].options.find((o) => o.id === sel.fabric);
  const activeLining = GROUPS[7].options.find((o) => o.id === sel.color);

  return (
    <div>
      <PageHero
        eyebrow="Flagship Customizer"
        title={<>Design Your <em className="text-gold">Signature.</em></>}
        description="Compose every element — from fabric thread to lining hue. Over twelve thousand combinations, refined to one."
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          {/* Visual preview */}
          <div className="sticky top-24 self-start">
            <div
              className="relative aspect-[3/4] overflow-hidden border border-ivory/10 transition-colors duration-500"
              style={{ background: activeFabric?.swatch ?? "#1a1d22" }}
            >
              <div className="absolute inset-x-12 top-12 bottom-12 border border-ivory/10">
                <div
                  className="absolute inset-x-8 bottom-8 h-12 transition-colors duration-500"
                  style={{ background: activeLining?.swatch ?? "#F8F5F0", opacity: 0.85 }}
                />
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/50">Your Composition</p>
                  <p className="mt-1 font-serif text-xl text-ivory">{activeFabric?.label}</p>
                </div>
                <span className="font-serif text-3xl text-gold">$3,250</span>
              </div>
            </div>
            <Link
              to="/booking"
              className="mt-6 block bg-gold py-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-ink ring-1 ring-gold transition-colors hover:bg-transparent hover:text-gold"
            >
              Book a Fitting for This Design
            </Link>
          </div>

          {/* Options */}
          <div className="space-y-10">
            {GROUPS.map((g) => (
              <div key={g.key}>
                <div className="mb-4 flex items-baseline justify-between border-b border-ivory/10 pb-3">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">{g.label}</h3>
                  <span className="font-serif text-base text-ivory/80">
                    {g.options.find((o) => o.id === sel[g.key])?.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {g.options.map((o) => {
                    const active = sel[g.key] === o.id;
                    return (
                      <button
                        key={o.id}
                        onClick={() => setSel((s) => ({ ...s, [g.key]: o.id }))}
                        className={`group flex items-center gap-3 border px-4 py-3 text-[10px] uppercase tracking-[0.2em] transition-all ${
                          active ? "border-gold bg-gold/10 text-gold" : "border-ivory/15 text-ivory/60 hover:border-ivory/40"
                        }`}
                      >
                        {o.swatch && (
                          <span
                            className="size-5 rounded-full border border-ivory/20"
                            style={{ background: o.swatch }}
                          />
                        )}
                        <span>{o.label}</span>
                        {active && <Check className="size-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
