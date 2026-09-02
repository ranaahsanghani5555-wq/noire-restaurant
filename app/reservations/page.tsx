import type { Metadata } from "next";
import ReservationForm from "@/components/ReservationForm";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Reserve a Table",
  description: "Request a table at NOIRÉ for dinner, celebrations and special occasions.",
};

export default function ReservationsPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div className="container container--narrow">
          <p className="eyebrow">RESERVATIONS</p>
          <h1 className="heading-h1">Reserve Your Table</h1>
        </div>
      </header>

      <section style={{ paddingBottom: "var(--section-gap)" }}>
        <div className="container">
          <div className="editorial" style={{ alignItems: "start" }}>
            <div style={{ order: 2 }}>
              <ReservationForm />
            </div>

            <div style={{ order: 1 }} className="res-info-side">
              <div
                className="img-hover"
                style={{
                  position: "relative",
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  backgroundColor: "var(--surface)",
                  marginBottom: "2rem",
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"
                  alt="The NOIRÉ dining room"
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <h3 className="heading-h4" style={{ marginBottom: "1rem" }}>
                A Few Details
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "var(--small)", color: "var(--muted)" }}>
                <p>For parties of 7 or more, please contact us directly.</p>
                <p>We hold reservations for 15 minutes past the booked time.</p>
                <p>A credit card may be required for parties of 6 or more.</p>
              </div>

              <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line)" }}>
                <h4
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--eyebrow)",
                    fontWeight: 500,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Contact
                </h4>
                <div style={{ fontSize: "var(--small)", color: "var(--muted)", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <a href="tel:+10005550148">+1 (000) 555-0148</a>
                  <a href="mailto:hello@noire.example">hello@noire.example</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 767px) {
          .res-info-side { order: 2 !important; }
        }
      `}</style>
    </div>
  );
}
