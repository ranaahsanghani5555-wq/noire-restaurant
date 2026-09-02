"use client";

import { useState } from "react";
import { CloseIcon } from "@/components/Icons";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      role="banner"
      style={{
        background: "var(--dark)",
        color: "rgba(250,249,246,0.75)",
        fontSize: "var(--micro)",
        fontFamily: "var(--font-sans)",
        letterSpacing: "0.06em",
        textAlign: "center",
        padding: "0.5rem var(--gutter)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <span>
        Reservations recommended &middot; Open Tuesday–Sunday
      </span>
      <button
        aria-label="Close announcement"
        onClick={() => setVisible(false)}
        style={{
          position: "absolute",
          right: "0.75rem",
          top: "50%",
          transform: "translateY(-50%)",
          color: "rgba(250,249,246,0.5)",
          padding: "0.25rem",
          display: "flex",
        }}
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}
