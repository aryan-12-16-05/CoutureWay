import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Search } from "lucide-react";
import collectionOvercoat from "@/assets/collection-overcoat.jpg";
import collectionTrouser from "@/assets/collection-trouser.jpg";
import collectionKnit from "@/assets/collection-knit.jpg";
import heroJacket from "@/assets/hero-jacket.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Collections — CoutureWay" },
      { name: "description", content: "Browse the seasonal ready-to-wear collection from CoutureWay's atelier." },
      { property: "og:title", content: "Collections — CoutureWay" },
      { property: "og:description", content: "Editorial ready-to-wear from the CoutureWay maison." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: ShopPage,
});

const PRODUCTS = [
  { id: 1, name: "The Sculpted Overcoat", price: 2450, cat: "Outerwear", img: collectionOvercoat },
  { id: 2, name: "Silk Pleated Trouser", price: 1100, cat: "Tailoring", img: collectionTrouser },
  { id: 3, name: "Heritage Cable Knit", price: 890, cat: "Knitwear", img: collectionKnit },
  { id: 4, name: "Onyx Peak-Lapel Tuxedo", price: 4200, cat: "Formal", img: heroJacket },
  { id: 5, name: "Atelier Overcoat — Camel", price: 2850, cat: "Outerwear", img: collectionOvercoat },
  { id: 6, name: "Ivory Evening Trouser", price: 1180, cat: "Tailoring", img: collectionTrouser },
  { id: 7, name: "Aran Stitch Pullover", price: 940, cat: "Knitwear", img: collectionKnit },
  { id: 8, name: "Midnight Dinner Jacket", price: 3850, cat: "Formal", img: heroJacket },
];

const CATEGORIES = ["All", "Outerwear", "Tailoring", "Knitwear", "Formal"] as const;

function ShopPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [q, setQ] = useState("");
  const items = PRODUCTS.filter(
    (p) => (cat === "All" || p.cat === cat) && p.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHero
        eyebrow="Collections"
        title={<>The Seasonal <em className="text-gold">Archive.</em></>}
        description="Each piece is a meditation on form, fabric, and finish — released in limited editions from our atelier."
      />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] transition-colors ${
                  cat === c ? "bg-gold text-ink" : "border border-ivory/15 text-ivory/60 hover:text-gold"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative max-w-xs">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ivory/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the archive..."
              className="w-full border border-ivory/15 bg-transparent py-2.5 pl-10 pr-4 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <Link to="/shop" key={p.id} className="group block">
              <div className="aspect-[3/4] overflow-hidden bg-card">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-ivory/40">{p.cat}</p>
                <h3 className="mt-1 font-serif text-lg">{p.name}</h3>
                <p className="mt-1 text-sm text-gold">${p.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>

        {items.length === 0 && (
          <p className="py-20 text-center text-sm text-ivory/40">No pieces match your search.</p>
        )}
      </section>
    </div>
  );
}
