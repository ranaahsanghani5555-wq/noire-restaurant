"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/data";
import { SearchIcon, MenuIcon, CloseIcon } from "@/components/Icons";
import styles from "./Navbar.module.css";

const RESERVATION_HREF = "/reservations";

function isScrolled() {
  return typeof window !== "undefined" && window.scrollY > 60;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(isScrolled);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Solid (blurred) background after scrolling. At the very top, on the
  // homepage, the navbar is transparent over the dark hero; on other pages it
  // is always solid so links/logo are never placed over a light background.
  const isHome = pathname === "/";
  const overDark = isHome && !scrolled;
  const solid = !overDark;

  useEffect(() => {
    const onScroll = () => setScrolled(isScrolled());
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`${styles.navbar} ${solid ? styles["navbar--solid"] : ""}`}
      >
        <div className={styles.navbar__inner}>
          <Link href="/" aria-label="NOIRÉ Home" className={styles.navbar__logo}>
            NOIRÉ
          </Link>

          <div className={styles.navbar__actions}>
            {/* Desktop links */}
            <div className={styles.navbar__links}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.navbar__link} ${pathname === link.href ? styles["navbar__link--active"] : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              href="/search"
              aria-label="Search"
              className={styles.navbar__search}
            >
              <SearchIcon size={18} />
            </Link>

            <Link
              href={RESERVATION_HREF}
              className={`btn btn--primary btn--sm ${styles.navbar__reserve}`}
            >
              Reserve a Table
            </Link>

            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className={styles.navbar__toggle}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100dvh",
          zIndex: 1001,
          visibility: mobileOpen ? "visible" : "hidden",
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
      >
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            opacity: mobileOpen ? 1 : 0,
            transition: "opacity 0.35s var(--ease)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "min(360px, 85vw)",
            height: "100%",
            background: "var(--light)",
            transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.4s var(--ease)",
            display: "flex",
            flexDirection: "column",
            padding: "5rem var(--gutter) 2rem",
            overflowY: "auto",
          }}
        >
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              color: "var(--text)",
              padding: "0.5rem",
            }}
          >
            <CloseIcon size={22} />
          </button>

          <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "0.875rem 0",
                  fontFamily: "var(--font-serif)",
                  fontSize: "var(--h3)",
                  fontWeight: 400,
                  color: pathname === link.href ? "var(--accent)" : "var(--text)",
                  borderBottom: "1px solid var(--line)",
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: "2rem" }}>
            <Link
              href={RESERVATION_HREF}
              className="btn btn--primary"
              onClick={() => setMobileOpen(false)}
              style={{ width: "100%" }}
            >
              Reserve a Table
            </Link>
          </div>

          <div style={{ marginTop: "auto", paddingTop: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <a href={`tel:${"+10005550148"}`} style={{ fontSize: "var(--small)", color: "var(--muted)" }}>
              +1 (000) 555-0148
            </a>
            <span style={{ fontSize: "var(--small)", color: "var(--muted)" }}>
              18 Mercer Street, Downtown
            </span>
          </div>
        </div>
      </div>
    </>
  );
}