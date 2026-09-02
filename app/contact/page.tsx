import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import ScrollReveal from "@/components/ScrollReveal";
import { restaurantInfo } from "@/lib/data";
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with NOIRÉ — address, hours, and contact form.",
};

export default function ContactPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div className="container container--narrow">
          <p className="eyebrow">CONTACT</p>
          <h1 className="heading-h1">Get in touch</h1>
        </div>
      </header>

      <section style={{ paddingBottom: "var(--section-gap)" }}>
        <div className="container">
          <div className="editorial" style={{ alignItems: "start" }}>
            {/* Left: Contact Info */}
            <ScrollReveal>
              <div>
                <div style={{ marginBottom: "3rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
                    <MapPinIcon size={20} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <h3 className="heading-h4" style={{ marginBottom: "0.25rem" }}>Address</h3>
                      <p style={{ fontSize: "var(--small)", color: "var(--muted)", lineHeight: 1.6 }}>
                        {restaurantInfo.address.street}<br />
                        {restaurantInfo.address.city}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
                    <PhoneIcon size={20} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <h3 className="heading-h4" style={{ marginBottom: "0.25rem" }}>Phone</h3>
                      <a href={`tel:${restaurantInfo.phone.replace(/\s/g, "")}`} style={{ fontSize: "var(--small)", color: "var(--muted)" }}>
                        {restaurantInfo.phone}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
                    <MailIcon size={20} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <h3 className="heading-h4" style={{ marginBottom: "0.25rem" }}>Email</h3>
                      <a href={`mailto:${restaurantInfo.email}`} style={{ fontSize: "var(--small)", color: "var(--muted)" }}>
                        {restaurantInfo.email}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
                    <ClockIcon size={20} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <h3 className="heading-h4" style={{ marginBottom: "0.5rem" }}>Opening Hours</h3>
                      <div style={{ fontSize: "var(--small)", color: "var(--muted)" }}>
                        {restaurantInfo.hours.map((h) => (
                          <div key={h.day} style={{ display: "flex", justifyContent: "space-between", gap: "1.5rem", padding: "0.25rem 0" }}>
                            <span>{h.day}</span>
                            <span style={{ color: "var(--text)" }}>{h.hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "16/9",
                    backgroundColor: "var(--surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ textAlign: "center", color: "var(--muted)" }}>
                    <MapPinIcon size={32} style={{ marginBottom: "0.5rem", opacity: 0.4 }} />
                    <p style={{ fontSize: "var(--small)" }}>Map placeholder</p>
                  </div>
                </div>

                <Link
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost"
                  style={{ width: "100%" }}
                >
                  Get Directions
                </Link>
              </div>
            </ScrollReveal>

            {/* Right: Contact Form */}
            <ScrollReveal delay={100}>
              <div>
                <h2 className="heading-h3" style={{ marginBottom: "0.5rem" }}>Send a message</h2>
                <p className="body-muted" style={{ marginBottom: "2rem", fontSize: "var(--small)" }}>
                  We aim to respond within 24 hours.
                </p>
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section
        className="section section--dark"
        style={{ textAlign: "center" }}
      >
        <div className="container container--narrow">
          <p className="eyebrow" style={{ color: "var(--accent-light)", marginBottom: "1rem" }}>
            JOIN US
          </p>
          <h2 className="heading-h2" style={{ color: "var(--light)", marginBottom: "1rem" }}>
            Prefer a table?
          </h2>
          <p className="body-lg" style={{ color: "rgba(250,249,246,0.6)", marginBottom: "2rem" }}>
            Reserve directly and let us prepare for your arrival.
          </p>
          <Link href="/reservations" className="btn btn--primary">
            Reserve a Table
          </Link>
        </div>
      </section>
    </div>
  );
}
