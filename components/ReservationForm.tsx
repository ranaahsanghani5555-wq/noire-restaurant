"use client";

import { useState } from "react";
import { submitReservation } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { todayISO } from "@/lib/format";

const TIME_OPTIONS = [
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
];

const GUEST_OPTIONS = ["1", "2", "3", "4", "5", "6", "7+"];
const OCCASION_OPTIONS = ["Dinner", "Birthday", "Anniversary", "Business", "Celebration", "Other"];

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string;
}

export default function ReservationForm() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    occasion: "Dinner",
    specialRequests: "",
  });

  const set = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.date) e.date = "Required";
    if (!form.time) e.time = "Required";
    if (!form.guests) e.guests = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await submitReservation(form);
      if (result.ok && result.confirmation) {
        setConfirmation(result.confirmation);
        setSubmitted(true);
        addToast("Reservation request received.", "success");
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
          Thank you, {form.firstName}.
        </h3>
        <p style={{ fontSize: "var(--body-lg)", color: "var(--muted)", marginBottom: "0.5rem" }}>
          Your reservation request has been received.
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--small)",
            color: "var(--accent)",
            fontWeight: 500,
            letterSpacing: "0.05em",
            marginBottom: "2rem",
          }}
        >
          Confirmation: {confirmation}
        </p>
        <p
          style={{
            fontSize: "var(--micro)",
            color: "var(--muted)",
            padding: "1rem",
            background: "var(--surface)",
            borderRadius: "2px",
          }}
        >
          Our booking team will confirm your reservation by email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p
        style={{
          fontSize: "var(--micro)",
          color: "var(--muted)",
          padding: "0.75rem 1rem",
          background: "var(--surface)",
          marginBottom: "2rem",
          borderLeft: "2px solid var(--accent)",
        }}
      >
        Bookings are subject to table availability at the time you request.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }} className="res-form-grid">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="res-first">
              First Name <span className="required">*</span>
            </label>
            <input
              id="res-first"
              type="text"
              className="form-input"
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "err-first" : undefined}
            />
            {errors.firstName && <span id="err-first" className="form-error">{errors.firstName}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="res-last">
              Last Name <span className="required">*</span>
            </label>
            <input
              id="res-last"
              type="text"
              className="form-input"
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "err-last" : undefined}
            />
            {errors.lastName && <span id="err-last" className="form-error">{errors.lastName}</span>}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="res-email">
              Email <span className="required">*</span>
            </label>
            <input
              id="res-email"
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
            <label className="form-label" htmlFor="res-phone">
              Phone <span className="required">*</span>
            </label>
            <input
              id="res-phone"
              type="tel"
              className="form-input"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "err-phone" : undefined}
            />
            {errors.phone && <span id="err-phone" className="form-error">{errors.phone}</span>}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem" }} className="res-form-3col">
          <div className="form-group">
            <label className="form-label" htmlFor="res-date">
              Date <span className="required">*</span>
            </label>
            <input
              id="res-date"
              type="date"
              className="form-input"
              min={todayISO()}
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? "err-date" : undefined}
            />
            {errors.date && <span id="err-date" className="form-error">{errors.date}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="res-time">
              Time <span className="required">*</span>
            </label>
            <select
              id="res-time"
              className="form-select"
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
              aria-invalid={!!errors.time}
              aria-describedby={errors.time ? "err-time" : undefined}
            >
              <option value="">Select a time</option>
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.time && <span id="err-time" className="form-error">{errors.time}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="res-guests">
              Guests <span className="required">*</span>
            </label>
            <select
              id="res-guests"
              className="form-select"
              value={form.guests}
              onChange={(e) => set("guests", e.target.value)}
            >
              {GUEST_OPTIONS.map((g) => (
                <option key={g} value={g}>{g} {g === "1" ? "guest" : "guests"}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="res-occasion">Occasion</label>
          <select
            id="res-occasion"
            className="form-select"
            value={form.occasion}
            onChange={(e) => set("occasion", e.target.value)}
          >
            {OCCASION_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="res-requests">Special Requests</label>
          <textarea
            id="res-requests"
            className="form-textarea"
            rows={3}
            value={form.specialRequests}
            onChange={(e) => set("specialRequests", e.target.value)}
            placeholder="Dietary requirements, seating preferences, etc."
          />
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--lg"
          disabled={loading}
          style={{ width: "100%", marginTop: "0.5rem" }}
        >
          {loading ? "Processing..." : "Request Reservation"}
        </button>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .res-form-grid > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}
