import type { Metadata } from "next";
import Link from "next/link";
import { galleryImages } from "@/lib/data";
import GalleryGrid from "@/components/GalleryGrid";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "From the kitchen to the dining room — photography and detail from the NOIRÉ collection.",
};

export default function GalleryPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div className="container container--narrow">
          <p className="eyebrow">THE NOIRÉ COLLECTION</p>
          <h1 className="heading-h1">A glimpse inside NOIRÉ.</h1>
          <p style={{ marginTop: "0.75rem" }}>
            From the kitchen to the dining room, explore the details that shape an
            evening with us.
          </p>
        </div>
      </header>

      <section style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="container">
          <ScrollReveal>
            <GalleryGrid images={galleryImages} />
          </ScrollReveal>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="section section--dark" style={{ textAlign: "center" }}>
        <div className="container container--narrow">
          <p className="eyebrow" style={{ color: "var(--accent-light)", marginBottom: "1rem" }}>
            RESERVATIONS
          </p>
          <h2 className="heading-h2" style={{ color: "var(--light)", marginBottom: "1.5rem" }}>
            Your table is waiting.
          </h2>
          <p
            className="body-lg"
            style={{ color: "rgba(250,249,246,0.6)", marginBottom: "2rem" }}
          >
            Join us for a seasonally-led evening you will remember.
          </p>
          <Link href="/reservations" className="btn btn--primary">
            Reserve a Table
          </Link>
        </div>
      </section>
    </div>
  );
}