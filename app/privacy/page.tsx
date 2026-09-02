import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "NOIRÉ privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div className="container container--narrow">
          <p className="eyebrow">LEGAL</p>
          <h1 className="heading-h1">Privacy Policy</h1>
        </div>
      </header>

      <section style={{ paddingBottom: "var(--section-gap)" }}>
        <div className="container container--narrow">
          <div style={{ fontSize: "var(--body-lg)", color: "var(--muted)", lineHeight: 1.8 }}>
            <p style={{ marginBottom: "1.5rem" }}>
              <em>Last updated: September 2026</em>
            </p>

            <h2 className="heading-h4" style={{ color: "var(--text)", marginBottom: "1rem" }}>Information We Collect</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              When you visit NOIRÉ&apos;s website, we may collect certain information
              automatically, including your IP address, browser type, operating
              system, referring URLs and pages visited. This information is used
              solely to improve our website and services.
            </p>

            <h2 className="heading-h4" style={{ color: "var(--text)", marginBottom: "1rem" }}>Reservation Data</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              When you submit a reservation or inquiry, we collect the information
              you provide, including your name, email address, phone number and
              any special requests. This data is used exclusively to manage your
              reservation and is not shared with third parties.
            </p>

            <h2 className="heading-h4" style={{ color: "var(--text)", marginBottom: "1rem" }}>Cookies</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              Our website uses essential cookies to ensure proper functionality.
              We do not use tracking cookies or third-party analytics without
              your explicit consent.
            </p>

            <h2 className="heading-h4" style={{ color: "var(--text)", marginBottom: "1rem" }}>Data Security</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              We implement appropriate security measures to protect your personal
              information. However, no method of transmission over the Internet
              is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="heading-h4" style={{ color: "var(--text)", marginBottom: "1rem" }}>Contact Us</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              If you have questions about this Privacy Policy, please contact us
              at <a href="mailto:hello@noire.example" style={{ color: "var(--accent)" }}>hello@noire.example</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
