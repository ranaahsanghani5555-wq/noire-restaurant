"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/data";

interface LightboxProps {
  image: GalleryImage | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ image, onClose, onPrev, onNext }: LightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Trap focus and lock body scroll only while an image is open.
  useEffect(() => {
    if (!image) return;
    const el = closeButtonRef.current;
    if (el) el.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKeyDown);
    // Lock body scroll while open.
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [image, onClose, onPrev, onNext]);

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-label="Image lightbox"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0,0,0,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeButtonRef}
        onClick={onClose}
        aria-label="Close lightbox"
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          color: "rgba(255,255,255,0.7)",
          fontSize: "2rem",
          lineHeight: 1,
          padding: "0.5rem",
          zIndex: 1,
        }}
      >
        ×
      </button>

      <button
        onClick={onPrev}
        aria-label="Previous image"
        style={{
          position: "absolute",
          left: "1.5rem",
          top: "50%",
          transform: "translateY(-50%)",
          color: "rgba(255,255,255,0.7)",
          padding: "1rem",
          fontSize: "1.5rem",
        }}
      >
        ‹
      </button>

      <button
        onClick={onNext}
        aria-label="Next image"
        style={{
          position: "absolute",
          right: "1.5rem",
          top: "50%",
          transform: "translateY(-50%)",
          color: "rgba(255,255,255,0.7)",
          padding: "1rem",
          fontSize: "1.5rem",
        }}
      >
        ›
      </button>

      <div
        style={{
          position: "relative",
          width: "min(85vw, 1200px)",
          height: "min(80vh, 800px)",
        }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="85vw"
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      <p
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.5)",
          fontSize: "var(--small)",
          textAlign: "center",
          maxWidth: "80vw",
        }}
      >
        {image.alt}
      </p>
    </div>
  );
}