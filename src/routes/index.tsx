import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Sparkles, Palette, Ruler, Scan, Wand2 } from "lucide-react";
import heroJacket from "@/assets/hero-jacket.jpg";
import atelierMeasure from "@/assets/atelier-measure.jpg";
import collectionOvercoat from "@/assets/collection-overcoat.jpg";
import collectionTrouser from "@/assets/collection-trouser.jpg";
import collectionKnit from "@/assets/collection-knit.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CoutureWay — Tailored To Perfection. Delivered To Your Doorstep." },
      { name: "description", content: "Luxury custom tailoring, wedding couture, and corporate uniforms. Master tailors visit your residence." },
      { property: "og:title", content: "CoutureWay — Premium Custom Tailoring" },
      { property: "og:description", content: "Heritage tailoring, delivered at your doorstep." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const collections = [
  { img: collectionOvercoat, name: "The Sculpted Overcoat", price: "$2,450", tag: "Winter Archive 01" },
  { img: collectionTrouser, name: "Silk Pleated Trouser", price: "$1,100", tag: "Winter Archive 02" },
  { img: collectionKnit, name: "Heritage Cable Knit", price: "$890", tag: "Winter Archive 03" },
];

const aiCards = [
  { tag: "Stylist AI", title: "Personal Aesthetic Oracle", desc: "An engine that learns your proportions and palette preferences over seasons.", Icon: Sparkles },
  { tag: "Color AI", title: "Chromatic Harmony", desc: "Identifying the precise undertones that complement your natural complexion.", Icon: Palette },
  { tag: "Fit AI", title: "Predictive Sizing", desc: "Eliminating the measurement gap through smartphone-based LiDAR scanning.", Icon: Ruler },
  { tag: "Outfit AI", title: "Generative Wardrobe", desc: "Compose entire capsule wardrobes from your existing pieces with AI assistance.", Icon: Wand2 },
  { tag: "Try-On AI", title: "Holographic Fitting", desc: "Step into your future garment before a single stitch is laid down.", Icon: Scan },
];

function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative flex h-dvh flex-col justify-end overflow-hidden pb-24">
        <div className="absolute inset-0 z-0">
          <img
            src={heroJacket}
            alt="Black silk suit jacket on gold hanger in a luxury atelier"
            width={1920}
            height={1080}
            className="size-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold"
          >
            The Maison of Fashion-Tech
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="max-w-[18ch] text-balance font-serif text-5xl leading-[1.02] md:text-7xl lg:text-8xl"
          >
            Tailored To <em className="text-gold">Perfection.</em> Delivered To Your Doorstep.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              to="/booking"
              className="group inline-flex items-center gap-3 bg-ivory px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink ring-1 ring-ivory transition-all hover:bg-gold hover:ring-gold"
            >
              Book Customization Session
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 border border-ivory/30 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-ivory hover:text-ink"
            >
              Explore Collections
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-8 right-6 z-10 hidden items-center gap-3 md:flex">
          <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">Scroll</span>
          <div className="h-px w-16 bg-gold/40" />
        </div>
      </section>

      {/* COLLECTIONS RAIL */}
      <section className="py-32">
        <div className="mx-auto mb-12 flex max-w-7xl items-end justify-between px-6">
          <div className="max-w-[48ch]">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-gold">Curated Series</p>
            <h2 className="text-balance font-serif text-3xl md:text-5xl">Seasonal Couture Archive</h2>
            <p className="mt-4 text-pretty text-ivory/60">
              Ready-to-wear pieces from our latest atelier, each refined for the modern silhouette.
            </p>
          </div>
          <Link to="/shop" className="hidden items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-gold md:flex">
            View All <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="no-scrollbar flex gap-6 overflow-x-auto px-6 pb-2">
          {collections.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group w-[300px] flex-none cursor-pointer md:w-[450px]"
            >
              <div className="aspect-[3/4] overflow-hidden bg-card">
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  width={900}
                  height={1200}
                  className="size-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-ivory/40">{c.tag}</p>
                  <h3 className="mt-1 font-serif text-xl">{c.name}</h3>
                </div>
                <span className="font-serif text-lg text-gold">{c.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CUSTOM TAILORING FLAGSHIP */}
      <section className="bg-ivory py-32 text-ink">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-12 -left-12 size-64 rounded-full border border-gold/30" />
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={atelierMeasure}
                  alt="Gold measuring tape on dark velvet — atelier process"
                  loading="lazy"
                  width={1200}
                  height={1500}
                  className="size-full object-cover"
                />
              </div>
              <div className="absolute bottom-8 right-8 max-w-[220px] bg-ink p-6 shadow-2xl">
                <p className="font-serif text-3xl text-gold">32</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-ivory/70">
                  Anatomical points captured per fitting
                </p>
              </div>
            </motion.div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold">Flagship Experience</p>
              <h2 className="mt-4 text-balance font-serif text-4xl leading-tight md:text-5xl">
                The Private Atelier, Brought To You.
              </h2>
              <p className="mt-6 max-w-md text-pretty leading-relaxed text-ink/70">
                Our master tailors travel to your residence with fabric books, 3D body scanners,
                and a century of heritage. Every stitch — a testament to precision.
              </p>

              <div className="mt-12 space-y-8">
                {[
                  { h: "Fabric Curation", p: "Choose from 4,000+ premium textiles by Loro Piana, Zegna, and Dormeuil." },
                  { h: "Digital Twin Patterning", p: "Proprietary 3D mapping ensures perfect fit for any physique." },
                  { h: "Lifetime Alterations", p: "Every CoutureWay garment is supported with complimentary lifetime tailoring." },
                ].map((row) => (
                  <div key={row.h} className="group flex items-start gap-6">
                    <div className="mt-2 h-px w-12 bg-gold transition-all duration-500 group-hover:w-20" />
                    <div>
                      <h4 className="font-serif text-xl">{row.h}</h4>
                      <p className="mt-1 text-sm text-ink/60">{row.p}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/custom-tailoring"
                className="mt-12 inline-flex items-center gap-4 bg-ink px-2 py-2 pr-5 text-ivory ring-1 ring-ink"
              >
                <span className="grid size-9 place-items-center bg-gold/10 text-gold">
                  <Calendar className="size-4" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.22em]">Discover Atelier</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE PILLARS */}
      <section className="border-y border-ivory/5 py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold">Our Maison</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Six Houses. One Standard.</h2>
          </div>
          <div className="grid gap-px bg-ivory/5 md:grid-cols-3">
            {[
              { h: "Ready-to-Wear", p: "Seasonal collections crafted with archival precision." },
              { h: "Bespoke Tailoring", p: "From fabric thread to final fit — entirely yours." },
              { h: "Home Measurement", p: "Master tailors visit you. Precision at your residence." },
              { h: "Wedding Couture", p: "Bridal, groom, family — orchestrated as one." },
              { h: "Corporate Wear", p: "Formal uniforms for companies, schools, hospitals." },
              { h: "Heirloom Restoration", p: "Restoring archival garments to original glory." },
            ].map((s) => (
              <div key={s.h} className="group bg-ink p-10 transition-colors hover:bg-gold/5">
                <h3 className="font-serif text-2xl">{s.h}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ivory/55">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI FUTURE */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gold">The Next Chapter</p>
            <h2 className="mt-4 font-serif text-4xl text-gradient-gold md:text-6xl">Intelligence in Stitching</h2>
            <p className="mx-auto mt-6 max-w-[56ch] text-pretty text-ivory/60">
              The next generation of luxury fashion — powered by proprietary neural networks for aesthetic perfection.
            </p>
          </div>
          <div className="grid gap-px bg-ivory/5 md:grid-cols-2 lg:grid-cols-3">
            {aiCards.map(({ tag, title, desc, Icon }, i) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="group flex aspect-square flex-col justify-between bg-ink p-10 transition-colors hover:bg-gold/5"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gold">{tag}</span>
                  <Icon className="size-5 text-gold/60 transition-colors group-hover:text-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-ivory/50">{desc}</p>
                  <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-gold/60">Coming 2026</p>
                </div>
              </motion.div>
            ))}
            <div className="flex aspect-square flex-col justify-center bg-gold/5 p-10 text-center">
              <p className="font-serif text-2xl italic">Be the first to experience CoutureWay AI.</p>
              <Link to="/contact" className="mt-6 inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                Join the Waitlist →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ivory text-ink">
        <div className="mx-auto max-w-5xl px-6 py-32 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">Begin Your Journey</p>
          <h2 className="mt-6 text-balance font-serif text-5xl leading-tight md:text-7xl">
            A garment worthy of your <em>finest hour.</em>
          </h2>
          <Link
            to="/booking"
            className="mt-10 inline-flex items-center gap-3 bg-ink px-10 py-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-gold hover:text-ink"
          >
            Schedule Your Private Session <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
