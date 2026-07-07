import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <article className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-lg text-muted mb-8">{t("description")}</p>
      <Link
        href="/"
        className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
      >
        {t("backHome")}
      </Link>
    </article>
  );
}
