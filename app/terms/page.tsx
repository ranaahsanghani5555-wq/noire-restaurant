import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "NOIRÉ terms of service.",
};

export default function TermsPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div className="container container--narrow">
          <p className="eyebrow">LEGAL</p>
          <h1 className="heading-h1">Terms of Service</h1>
        </div>
      </header>

      <section style={{ paddingBottom: "var(--section-gap)" }}>
        <div className="container container--narrow">
          <div style={{ fontSize: "var(--body-lg)", color: "var(--muted)", lineHeight: 1.8 }}>
            <p style={{ marginBottom: "1.5rem" }}>
              <em>Last updated: September 2026</em>
            </p>

            <h2 className="heading-h4" style={{ color: "var(--text)", marginBottom: "1rem" }}>Website Use</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              By accessing the NOIRÉ website, you agree to use the site only for
              lawful purposes and in accordance with these Terms. You may not
              use the site in any way that could damage, disable or impair its
              functionality.
            </p>

            <h2 className="heading-h4" style={{ color: "var(--text)", marginBottom: "1rem" }}>Reservations</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              Reservation requests submitted through this website are subject to
              confirmation by our team. A reservation is not confirmed until you
              receive a confirmation notification from NOIRÉ. We reserve the right
              to modify or cancel reservations in exceptional circumstances.
            </p>

            <h2 className="heading-h4" style={{ color: "var(--text)", marginBottom: "1rem" }}>Intellectual Property</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              All content on this website, including text, images, logos and
              design elements, is the property of NOIRÉ or its content suppliers
              and is protected by applicable intellectual property laws.
            </p>

            <h2 className="heading-h4" style={{ color: "var(--text)", marginBottom: "1rem" }}>Limitation of Liability</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              NOIRÉ strives to keep website information accurate and up to date.
              However, we make no warranties regarding the completeness or
              accuracy of the content. We are not liable for any damages arising
              from your use of the website.
            </p>

            <h2 className="heading-h4" style={{ color: "var(--text)", marginBottom: "1rem" }}>Contact</h2>
            <p>
              For questions regarding these Terms, please contact us at{" "}
              <a href="mailto:hello@noire.example" style={{ color: "var(--accent)" }}>
                hello@noire.example
              </a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
