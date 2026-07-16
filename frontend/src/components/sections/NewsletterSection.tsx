"use client";

import { useState } from "react";
import { BrandButton } from "@/components/ui/BrandButton";
import { Reveal } from "@/components/fx/Reveal";
import type { NewsletterSection as NewsletterData } from "@/sanity/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Nieuwsbrief-band (artboard 4f, onder): vol lime, e-mailveld + navy knop.
 * Aanmelden via POST /api/newsletter met inline succes/fout-state.
 */
export function NewsletterSection({ section }: { section: NewsletterData }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("Vul een geldig e-mailadres in.");
      return;
    }
    setError(null);
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error(`newsletter api: ${res.status}`);
      setStatus("success");
    } catch (err) {
      console.error("Nieuwsbrief-aanmelding mislukt:", err);
      setStatus("error");
    }
  }

  return (
    <section className="bg-lime-400 py-14 lg:py-[72px]">
      <div className="mx-auto grid max-w-[1280px] items-center gap-8 px-5 lg:grid-cols-[1.2fr_1fr] lg:gap-14 lg:px-20">
        <Reveal className="flex flex-col gap-3">
          <h2 className="font-display text-[32px] font-black uppercase leading-[1.05] tracking-tight text-navy-900 lg:text-[40px]">
            {section.heading}
          </h2>
          {section.body && (
            <p className="text-base font-semibold leading-relaxed text-navy-900">
              {section.body}
            </p>
          )}
        </Reveal>

        <Reveal delay={90} className="flex flex-col gap-2.5">
          {status === "success" ? (
            <p
              className="text-base font-bold text-navy-900"
              role="status"
            >
              Je staat op de lijst — tot in je inbox! 🏸
            </p>
          ) : (
            <>
              <form
                onSubmit={onSubmit}
                noValidate
                className="flex flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  E-mailadres
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jij@voorbeeld.nl"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  aria-invalid={Boolean(error)}
                  className="flex-1 rounded-full border border-[rgba(9,18,37,0.15)] bg-white px-[22px] py-3.5 text-[15px] text-navy-900 placeholder:text-navy-400 transition-[border-color,box-shadow] duration-200 focus:border-navy-900 focus:shadow-[0_0_0_4px_rgba(9,18,37,0.12)] focus-visible:shadow-[0_0_0_4px_rgba(9,18,37,0.12)] focus-visible:outline-none"
                />
                <BrandButton type="submit" variant="secondary" size="md">
                  {status === "submitting"
                    ? "Even geduld…"
                    : section.buttonLabel || "Aanmelden"}
                </BrandButton>
              </form>
              {error && (
                <p className="text-[13px] font-bold text-pink-600" role="alert">
                  {error}
                </p>
              )}
              {status === "error" && (
                <p className="text-[13px] font-bold text-pink-600" role="alert">
                  Aanmelden lukte even niet — probeer het later opnieuw.
                </p>
              )}
              {section.note && (
                <p className="text-[13px] font-semibold text-navy-900">
                  {section.note}
                </p>
              )}
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}
