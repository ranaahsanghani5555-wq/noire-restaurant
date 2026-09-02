import Link from "next/link";
import { restaurantInfo, navLinks } from "@/lib/data";
import { InstagramIcon, FacebookIcon } from "@/components/Icons";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--dark)",
        color: "rgba(250,249,246,0.7)",
        padding: "clamp(3rem, 6vw, 5rem) 0 2rem",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            marginBottom: "4rem",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
                fontWeight: 400,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--light)",
                display: "block",
                marginBottom: "1rem",
              }}
            >
              NOIRÉ
            </Link>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "var(--body-lg)",
                color: "rgba(250,249,246,0.5)",
                marginBottom: "1.5rem",
              }}
            >
              An evening worth remembering.
            </p>
            <NewsletterForm />
          </div>

          {/* Explore */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--eyebrow)",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "1.25rem",
              }}
            >
              Explore
            </h4>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: "var(--small)", transition: "color 0.2s" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Visit */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--eyebrow)",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "1.25rem",
              }}
            >
              Visit
            </h4>
            <address style={{ fontStyle: "normal", display: "flex", flexDirection: "column", gap: "0.625rem", fontSize: "var(--small)" }}>
              <span>{restaurantInfo.address.street}</span>
              <span>{restaurantInfo.address.city}</span>
              <a href={`tel:${restaurantInfo.phone.replace(/\s/g, "")}`}>
                {restaurantInfo.phone}
              </a>
              <div style={{ marginTop: "0.5rem" }}>
                {restaurantInfo.hours.map((h) => (
                  <div key={h.day} style={{ display: "flex", justifyContent: "space-between", gap: "1.5rem", padding: "0.25rem 0" }}>
                    <span style={{ color: "rgba(250,249,246,0.5)" }}>{h.day}</span>
                    <span>{h.hours}</span>
                  </div>
                ))}
              </div>
            </address>
          </div>

          {/* Follow & Reservations */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--eyebrow)",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "1.25rem",
              }}
            >
              Follow
            </h4>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
              <a
                href={restaurantInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: "rgba(250,249,246,0.6)", transition: "color 0.2s" }}
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href={restaurantInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{ color: "rgba(250,249,246,0.6)", transition: "color 0.2s" }}
              >
                <FacebookIcon size={20} />
              </a>
            </div>
            <Link
              href="/reservations"
              className="btn btn--primary btn--sm"
              style={{ marginTop: "0.5rem" }}
            >
              Reserve Your Table
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: "1px solid rgba(250,249,246,0.1)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            fontSize: "var(--micro)",
            color: "rgba(250,249,246,0.4)",
          }}
        >
          <span>&copy; {currentYear} NOIRÉ. All rights reserved.</span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 1.5fr 1fr 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
