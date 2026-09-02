"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";
import { useToast } from "@/components/Toast";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const result = await subscribeNewsletter(email);
      addToast(result.message, "success");
      setEmail("");
    } catch {
      addToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0", maxWidth: "360px" }}>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        style={{
          flex: 1,
          padding: "0.625rem 0.75rem",
          background: "rgba(250,249,246,0.08)",
          border: "1px solid rgba(250,249,246,0.15)",
          borderRight: "none",
          color: "var(--light)",
          fontSize: "var(--small)",
          fontFamily: "var(--font-sans)",
          outline: "none",
        }}
      />
      <button
        type="submit"
        disabled={loading}
        className="btn btn--primary btn--sm"
        style={{
          borderRadius: 0,
          flexShrink: 0,
        }}
      >
        {loading ? "..." : "Subscribe"}
      </button>
    </form>
  );
}
