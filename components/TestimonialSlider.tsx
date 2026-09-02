"use client";

import { useState, useEffect, useCallback } from "react";
import { testimonials } from "@/lib/data";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@/components/Icons";

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;

  const go = useCallback((idx: number) => {
    setCurrent(((idx % total) + total) % total);
  }, [total]);

  useEffect(() => {
    const timer = setInterval(() => {
      go(current + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, [current, go]);

  const t = testimonials[current];

  return (
    <div style={{ position: "relative", maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
      <div style={{ color: "var(--accent)", marginBottom: "1.5rem", display: "flex", justifyContent: "center", gap: "0.25rem" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon key={i} size={16} fill="currentColor" />
        ))}
      </div>

      <blockquote
        key={current}
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
          fontWeight: 400,
          fontStyle: "italic",
          lineHeight: 1.6,
          color: "var(--text)",
          marginBottom: "1.5rem",
          animation: "fadeUp 0.5s var(--ease)",
        }}
      >
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--small)",
          fontWeight: 500,
          color: "var(--text)",
          marginBottom: "0.25rem",
        }}
      >
        {t.guest}
      </p>
      {t.source && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--micro)",
            color: "var(--muted)",
          }}
        >
          {t.source}
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
        <button
          aria-label="Previous testimonial"
          onClick={() => go(current - 1)}
          style={{ color: "var(--muted)", padding: "0.5rem", transition: "color 0.2s" }}
        >
          <ChevronLeftIcon size={20} />
        </button>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => go(i)}
              style={{
                width: i === current ? "24px" : "6px",
                height: "6px",
                background: i === current ? "var(--accent)" : "var(--line)",
                transition: "all 0.3s var(--ease)",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
        <button
          aria-label="Next testimonial"
          onClick={() => go(current + 1)}
          style={{ color: "var(--muted)", padding: "0.5rem", transition: "color 0.2s" }}
        >
          <ChevronRightIcon size={20} />
        </button>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
