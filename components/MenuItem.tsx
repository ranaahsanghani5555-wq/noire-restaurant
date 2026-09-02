import type { Dish } from "@/lib/data";
import { formatPrice } from "@/lib/format";

interface MenuItemProps {
  dish: Dish;
}

export default function MenuItem({ dish }: MenuItemProps) {
  return (
    <div
      style={{
        paddingBlock: "1.25rem",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "1rem",
          marginBottom: "0.375rem",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--h4)",
            fontWeight: 500,
          }}
        >
          {dish.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          {dish.dietary && dish.dietary.length > 0 && (
            <div style={{ display: "flex", gap: "0.25rem" }}>
              {dish.dietary.map((d) => (
                <span
                  key={d}
                  className={`badge ${d === "GF" ? "badge--gf" : d === "V" ? "badge--v" : d === "VG" ? "badge--vg" : ""}`}
                  style={{ fontSize: "0.5625rem" }}
                >
                  {d}
                </span>
              ))}
            </div>
          )}
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "var(--h4)",
              fontWeight: 400,
              color: "var(--accent)",
              whiteSpace: "nowrap",
            }}
          >
            {dish.price > 0 ? formatPrice(dish.price) : "—"}
          </span>
        </div>
      </div>
      <p style={{ fontSize: "var(--small)", color: "var(--muted)", lineHeight: 1.5 }}>
        {dish.description}
      </p>
    </div>
  );
}
