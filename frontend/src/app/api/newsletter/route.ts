import { canWriteToSanity, writeClient } from "@/sanity/writeClient";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Nieuwsbrief-aanmelding (artboard 4f). Aanmeldingen gaan naar de maildienst
 * van de club zodra die gekoppeld is (Laposta via LAPOSTA_API_KEY +
 * LAPOSTA_LIST_ID); tot die tijd worden ze bewaard als privé
 * `newsletterSignup`-document in Sanity zodat er niets verloren gaat.
 */
export async function POST(request: Request) {
  let email = "";
  try {
    const payload = (await request.json()) as { email?: unknown };
    email = typeof payload.email === "string" ? payload.email.trim() : "";
  } catch {
    return Response.json({ ok: false, error: "Ongeldige aanvraag." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || email.length > 200) {
    return Response.json(
      { ok: false, error: "Vul een geldig e-mailadres in." },
      { status: 400 },
    );
  }

  const lapostaKey = process.env.LAPOSTA_API_KEY;
  const lapostaList = process.env.LAPOSTA_LIST_ID;

  if (lapostaKey && lapostaList) {
    try {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "127.0.0.1";
      const res = await fetch("https://api.laposta.nl/v2/member", {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${lapostaKey}:`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ list_id: lapostaList, email, ip }),
      });
      // 400 met "member_exists" = al aangemeld → voor de bezoeker gewoon gelukt
      if (res.ok) return Response.json({ ok: true });
      const body = (await res.json().catch(() => null)) as {
        error?: { code?: number; parameter?: string };
      } | null;
      if (res.status === 400 && body?.error?.parameter === "email") {
        return Response.json({ ok: true });
      }
      console.error("Laposta-aanmelding mislukt:", res.status, body);
      return Response.json(
        { ok: false, error: "Aanmelden lukte even niet." },
        { status: 502 },
      );
    } catch (error) {
      console.error("Laposta-aanmelding mislukt:", error);
      return Response.json(
        { ok: false, error: "Aanmelden lukte even niet." },
        { status: 502 },
      );
    }
  }

  if (!canWriteToSanity) {
    console.error(
      "Nieuwsbrief: geen maildienst én geen SANITY_API_WRITE_TOKEN — aanmelding niet opgeslagen.",
    );
    return Response.json(
      { ok: false, error: "De nieuwsbrief is nog niet gekoppeld." },
      { status: 503 },
    );
  }

  try {
    const existing = await writeClient.fetch<string | null>(
      `*[_type == "newsletterSignup" && email == $email][0]._id`,
      { email },
    );
    if (!existing) {
      await writeClient.create({
        _type: "newsletterSignup",
        email,
        submittedAt: new Date().toISOString(),
      });
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Nieuwsbrief-aanmelding opslaan mislukt:", error);
    return Response.json(
      { ok: false, error: "Er ging iets mis bij het aanmelden." },
      { status: 500 },
    );
  }
}
