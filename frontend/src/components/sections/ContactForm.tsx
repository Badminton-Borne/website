"use client";

import { useState } from "react";
import { BrandButton } from "@/components/ui/BrandButton";

const INPUT_CLASSES =
  "w-full rounded-xl border border-white/16 bg-navy-900 px-4 py-3.5 text-[15px] leading-normal text-white placeholder:text-navy-400 transition-[border-color,box-shadow] duration-200 focus:border-lime-400 focus:shadow-[0_0_0_4px_rgba(194,240,60,0.18)] focus-visible:shadow-[0_0_0_4px_rgba(194,240,60,0.18)] focus-visible:outline-none";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold text-white">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-[13px] font-semibold text-pink-400">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Formulierkaart van de contactsectie (artboard 4d). Client-side validatie
 * (naam, e-mail, bericht verplicht; foutkleur pink conform design system),
 * versturen via POST /api/contact, succes-state in de kaart.
 */
export function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // honeypot — mensen laten dit leeg
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );

  function set(field: keyof typeof values) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    };
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = "Vul je naam in.";
    if (!values.email.trim()) next.email = "Vul je e-mailadres in.";
    else if (!EMAIL_RE.test(values.email.trim()))
      next.email = "Dat lijkt geen geldig e-mailadres.";
    if (!values.message.trim()) next.message = "Vertel kort waar we mee kunnen helpen.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`contact api: ${res.status}`);
      setStatus("success");
    } catch (error) {
      console.error("Contactformulier versturen mislukt:", error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-[20px] border border-white/10 bg-navy-800 p-10 text-center"
        role="status"
      >
        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-400 text-xl font-extrabold text-navy-900"
        >
          ✓
        </span>
        <p className="font-display text-xl font-extrabold uppercase tracking-tight text-white">
          Bedankt!
        </p>
        <p className="max-w-[36ch] text-[15px] leading-relaxed text-navy-300">
          We reageren meestal binnen een dag. 🏸
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-[20px] border border-white/10 bg-navy-800 p-6 lg:p-10"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="contact-name" label="Naam" error={errors.name}>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Je naam"
            value={values.name}
            onChange={set("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={`${INPUT_CLASSES} ${errors.name ? "border-pink-500" : ""}`}
          />
        </Field>
        <Field id="contact-email" label="E-mail" error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jij@voorbeeld.nl"
            value={values.email}
            onChange={set("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={`${INPUT_CLASSES} ${errors.email ? "border-pink-500" : ""}`}
          />
        </Field>
      </div>
      <Field id="contact-subject" label="Onderwerp">
        <input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder="Bijv. proefles, jeugd, competitie"
          value={values.subject}
          onChange={set("subject")}
          className={INPUT_CLASSES}
        />
      </Field>
      <Field id="contact-message" label="Bericht" error={errors.message}>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Waar kunnen we je mee helpen?"
          value={values.message}
          onChange={set("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`${INPUT_CLASSES} resize-y ${errors.message ? "border-pink-500" : ""}`}
        />
      </Field>
      {/* Honeypot tegen spam-bots; visueel en voor schermlezers verborgen */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={set("website")}
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <BrandButton type="submit" variant="primary" size="lg" fullWidth>
          {status === "submitting" ? "Versturen…" : "Verstuur bericht"}
        </BrandButton>
        {status === "error" && (
          <p className="text-center text-[13px] font-semibold text-pink-400" role="alert">
            Versturen lukte even niet. Probeer het opnieuw of mail ons direct.
          </p>
        )}
        <p className="text-center text-[13px] text-navy-400">
          We gebruiken je gegevens alleen om te reageren.
        </p>
      </div>
    </form>
  );
}
