import Link from "next/link";

// Global 404 for requests outside the [locale] segment (unknown locales and
// dot-containing paths that bypass the locale proxy, e.g. /favicon.png).
// The root layout is a passthrough, so this boundary must render its own
// <html> and <body>; it sits outside NextIntlClientProvider, hence no i18n.
export default function RootNotFound() {
  return (
    <html lang="nl">
      <body
        style={{
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          color: "#171717",
        }}
      >
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <h1 style={{ fontSize: "2.25rem", marginBottom: "1rem" }}>
            Pagina niet gevonden
          </h1>
          <p style={{ color: "#6b7280", marginBottom: "0.5rem" }}>
            De pagina die je zoekt bestaat niet of is verplaatst.
          </p>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
            The page you are looking for does not exist.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              background: "#2563eb",
              color: "#ffffff",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              textDecoration: "none",
            }}
          >
            Terug naar home / Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
