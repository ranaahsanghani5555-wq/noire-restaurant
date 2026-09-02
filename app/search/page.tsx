"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { searchEverything } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { Dish } from "@/lib/data";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [query, setQuery] = useState(q);
  const [dishResults, setDishResults] = useState<Dish[]>([]);
  const [pageResults, setPageResults] = useState<{ title: string; href: string; excerpt: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const lastQueryRef = useRef<string | null>(null);

  const runSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setDishResults([]);
      setPageResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const results = await searchEverything(term);
      setDishResults(results.dishes);
      setPageResults(results.pages);
      setSearched(true);
    } catch {
      setDishResults([]);
      setPageResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Respond to the URL query param when it changes (e.g. client-side nav).
  useEffect(() => {
    if (q && q !== lastQueryRef.current) {
      lastQueryRef.current = q;
      setQuery(q);
      runSearch(q);
    }
  }, [q, runSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const totalResults = dishResults.length + pageResults.length;

  return (
    <>
      <section style={{ paddingTop: "clamp(6rem, 12vh, 9rem)", paddingBottom: "var(--section-gap)" }}>
        <div className="container container--narrow">
          {/* Search Form */}
          <form onSubmit={handleSubmit} style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", gap: "0", borderBottom: "2px solid var(--line)" }}>
              <label htmlFor="search-input" className="sr-only">Search</label>
              <input
                id="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search menu, pages, events..."
                style={{
                  flex: 1,
                  padding: "1rem 0",
                  fontSize: "var(--body-lg)",
                  fontFamily: "var(--font-serif)",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text)",
                }}
              />
              <button
                type="submit"
                className="btn btn--primary btn--sm"
                disabled={loading}
                style={{ flexShrink: 0 }}
              >
                {loading ? "..." : "Search"}
              </button>
            </div>
          </form>

          {/* Results */}
          {searched && (
            <div>
              <p style={{ fontSize: "var(--small)", color: "var(--muted)", marginBottom: "2rem" }}>
                {loading
                  ? "Searching..."
                  : totalResults === 0
                    ? `No results found for "${q}"`
                    : `${totalResults} result${totalResults === 1 ? "" : "s"} for "${q}"`
                }
              </p>

              {!loading && totalResults === 0 && (
                <div style={{ textAlign: "center", padding: "4rem 0" }}>
                  <p style={{ fontSize: "var(--body-lg)", color: "var(--muted)", marginBottom: "1.5rem" }}>
                    No results found.
                  </p>
                  <Link href="/menu" className="btn btn--ghost">
                    Browse the Menu
                  </Link>
                </div>
              )}

              {/* Dish Results */}
              {dishResults.length > 0 && (
                <div style={{ marginBottom: "3rem" }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--eyebrow)",
                      fontWeight: 500,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      marginBottom: "1.5rem",
                    }}
                  >
                    Menu Items
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {dishResults.map((dish) => (
                      <Link
                        key={dish.id}
                        href="/menu"
                        style={{
                          display: "flex",
                          gap: "1.25rem",
                          padding: "1.25rem 0",
                          borderBottom: "1px solid var(--line)",
                          alignItems: "center",
                          transition: "opacity 0.2s",
                        }}
                      >
                        <div
                          className="img-hover"
                          style={{
                            position: "relative",
                            width: "80px",
                            height: "80px",
                            flexShrink: 0,
                            overflow: "hidden",
                            backgroundColor: "var(--surface)",
                          }}
                        >
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            fill
                            sizes="80px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--h4)", fontWeight: 500, marginBottom: "0.25rem" }}>
                            {dish.name}
                          </h3>
                          <p style={{ fontSize: "var(--small)", color: "var(--muted)" }}>
                            {dish.description}
                          </p>
                        </div>
                        <span
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "var(--h4)",
                            color: "var(--accent)",
                            flexShrink: 0,
                          }}
                        >
                          {formatPrice(dish.price)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Page Results */}
              {pageResults.length > 0 && (
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--eyebrow)",
                      fontWeight: 500,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      marginBottom: "1.5rem",
                    }}
                  >
                    Pages
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {pageResults.map((page) => (
                      <Link
                        key={page.href}
                        href={page.href}
                        style={{
                          padding: "1.25rem 0",
                          borderBottom: "1px solid var(--line)",
                          transition: "opacity 0.2s",
                        }}
                      >
                        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--h4)", fontWeight: 500, marginBottom: "0.25rem" }}>
                          {page.title}
                        </h3>
                        <p style={{ fontSize: "var(--small)", color: "var(--muted)" }}>
                          {page.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div className="container container--narrow">
          <p className="eyebrow">SEARCH</p>
          <h1 className="heading-h1">Find what you&apos;re looking for</h1>
        </div>
      </header>
      <Suspense fallback={null}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
