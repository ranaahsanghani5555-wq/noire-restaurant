interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={align === "center" ? "container--narrow" : ""}
      style={{
        textAlign: align,
        marginBottom: "3rem",
      }}
    >
      {eyebrow && (
        <p
          className="eyebrow"
          style={{ marginBottom: "0.875rem" }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className="heading-h2"
        style={{
          color: light ? "var(--light)" : "var(--text)",
          marginBottom: description ? "1rem" : 0,
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="body-lg body-muted"
          style={{
            maxWidth: "540px",
            marginInline: align === "center" ? "auto" : undefined,
            color: light ? "rgba(250,249,246,0.7)" : undefined,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
