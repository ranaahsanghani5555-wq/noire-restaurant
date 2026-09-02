"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/data";
import Lightbox from "@/components/Lightbox";

interface GalleryGridProps {
  images: GalleryImage[];
}

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "food", label: "Food" },
  { id: "dining-room", label: "Dining Room" },
  { id: "kitchen", label: "Kitchen" },
  { id: "bar", label: "Bar" },
  { id: "moments", label: "Moments" },
];

interface GalleryCardProps {
  image: GalleryImage;
  priority: boolean;
  onOpen: () => void;
}

function GalleryCard({ image, priority, onOpen }: GalleryCardProps) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      onClick={onOpen}
      className="gallery-item img-hover"
      aria-label={`Open image: ${image.alt}`}
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--surface)",
        cursor: "pointer",
        border: "none",
        padding: 0,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: image.category === "dining-room" ? "4/3" : "3/4",
        }}
      >
        {failed ? (
          <div
            role="img"
            aria-label={image.alt}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background:
                "linear-gradient(160deg, #2b2824 0%, #1b1916 60%, #161412 100%)",
              color: "rgba(250,249,246,0.55)",
            }}
          >
            <span style={{ fontSize: "2rem", lineHeight: 1, fontFamily: "var(--font-serif)" }}>
              NOIRÉ
            </span>
            <span style={{ fontSize: "var(--micro)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              The dining experience
            </span>
          </div>
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 767px) 46vw, (max-width: 1023px) 31vw, 23vw"
            loading={priority ? "eager" : "lazy"}
            style={{ objectFit: "cover" }}
            onError={() => setFailed(true)}
          />
        )}

        {/* Subtle overlay, revealed on desktop hover */}
        <span className="img-hover__overlay" aria-hidden="true" />
      </div>
    </button>
  );
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [active, setActive] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (active === "all" ? images : images.filter((i) => i.category === active)),
    [images, active]
  );

  const currentImage = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null)),
    [filtered.length]
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null)),
    [filtered.length]
  );

  const onOpen = useCallback((idx: number) => setLightboxIndex(idx), []);

  return (
    <>
      {/* Category filters */}
      <div className="tabs" role="tablist" aria-label="Gallery categories" style={{ marginBottom: "2.5rem" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={active === cat.id}
            className={`tab ${active === cat.id ? "active" : ""}`}
            onClick={() => setActive(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Editorial gallery grid */}
      <div className="gallery-masonry">
        {filtered.map((img, idx) => (
          <GalleryCard
            key={img.id}
            image={img}
            priority={idx < 2}
            onOpen={() => onOpen(idx)}
          />
        ))}
      </div>

      {currentImage && (
        <Lightbox image={currentImage} onClose={closeLightbox} onPrev={prev} onNext={next} />
      )}

      <style>{`
        .gallery-masonry {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }
        @media (min-width: 768px) {
          .gallery-masonry {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
          }
          .gallery-masonry > *:nth-child(12n + 1),
          .gallery-masonry > *:nth-child(12n + 8) {
            grid-column: span 2;
            grid-row: span 2;
          }
          .gallery-masonry > *:nth-child(12n + 4),
          .gallery-masonry > *:nth-child(12n + 11) {
            grid-row: span 2;
          }
        }
        @media (min-width: 1200px) {
          .gallery-masonry {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </>
  );
}