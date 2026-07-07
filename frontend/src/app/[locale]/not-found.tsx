import { getLocale } from "next-intl/server";
import { MiniGameZone } from "@/components/fx/MiniGameZone";
import { BrandButton } from "@/components/ui/BrandButton";

/**
 * 404 "Verloren rally" (design 6d): statische pagina met het racket-cursor-
 * spel eroverheen. MiniGameZone laadt de game alleen op desktop met muis,
 * bij idle, en nooit bij prefers-reduced-motion — zonder JS blijft de
 * pagina gewoon leesbaar. Copy is bewust hardcoded NL (zie handoff).
 */
export default async function NotFound() {
  const locale = await getLocale();

  return (
    <MiniGameZone className="bg-navy-950">
      <div className="flex min-h-[calc(100svh-var(--header-h))] flex-col items-center justify-center gap-5 px-5 pb-20 pt-[calc(var(--header-h)+80px)] text-center lg:gap-[26px] lg:px-20 lg:pb-[130px] lg:pt-[calc(var(--header-h)+110px)]">
        <p
          aria-hidden="true"
          className="font-display text-[72px] font-black leading-none tracking-tight text-lime-400 lg:text-[110px]"
        >
          404
        </p>
        <h1 className="font-display text-[30px] font-extrabold uppercase leading-[1.05] tracking-tight text-white lg:text-[40px]">
          Deze rally is verloren
        </h1>
        <p className="max-w-[48ch] text-base leading-[1.65] text-navy-300 lg:text-lg">
          De pagina die je zocht is uit beeld geslagen. Sla ondertussen gerust
          een shuttle terug — of speel verder op de homepage.
        </p>
        <div className="flex w-full flex-col justify-center gap-3.5 sm:w-auto sm:flex-row">
          <BrandButton href={`/${locale}`} variant="primary" size="lg">
            Naar de homepage
          </BrandButton>
          <BrandButton
            href={`/${locale}/probeer-gratis`}
            variant="outline-light"
            size="lg"
          >
            Plan je eerste bezoek
          </BrandButton>
        </div>
        <p className="hidden text-[13px] text-navy-300 motion-reduce:hidden pointer-fine:block">
          Beweeg je muis — elke paar seconden vliegt er een shuttle voorbij.
        </p>
      </div>
    </MiniGameZone>
  );
}
