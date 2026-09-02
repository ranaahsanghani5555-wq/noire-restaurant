import Link from "next/link";
import type { Dish } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import Image from "next/image";

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Link
        href="/menu"
        className="img-hover"
        style={{
          position: "relative",
          aspectRatio: "4/3",
          overflow: "hidden",
          backgroundColor: "var(--surface)",
          marginBottom: "1rem",
        }}
      >
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          style={{ objectFit: "cover" }}
        />
      </Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.25rem" }}>
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--h4)",
            fontWeight: 500,
          }}
        >
          {dish.name}
        </h3>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--h4)",
            fontWeight: 400,
            color: "var(--accent)",
            whiteSpace: "nowrap",
          }}
        >
          {formatPrice(dish.price)}
        </span>
      </div>
      <p style={{ fontSize: "var(--small)", color: "var(--muted)", lineHeight: 1.5 }}>
        {dish.description}
      </p>
      {dish.dietary && dish.dietary.length > 0 && (
        <div style={{ display: "flex", gap: "0.375rem", marginTop: "0.625rem" }}>
          {dish.dietary.map((d) => (
            <span key={d} className={`badge ${d === "GF" ? "badge--gf" : d === "V" ? "badge--v" : d === "VG" ? "badge--vg" : ""}`}>
              {d}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
