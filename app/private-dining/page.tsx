"use client";

import { useState } from "react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { submitEventInquiry } from "@/lib/api";
import { useToast } from "@/components/Toast";

const EVENT_TYPES = [
  "Corporate Dinner",
  "Private Celebration",
  "Wedding Reception",
  "Birthday Party",
  "Product Launch",
  "Other",
];

export default function PrivateDiningPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    guests: "",
    date: "",
    budget: "",
    message: "",
  });

  const set = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.message.trim()) e.message = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await submitEventInquiry(form);
      if (result.ok) {
        setSubmitted(true);
        addToast(result.message, "success");
      }
    } catch {
      addToast("Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {/* Hero */}
      <section
        style={{
          position: "relative",
          height: "60dvh",
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&auto=format&fit=crop&q=80"
          alt="A long table dressed for a private event"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(10,9,8,0.4), rgba(10,9,8,0.7))",
          }}
        />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 var(--gutter)" }}>
          <p className="eyebrow" style={{ color: "var(--accent-light)", marginBottom: "1rem" }}>
            PRIVATE DINING
          </p>
          <h1 className="heading-hero" style={{ color: "var(--light)" }}>
            Plan Your Evening
          </h1>
        </div>
      </section>

      {/* Introduction */}
      <section className="section">
        <div className="container container--narrow">
          <ScrollReveal>
            <p className="body-lg body-muted" style={{ textAlign: "center", fontSize: "clamp(1.0625rem, 1.8vw, 1.25rem)" }}>
              From intimate dinners for twelve to grand celebrations for a hundred,
              NOIRÉ offers spaces and menus shaped to the occasion. Our private dining
              team will work with you to craft an evening that feels distinctly yours.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Event Spaces */}
      <section className="section section--surface">
        <div className="container">
          <ScrollReveal>
            <SectionHeadingInline eyebrow="SPACES" title="Our event spaces" />
          </ScrollReveal>
          <div className="grid-3" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {[
              { name: "The Cellar", capacity: "12 – 20 guests", desc: "A candlelit private room beneath the restaurant. Perfect for intimate dinners and celebrations.", img: "photo-1555126634-323283e090fa" },
              { name: "The Salon", capacity: "30 – 60 guests", desc: "An elegant private space with its own bar and dedicated service team.", img: "photo-1519167758481-83f550bb49b3" },
              { name: "Full Restaurant", capacity: "70 – 120 guests", desc: "Close the restaurant for your evening. Full buyout with custom menus and curated service.", img: "photo-1517248135467-4c7edcad34c4" },
            ].map((space, i) => (
              <ScrollReveal key={space.name} delay={i * 80}>
                <div style={{ backgroundColor: "var(--background)" }}>
                  <div className="img-hover" style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", backgroundColor: "var(--surface)" }}>
                    <Image
                      src={`https://images.unsplash.com/${space.img}?w=600&auto=format&fit=crop&q=80`}
                      alt={space.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "1.5rem 0" }}>
                    <h3 className="heading-h4" style={{ marginBottom: "0.25rem" }}>{space.name}</h3>
                    <p style={{ fontSize: "var(--micro)", color: "var(--accent)", fontWeight: 500, letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                      {space.capacity}
                    </p>
                    <p style={{ fontSize: "var(--small)", color: "var(--muted)", lineHeight: 1.6 }}>
                      {space.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate / Weddings */}
      <section className="section">
        <div className="container container--narrow">
          <div className="editorial" style={{ gap: "3rem" }}>
            <ScrollReveal>
              <div>
                <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>CORPORATE DINNERS</p>
                <h2 className="heading-h3" style={{ marginBottom: "0.75rem" }}>
                  Impress your guests
                </h2>
                <p className="body-muted" style={{ fontSize: "var(--small)", lineHeight: 1.7 }}>
                  Whether it is a client dinner, a team celebration or a board meeting,
                  our corporate packages include tailored menus, dedicated event coordination
                  and a setting that speaks for itself.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div>
                <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>CELEBRATIONS</p>
                <h2 className="heading-h3" style={{ marginBottom: "0.75rem" }}>
                  Mark the moment
                </h2>
                <p className="body-muted" style={{ fontSize: "var(--small)", lineHeight: 1.7 }}>
                  Birthdays, anniversaries, engagements — milestones deserve a room
                  that rises to the occasion. We will help you plan every detail so
                  you can enjoy the evening alongside your guests.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Custom Menus */}
      <section className="section section--surface">
        <div className="container container--narrow" style={{ textAlign: "center" }}>
          <ScrollReveal>
            <p className="eyebrow" style={{ marginBottom: "1rem" }}>CUSTOM MENUS</p>
            <h2 className="heading-h2" style={{ marginBottom: "1rem" }}>Tailored to the occasion</h2>
            <p className="body-lg body-muted" style={{ maxWidth: "540px", margin: "0 auto 2rem" }}>
              Our chef will craft a bespoke menu for your event. From seasonal
              tasting menus to family-style feasts, every dish is prepared with
              the same care as our nightly service.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Event Inquiry Form */}
      <section className="section" id="inquire">
        <div className="container container--narrow">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p className="eyebrow" style={{ marginBottom: "1rem" }}>GET IN TOUCH</p>
              <h2 className="heading-h2">Plan Your Evening</h2>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "var(--light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: "1.5rem",
                  }}
                >
                  ✓
                </div>
                <h3 className="heading-h3" style={{ marginBottom: "0.75rem" }}>Thank you.</h3>
                <p style={{ fontSize: "var(--body-lg)", color: "var(--muted)" }}>
                  Our private dining team will be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }} className="pd-form">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="pd-form-2col">
                    <div className="form-group">
                      <label className="form-label" htmlFor="pd-name">
                        Name <span className="required">*</span>
                      </label>
                      <input id="pd-name" type="text" className="form-input" value={form.name} onChange={(e) => set("name", e.target.value)} />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="pd-email">
                        Email <span className="required">*</span>
                      </label>
                      <input id="pd-email" type="email" className="form-input" value={form.email} onChange={(e) => set("email", e.target.value)} />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="pd-form-2col">
                    <div className="form-group">
                      <label className="form-label" htmlFor="pd-phone">Phone</label>
                      <input id="pd-phone" type="tel" className="form-input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="pd-event">Event Type</label>
                      <select id="pd-event" className="form-select" value={form.eventType} onChange={(e) => set("eventType", e.target.value)}>
                        <option value="">Select event type</option>
                        {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }} className="pd-form-3col">
                    <div className="form-group">
                      <label className="form-label" htmlFor="pd-guests">Guest Count</label>
                      <input id="pd-guests" type="number" min="1" className="form-input" value={form.guests} onChange={(e) => set("guests", e.target.value)} placeholder="e.g. 40" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="pd-date">Preferred Date</label>
                      <input id="pd-date" type="date" className="form-input" value={form.date} onChange={(e) => set("date", e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="pd-budget">Budget</label>
                      <input id="pd-budget" type="text" className="form-input" value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="e.g. $5,000 – $10,000" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="pd-message">
                      Message <span className="required">*</span>
                    </label>
                    <textarea id="pd-message" className="form-textarea" rows={4} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us about your event..." />
                    {errors.message && <span className="form-error">{errors.message}</span>}
                  </div>

                  <button type="submit" className="btn btn--primary btn--lg" disabled={loading} style={{ width: "100%" }}>
                    {loading ? "Processing..." : "Submit Inquiry"}
                  </button>
                </div>
              </form>
            )}
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

function SectionHeadingInline({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
      <p className="eyebrow" style={{ marginBottom: "1rem" }}>{eyebrow}</p>
      <h2 className="heading-h2">{title}</h2>
    </div>
  );
}
