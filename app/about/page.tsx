import type { Metadata } from "next";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { chef } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How NOIRÉ began — a philosophy of seasons, craft and hospitality.",
};

const values = [
  {
    title: "Seasonality",
    description: "The menu follows the calendar. What's ripe today decides tomorrow's plate.",
  },
  {
    title: "Craft",
    description: "Every technique serves the ingredient, never the other way around.",
  },
  {
    title: "Hospitality",
    description: "A great meal is also a great welcome. We attend to the details that matter.",
  },
  {
    title: "Intention",
    description: "Nothing on the plate is there by accident. Every element earns its place.",
  },
];

export default function AboutPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div className="container container--narrow">
          <p className="eyebrow">OUR STORY</p>
          <h1 className="heading-h1">A restaurant built on seasons, patience and people.</h1>
        </div>
      </header>

      {/* Our Story */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="editorial">
            <ScrollReveal>
              <div
                className="img-hover"
                style={{
                  position: "relative",
                  aspectRatio: "4/5",
                  overflow: "hidden",
                  backgroundColor: "var(--surface)",
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&auto=format&fit=crop&q=80"
                  alt="An intimate dinner at NOIRÉ"
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div>
                <p className="eyebrow" style={{ marginBottom: "1rem" }}>THE BEGINNING</p>
                <h2 className="heading-h2" style={{ marginBottom: "1.5rem" }}>
                  It started with a conviction.
                </h2>
                <p className="body-lg body-muted" style={{ marginBottom: "1rem" }}>
                  NOIRÉ was born from a simple belief: that a great restaurant is
                  more than a menu. It is a feeling — of being welcomed, of
                  being nourished, of time well spent.
                </p>
                <p className="body-lg body-muted">
                  We opened our doors with a commitment to seasonal cooking,
                  honest ingredients and a dining room where the warmth matches
                  the lighting. Since then, every detail has been shaped by that
                  original intention.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section section--surface">
        <div className="container">
          <ScrollReveal>
            <div className="container--narrow" style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p className="eyebrow" style={{ marginBottom: "1rem" }}>OUR PHILOSOPHY</p>
              <h2 className="heading-h2">What we believe in</h2>
            </div>
          </ScrollReveal>

          <div className="grid-2" style={{ maxWidth: "900px", margin: "0 auto", gap: "3rem" }}>
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 80}>
                <div>
                  <h3 className="heading-h3" style={{ marginBottom: "0.75rem" }}>
                    {v.title}
                  </h3>
                  <p className="body-muted">{v.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Chef */}
      <section className="section">
        <div className="container">
          <div className="editorial">
            <ScrollReveal>
              <div
                className="img-hover"
                style={{
                  position: "relative",
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  backgroundColor: "var(--surface)",
                }}
              >
                <Image
                  src={chef.portrait}
                  alt={chef.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div>
                <p className="eyebrow" style={{ marginBottom: "1rem" }}>THE CHEF</p>
                <h2 className="heading-h2" style={{ marginBottom: "1.5rem" }}>
                  {chef.name}
                </h2>
                <p className="body-lg body-muted" style={{ marginBottom: "1rem" }}>
                  {chef.bio}
                </p>
                <blockquote
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: "var(--body-lg)",
                    borderLeft: "2px solid var(--accent)",
                    paddingLeft: "1.25rem",
                    marginTop: "2rem",
                    lineHeight: 1.6,
                  }}
                >
                  &ldquo;{chef.quote}&rdquo;
                </blockquote>
                <p style={{ fontWeight: 500, marginTop: "1rem", fontSize: "var(--small)" }}>{chef.name}</p>
                <p style={{ fontSize: "var(--micro)", color: "var(--muted)" }}>{chef.role}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* The Space */}
      <section className="section section--surface">
        <div className="container">
          <ScrollReveal>
            <div className="container--narrow" style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p className="eyebrow" style={{ marginBottom: "1rem" }}>THE SPACE</p>
              <h2 className="heading-h2">Designed for the evening</h2>
            </div>
          </ScrollReveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }} className="about-space-grid">
            <ScrollReveal>
              <div
                className="img-hover"
                style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", backgroundColor: "var(--background)" }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80"
                  alt="The main dining room"
                  fill
                  sizes="100vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </ScrollReveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <ScrollReveal delay={80}>
                <div
                  className="img-hover"
                  style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", backgroundColor: "var(--background)" }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&auto=format&fit=crop&q=80"
                    alt="The bar area"
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={160}>
                <div
                  className="img-hover"
                  style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", backgroundColor: "var(--background)" }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=80"
                    alt="Candlelit table setting"
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
