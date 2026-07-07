import { canWriteToSanity, writeClient } from "@/sanity/writeClient";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
}

function fieldError(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}

/**
 * Contactformulier (artboard 4d): slaat inzendingen op als privé
 * `contactSubmission`-document in Sanity. Geen publieke content.
 */
export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return fieldError("Ongeldige aanvraag.");
  }

  // Honeypot ingevuld → vrijwel zeker een bot; doe alsof het gelukt is.
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const subject = typeof payload.subject === "string" ? payload.subject.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || name.length > 120) return fieldError("Vul je naam in.");
  if (!EMAIL_RE.test(email) || email.length > 200)
    return fieldError("Vul een geldig e-mailadres in.");
  if (!message || message.length > 4000)
    return fieldError("Vertel kort waar we mee kunnen helpen.");
  if (subject.length > 200) return fieldError("Houd het onderwerp kort.");

  if (!canWriteToSanity) {
    console.error(
      "Contactformulier: SANITY_API_WRITE_TOKEN ontbreekt — inzending niet opgeslagen.",
    );
    return fieldError(
      "Het formulier is nog niet gekoppeld. Mail ons direct via info@badmintonborne.nl.",
      503,
    );
  }

  try {
    await writeClient.create({
      _type: "contactSubmission",
      name,
      email,
      subject: subject || undefined,
      message,
      submittedAt: new Date().toISOString(),
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Contact-inzending opslaan mislukt:", error);
    return fieldError("Er ging iets mis bij het versturen.", 500);
  }
}
