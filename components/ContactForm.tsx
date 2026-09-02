"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api";
import { useToast } from "@/components/Toast";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const set = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.subject.trim()) e.subject = "Required";
    if (!form.message.trim()) e.message = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await submitContact(form);
      if (result.ok) {
        setSubmitted(true);
        addToast("Message sent successfully.", "success");
      }
    } catch {
      addToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
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
        <h3 className="heading-h3" style={{ marginBottom: "0.75rem" }}>
          Thank you.
        </h3>
        <p style={{ fontSize: "var(--body-lg)", color: "var(--muted)" }}>
          Your message has been received. We will respond within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>
        <div className="form-group">
          <label className="form-label" htmlFor="contact-name">
            Name <span className="required">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            className="form-input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "err-name" : undefined}
          />
          {errors.name && <span id="err-name" className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="contact-email">
            Email <span className="required">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            className="form-input"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "err-email" : undefined}
          />
          {errors.email && <span id="err-email" className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="contact-subject">
            Subject <span className="required">*</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            className="form-input"
            value={form.subject}
            onChange={(e) => set("subject", e.target.value)}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "err-subject" : undefined}
          />
          {errors.subject && <span id="err-subject" className="form-error">{errors.subject}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="contact-message">
            Message <span className="required">*</span>
          </label>
          <textarea
            id="contact-message"
            className="form-textarea"
            rows={5}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "err-message" : undefined}
          />
          {errors.message && <span id="err-message" className="form-error">{errors.message}</span>}
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--lg"
          disabled={loading}
          style={{ width: "100%", marginTop: "0.5rem" }}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}
