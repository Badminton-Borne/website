import Link from "next/link";

// Global 404 for requests outside the [locale] segment (unknown locales and
// dot-containing paths that bypass the locale proxy, e.g. /favicon.png).
// The root layout is a passthrough, so this boundary must render its own
// <html> and <body>; it sits outside NextIntlClientProvider and globals.css,
// hence inline styles in brand colors (navy/lime) and no i18n.
export default function RootNotFound() {
  return (
    <html lang="nl">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          background: "#060C1A",
          color: "#ffffff",
        }}
      >
        <div style={{ textAlign: "center", padding: "3rem 1.25rem" }}>
          <p
            aria-hidden="true"
            style={{
              margin: "0 0 1rem",
              fontSize: "4.5rem",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "#C2F03C",
            }}
          >
            404
          </p>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              margin: "0 0 1rem",
            }}
          >
            Deze rally is verloren
          </h1>
          <p style={{ color: "#8A97B0", margin: "0 0 0.5rem", lineHeight: 1.6 }}>
            De pagina die je zoekt is uit beeld geslagen.
          </p>
          <p style={{ color: "#8A97B0", margin: "0 0 2rem", lineHeight: 1.6 }}>
            The page you are looking for does not exist.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              background: "#C2F03C",
              color: "#091225",
              fontWeight: 700,
              padding: "0.85rem 1.75rem",
              borderRadius: "999px",
              textDecoration: "none",
            }}
          >
            Naar de homepage
          </Link>
        </div>
      </body>
    </html>
  );
}
