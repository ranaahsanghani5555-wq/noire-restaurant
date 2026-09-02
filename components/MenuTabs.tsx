"use client";

import { useState } from "react";
import type { MenuCategory, Dish } from "@/lib/data";
import MenuItem from "@/components/MenuItem";

interface MenuTabsProps {
  categories: MenuCategory[];
  dishes: Dish[];
}

export default function MenuTabs({ categories, dishes }: MenuTabsProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");

  const activeCategory = categories.find((c) => c.id === activeId);

  const categoryDishes = activeCategory
    ? activeCategory.dishIds
        .map((id) => dishes.find((d) => d.id === id))
        .filter((d): d is Dish => Boolean(d))
    : [];

  return (
    <div>
      <div className="tabs" role="tablist">
        {categories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeId === cat.id}
            className={`tab ${activeId === cat.id ? "active" : ""}`}
            onClick={() => setActiveId(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {activeCategory?.description && (
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "var(--body-lg)",
            color: "var(--muted)",
            marginBottom: "2rem",
          }}
        >
          {activeCategory.description}
        </p>
      )}

      <div role="tabpanel">
        {categoryDishes.map((dish) => (
          <MenuItem key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
}
