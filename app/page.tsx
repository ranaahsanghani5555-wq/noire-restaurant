import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import DishCard from "@/components/DishCard";
import ChefSection from "@/components/ChefSection";
import TestimonialSlider from "@/components/TestimonialSlider";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import { featuredDishes, galleryImages } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Signature Introduction */}
      <section className="section">
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
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&auto=format&fit=crop&q=80"
                  alt="A beautifully plated dish at NOIRÉ"
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div>
                <p className="eyebrow" style={{ marginBottom: "1rem" }}>
                  THE NOIRÉ EXPERIENCE
                </p>
                <h2 className="heading-h2" style={{ marginBottom: "1.5rem" }}>
                  Where food becomes<br />an occasion.
                </h2>
                <p
                  className="body-lg body-muted"
                  style={{ marginBottom: "1.5rem" }}
                >
                  At NOIRÉ, every evening is shaped by what the market offers and
                  what the season demands. We cook with intention, serve with warmth
                  and design each detail so you can simply enjoy being here.
                </p>
                <Link
                  href="/about"
                  className="btn btn--ghost"
                >
                  Discover Our Story
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Signature Dishes */}
      <section className="section section--surface">
        <div className="container">
          <ScrollReveal>
            <SectionHeading
              eyebrow="FROM THE KITCHEN"
              title="From Our Kitchen"
              description="A few favourites from tonight's menu."
            />
          </ScrollReveal>

          <div className="grid-4" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {featuredDishes.map((dish, i) => (
              <ScrollReveal key={dish.id} delay={i * 80}>
                <DishCard dish={dish} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <Link href="/menu" className="btn btn--ghost">
                View Full Menu
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Chef Section */}
      <ChefSection />

      {/* Restaurant Experience - Image Grid */}
      <section className="section section--surface">
        <div className="container">
          <ScrollReveal>
            <SectionHeading
              eyebrow="THE SPACE"
              title="An evening in the making"
            />
          </ScrollReveal>

          <div className="experience-grid">
            {galleryImages.slice(0, 5).map((img, i) => (
              <ScrollReveal key={img.id} delay={i * 60}>
                <div
                  className="img-hover"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "var(--background)",
                    aspectRatio: i === 0 ? "4/3" : i === 1 ? "3/4" : "1/1",
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <ScrollReveal>
            <SectionHeading
              eyebrow="GUESTS"
              title="What they say"
            />
          </ScrollReveal>
          <ScrollReveal>
            <TestimonialSlider />
          </ScrollReveal>
        </div>
      </section>

      {/* Reservation CTA */}
      <section
        className="section section--dark"
        style={{
          textAlign: "center",
          backgroundImage: "linear-gradient(rgba(23,21,19,0.88), rgba(23,21,19,0.88)), url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&auto=format&fit=crop&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container container--narrow">
          <ScrollReveal>
            <p className="eyebrow" style={{ color: "var(--accent-light)", marginBottom: "1rem" }}>
              RESERVATIONS
            </p>
            <h2 className="heading-h2" style={{ color: "var(--light)", marginBottom: "1rem" }}>
              Your table is waiting.
            </h2>
            <p
              className="body-lg"
              style={{
                color: "rgba(250,249,246,0.6)",
                marginBottom: "2rem",
                maxWidth: "480px",
                marginInline: "auto",
              }}
            >
              Join us for an evening of thoughtful cooking, warm hospitality and
              unforgettable moments.
            </p>
            <Link href="/reservations" className="btn btn--primary">
              Reserve a Table
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
