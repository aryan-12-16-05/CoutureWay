import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Maison — CoutureWay" },
      { name: "description", content: "The heritage, craft, and philosophy of CoutureWay." },
      { property: "og:title", content: "Our Maison — CoutureWay" },
      { property: "og:description", content: "Where heritage tailoring meets future intelligence." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="Our Maison"
        title={<>A century of <em className="text-gold">craft</em>, reimagined for tomorrow.</>}
        description="CoutureWay is a fashion-tech maison. Heritage tailoring orchestrated through software, delivered at your doorstep."
      />

      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="space-y-10 text-lg leading-relaxed text-ivory/70">
          <p>
            We believe a garment is more than cloth — it is the architecture of the moment you choose
            to be seen. Every CoutureWay piece begins with a private conversation, continues with
            32 anatomical measurements, and finishes with a stitch traced by a master hand.
          </p>
          <p>
            Our atelier blends the precision of digital pattern-making with the patience of
            traditional finishing. The result is a garment that fits not only your body — but your
            life.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 border-t border-ivory/10 pt-12 text-center">
          {[
            { n: "12k+", l: "Garments tailored" },
            { n: "94", l: "Master tailors worldwide" },
            { n: "32", l: "Cities served" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-serif text-4xl text-gold md:text-5xl">{s.n}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-ivory/50">{s.l}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
