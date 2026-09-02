import type { Metadata } from "next";
import { dishes, menuCategories } from "@/lib/data";
import MenuTabs from "@/components/MenuTabs";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "The Menu",
  description: "Seasonal cooking shaped by the best ingredients available today.",
};

export default function MenuPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div className="container container--narrow">
          <p className="eyebrow">THE MENU</p>
          <h1 className="heading-h1">Seasonal cooking shaped by the best ingredients available today.</h1>
        </div>
      </header>

      <section style={{ paddingBottom: "var(--section-gap)" }}>
        <div className="container container--narrow">
          <ScrollReveal>
            <MenuTabs categories={menuCategories} dishes={dishes} />
          </ScrollReveal>

          <ScrollReveal>
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <span className="btn btn--ghost">
                Download Menu
              </span>
              <p style={{ fontSize: "var(--micro)", color: "var(--muted)", marginTop: "0.75rem" }}>
                PDF placeholder — no real file is linked.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
