import Image from "next/image";
import { chef } from "@/lib/data";
import ScrollReveal from "@/components/ScrollReveal";

export default function ChefSection() {
  return (
    <section className="section" style={{ overflow: "hidden" }}>
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
              <p className="eyebrow" style={{ marginBottom: "1rem" }}>
                THE CHEF
              </p>
              <h2 className="heading-h2" style={{ marginBottom: "1.5rem" }}>
                Driven by craft.
              </h2>
              <p
                style={{
                  fontSize: "var(--body-lg)",
                  color: "var(--muted)",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                }}
              >
                {chef.bio}
              </p>
              <blockquote
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
                  color: "var(--text)",
                  borderLeft: "2px solid var(--accent)",
                  paddingLeft: "1.25rem",
                  marginTop: "2rem",
                  lineHeight: 1.5,
                }}
              >
                &ldquo;{chef.quote}&rdquo;
              </blockquote>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--small)",
                  fontWeight: 500,
                  marginTop: "1rem",
                  color: "var(--text)",
                }}
              >
                {chef.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--micro)",
                  color: "var(--muted)",
                }}
              >
                {chef.role}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
