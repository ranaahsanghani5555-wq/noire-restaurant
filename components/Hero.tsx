"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDownIcon } from "@/components/Icons";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&auto=format&fit=crop&q=80",
    alt: "Elegant plated dinner at NOIRÉ",
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&auto=format&fit=crop&q=80",
    alt: "The NOIRÉ dining room bathed in warm light",
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&auto=format&fit=crop&q=80",
    alt: "A chef preparing a dish with precision",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight - 100, behavior: "smooth" });
  };

  return (
    <section
      aria-label="Hero"
      style={{
        position: "relative",
        height: "100dvh",
        minHeight: "600px",
        maxHeight: "1200px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--dark)",
      }}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === currentSlide ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
          }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}

      {/* Overlay — top edge is kept dark so the transparent navbar text stays readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(10,9,8,0.82) 0%, rgba(10,9,8,0.45) 120px, rgba(10,9,8,0.55) 45%, rgba(10,9,8,0.7) 100%)",
        }}
      />

      {/* Content — nudged slightly below center so the headline sits clear of the fixed navbar */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "clamp(5rem, 10vh, 7rem) var(--gutter) 0",
          paddingBottom: "3rem",
          maxWidth: "900px",
          marginInline: "auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p
          className="eyebrow"
          style={{
            color: "var(--accent-light)",
            marginBottom: "1.5rem",
            opacity: 0,
            animation: "heroReveal 0.8s 0.3s var(--ease) forwards",
          }}
        >
          CONTEMPORARY DINING
        </p>
        <h1
          className="heading-hero"
          style={{
            color: "var(--light)",
            marginBottom: "1.5rem",
            opacity: 0,
            animation: "heroReveal 0.8s 0.6s var(--ease) forwards",
          }}
        >
          An evening worth<br />remembering.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(0.9375rem, 1.5vw, 1.125rem)",
            color: "rgba(250,249,246,0.7)",
            maxWidth: "540px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.7,
            opacity: 0,
            animation: "heroReveal 0.8s 0.9s var(--ease) forwards",
          }}
        >
          Seasonal ingredients, expressive cooking and an intimate setting in the heart of the city.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            opacity: 0,
            animation: "heroReveal 0.8s 1.2s var(--ease) forwards",
          }}
        >
          <Link href="/reservations" className="btn btn--primary">
            Reserve a Table
          </Link>
          <Link href="/menu" className="btn btn--outline">
            Explore the Menu
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        aria-label="Scroll down"
        onClick={scrollDown}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(250,249,246,0.5)",
          animation: "heroReveal 0.8s 1.6s var(--ease) forwards, bounce 2s 2.4s infinite",
          opacity: 0,
          zIndex: 2,
        }}
      >
        <ArrowDownIcon size={20} />
      </button>

      <style>{`
        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </section>
  );
}
