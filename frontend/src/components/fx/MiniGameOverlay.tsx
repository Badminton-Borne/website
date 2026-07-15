"use client";

import { useEffect, useRef } from "react";

/**
 * Game-logica van de easter-egg minigame (zie MiniGameZone.tsx voor de
 * wrapper): binnen de zone wordt de cursor een badmintonracket en vliegt er
 * elke 10 seconden een shuttle in een rechte lijn voorbij. Er wordt alleen
 * gescoord als de bezoeker tijdens de vlucht slaat (klikt): raak = punt voor
 * de bezoeker, mis = punt voor de website. Vliegt de shuttle ongemoeid
 * voorbij, dan gebeurt er niets. Alleen desktop/muis; volledig
 * uitgeschakeld bij prefers-reduced-motion. De overlay is pointer-events:none,
 * dus knoppen en links blijven altijd gewoon klikbaar.
 *
 * Bewust een apart, lazy geladen chunk: mobiel downloadt deze code nooit en
 * desktop pas als de browser idle is.
 */

const RACKET_SVG = `<svg width="44" height="96" viewBox="0 0 44 96" xmlns="http://www.w3.org/2000/svg">
<defs><clipPath id="bfxh"><ellipse cx="22" cy="17.5" rx="12" ry="15.5"/></clipPath></defs>
<ellipse cx="22" cy="17.5" rx="13" ry="16.5" fill="rgba(9,18,37,0.55)"/>
<g clip-path="url(#bfxh)" stroke="rgba(255,255,255,0.55)" stroke-width="0.8">
<path d="M8 7h28M8 12h28M8 17h28M8 22h28M8 27h28M12 0v36M17 0v36M22 0v36M27 0v36M32 0v36"/></g>
<ellipse cx="22" cy="17.5" rx="13" ry="16.5" fill="none" stroke="#C2F03C" stroke-width="2.6"/>
<path d="M20 33.5 Q22 37 24 33.5" fill="none" stroke="#C2F03C" stroke-width="2.6"/>
<rect x="20.75" y="35" width="2.5" height="40" rx="1.25" fill="#C2F03C"/>
<rect x="19" y="74" width="6" height="20" rx="3" fill="#EDF1F5"/>
<rect x="19" y="89" width="6" height="5" rx="2.5" fill="#C2F03C"/></svg>`;

const SHUTTLE_SVG = `<svg width="22" height="26" viewBox="0 0 22 26" xmlns="http://www.w3.org/2000/svg">
<path d="M11 11 L4 2 M11 11 L11 1 M11 11 L18 2" stroke="#EDF1F5" stroke-width="2" stroke-linecap="round"/>
<path d="M4 2 Q11 7 18 2" stroke="#EDF1F5" stroke-width="2" fill="none"/>
<circle cx="11" cy="16" r="5" fill="#C2F03C"/></svg>`;

const SPAWN_INTERVAL_MS = 10_000;
const FIRST_SPAWN_MS = 2_500;
const HIT_RADIUS = 55;
const RECT_INFLATE = 28;
const MAX_PATH_TRIES = 40;
const SCORE_KEY = "borne-game-score";

interface Score {
  you: number;
  site: number;
}

function readScore(): Score {
  try {
    const raw = sessionStorage.getItem(SCORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Score>;
      return { you: parsed.you ?? 0, site: parsed.site ?? 0 };
    }
  } catch {
    /* sessionStorage niet beschikbaar */
  }
  return { you: 0, site: 0 };
}

function writeScore(score: Score) {
  try {
    sessionStorage.setItem(SCORE_KEY, JSON.stringify(score));
  } catch {
    /* ignore */
  }
}

export default function MiniGameOverlay({
  zoneRef,
}: {
  zoneRef: React.RefObject<HTMLDivElement | null>;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const racketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const zone = zoneRef.current;
    const overlay = overlayRef.current;
    const racket = racketRef.current;
    if (!zone || !overlay || !racket) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reducedMotion.matches || !finePointer.matches || window.innerWidth < 1024) {
      return;
    }

    zone.classList.add("game-zone");

    const score = readScore();
    let swinging = false;
    let lastX: number | undefined;
    let swayTimeout: ReturnType<typeof setTimeout> | undefined;
    let fly: {
      el: HTMLElement;
      x: number;
      y: number;
      hit: boolean;
      swung: boolean;
    } | null = null;
    let flyRaf = 0;
    let toastTimeouts: ReturnType<typeof setTimeout>[] = [];

    const local = (e: PointerEvent) => {
      const b = zone.getBoundingClientRect();
      return { x: e.clientX - b.left, y: e.clientY - b.top };
    };

    /* ---- Racket-cursor ---------------------------------------------- */
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      racket.style.opacity = "1";
      const dx = lastX === undefined ? 0 : p.x - lastX;
      lastX = p.x;
      if (!swinging) {
        const sway = Math.max(-16, Math.min(16, -dx * 1.4));
        racket.style.transform = `rotate(${sway.toFixed(1)}deg)`;
        clearTimeout(swayTimeout);
        swayTimeout = setTimeout(() => {
          if (!swinging) racket.style.transform = "rotate(0deg)";
        }, 90);
      }
      racket.style.left = `${p.x - 22}px`;
      racket.style.top = `${p.y - 17}px`;
    };

    const onLeave = () => {
      racket.style.opacity = "0";
    };

    /* ---- Verboden zones: shuttlepad mag nooit een knop/link kruisen -- */
    const forbiddenRects = () => {
      const zoneBox = zone.getBoundingClientRect();
      const rects: { x1: number; y1: number; x2: number; y2: number }[] = [];
      const collect = (els: Iterable<Element>) => {
        for (const el of els) {
          const r = el.getBoundingClientRect();
          if (r.bottom < zoneBox.top || r.top > zoneBox.bottom) continue;
          rects.push({
            x1: r.left - zoneBox.left - RECT_INFLATE,
            y1: r.top - zoneBox.top - RECT_INFLATE,
            x2: r.right - zoneBox.left + RECT_INFLATE,
            y2: r.bottom - zoneBox.top + RECT_INFLATE,
          });
        }
      };
      collect(zone.querySelectorAll("a, button, [data-smack]"));
      // De vaste header zweeft boven de herozone: ook diens knoppen mijden.
      const header = document.querySelector("[data-site-header]");
      if (header) collect(header.querySelectorAll("a, button"));
      return rects;
    };

    /* ---- Toast -------------------------------------------------------- */
    const toast = (prefix: string, win: boolean) => {
      overlay.querySelector("[data-game-toast]")?.remove();
      toastTimeouts.forEach(clearTimeout);
      toastTimeouts = [];
      const t = document.createElement("div");
      t.setAttribute("data-game-toast", "");
      t.setAttribute("role", "status");
      t.style.cssText =
        "position:absolute;left:50%;bottom:18px;transform:translateX(-50%) translateY(8px);z-index:70;" +
        "background:#131E36;border:1px solid rgba(255,255,255,0.14);border-radius:999px;padding:10px 20px;" +
        "font-size:14px;font-weight:700;color:#fff;box-shadow:0 10px 30px rgba(6,12,26,0.55);white-space:nowrap;" +
        "opacity:0;transition:opacity 180ms cubic-bezier(0.22,1,0.36,1),transform 180ms cubic-bezier(0.22,1,0.36,1)";
      const label = document.createElement("span");
      label.style.color = win ? "#C2F03C" : "#8A97B0";
      label.textContent = prefix;
      t.append(label, `  Jij ${score.you} — Website ${score.site}`);
      overlay.appendChild(t);
      requestAnimationFrame(() => {
        t.style.opacity = "1";
        t.style.transform = "translateX(-50%) translateY(0)";
      });
      toastTimeouts.push(
        setTimeout(() => {
          t.style.opacity = "0";
          t.style.transform = "translateX(-50%) translateY(8px)";
          toastTimeouts.push(setTimeout(() => t.remove(), 220));
        }, 2400),
      );
    };

    /* ---- Shuttle spawnen ---------------------------------------------- */
    const spawnFly = () => {
      const w = zone.offsetWidth;
      const h = zone.offsetHeight;
      if (!w || !h) return;
      const rects = forbiddenRects();
      let from = { x: -30, y: 30 };
      let to = { x: w + 30, y: 30 };
      let ok = false;
      let tries = 0;
      while (!ok && tries++ < MAX_PATH_TRIES) {
        const mode = Math.random();
        if (mode < 0.4) {
          const ltr = Math.random() < 0.5;
          const y1 = 30 + Math.random() * (h - 60);
          const y2 = Math.max(30, Math.min(h - 30, y1 + (Math.random() - 0.5) * h * 0.5));
          from = { x: ltr ? -30 : w + 30, y: y1 };
          to = { x: ltr ? w + 30 : -30, y: y2 };
        } else if (mode < 0.7) {
          const xa = 30 + Math.random() * (w - 60);
          const xb = Math.max(30, Math.min(w - 30, xa + (Math.random() - 0.5) * w * 0.6));
          from = { x: xa, y: -30 };
          to = { x: xb, y: h + 30 };
        } else {
          const left = Math.random() < 0.5;
          from = { x: 30 + Math.random() * (w - 60), y: -30 };
          to = { x: left ? -30 : w + 30, y: 30 + Math.random() * (h - 60) };
        }
        ok = true;
        for (let s = 0; s <= 30 && ok; s++) {
          const px = from.x + ((to.x - from.x) * s) / 30;
          const py = from.y + ((to.y - from.y) * s) / 30;
          for (const rc of rects) {
            if (px > rc.x1 && px < rc.x2 && py > rc.y1 + 12 && py < rc.y2 + 12) {
              ok = false;
              break;
            }
          }
        }
      }
      if (!ok) {
        from = { x: -30, y: 30 };
        to = { x: w + 30, y: 30 };
      }

      const el = document.createElement("div");
      el.innerHTML = SHUTTLE_SVG;
      el.style.cssText =
        "position:absolute;left:0;top:0;width:22px;height:26px;pointer-events:none;z-index:55";
      overlay.appendChild(el);

      const dur = 700 + Math.random() * 5300;
      const t0 = performance.now();
      const current = { el, x: from.x, y: from.y, hit: false, swung: false };
      fly = current;
      const ang = (Math.atan2(-(to.x - from.x), to.y - from.y) * 180) / Math.PI;

      const step = (now: number) => {
        if (current.hit || !zone.isConnected) return;
        const t = (now - t0) / dur;
        if (t >= 1) {
          fly = null;
          el.remove();
          // Alleen een punt voor de website als de bezoeker wél sloeg maar
          // miste. Vloog de shuttle ongemoeid voorbij: niets aan de hand.
          if (current.swung) {
            score.site++;
            writeScore(score);
            toast("Gemist!", false);
          }
          return;
        }
        current.x = from.x + (to.x - from.x) * t;
        current.y = from.y + (to.y - from.y) * t;
        el.style.left = `${current.x}px`;
        el.style.top = `${current.y}px`;
        el.style.transform = `scale(1.5) rotate(${ang.toFixed(1)}deg)`;
        flyRaf = requestAnimationFrame(step);
      };
      flyRaf = requestAnimationFrame(step);
    };

    const hitFly = (px: number, py: number): boolean => {
      const f = fly;
      if (!f) return false;
      const dx = f.x + 11 - px;
      const dy = f.y + 13 - py;
      if (Math.sqrt(dx * dx + dy * dy) > HIT_RADIUS) return false;
      f.hit = true;
      fly = null;
      score.you++;
      writeScore(score);
      const el = f.el;
      el.animate(
        [
          { transform: "scale(1.5)", opacity: 1 },
          {
            transform: `translate(${Math.random() < 0.5 ? -220 : 220}px,-190px) rotate(300deg) scale(1.2)`,
            opacity: 0,
          },
        ],
        { duration: 550, easing: "cubic-bezier(0.2,0.7,0.3,1)" },
      ).onfinish = () => el.remove();
      toast("Rake smash!", true);
      return true;
    };

    /** Los shuttletje dat wegspat als je op een knop mept. */
    const sprayShuttle = (x: number, y: number) => {
      const s = document.createElement("div");
      s.innerHTML = SHUTTLE_SVG;
      s.style.cssText = `position:absolute;left:${x}px;top:${y - 10}px;pointer-events:none;z-index:55`;
      overlay.appendChild(s);
      s.animate(
        [
          { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
          { transform: "translate(170px,-120px) rotate(220deg)", opacity: 0 },
        ],
        { duration: 620, easing: "cubic-bezier(0.2,0.7,0.3,1)" },
      ).onfinish = () => s.remove();
    };

    const onDown = (e: PointerEvent) => {
      swinging = true;
      racket.style.transform = "rotate(-55deg)";
      setTimeout(() => {
        racket.style.transform = "rotate(0deg)";
      }, 120);
      setTimeout(() => {
        swinging = false;
      }, 240);

      const p = local(e);
      if (hitFly(p.x, p.y)) return;
      // Geslagen maar niet geraakt: onthoud de poging — de website scoort
      // pas als deze shuttle daarna ongeraakt de zone verlaat.
      if (fly) fly.swung = true;

      const target = (e.target as Element | null)?.closest?.("a, button, [data-smack]");
      if (target && zone.contains(target)) {
        target.animate(
          [
            { transform: "none" },
            { transform: "translate(16px,-8px) rotate(3deg)" },
            { transform: "translate(-3px,1px) rotate(-1deg)" },
            { transform: "none" },
          ],
          { duration: 420, easing: "cubic-bezier(0.22,1,0.36,1)" },
        );
        sprayShuttle(p.x, p.y);
      }
    };

    zone.addEventListener("pointermove", onMove);
    zone.addEventListener("pointerleave", onLeave);
    zone.addEventListener("pointerdown", onDown);

    const interval = setInterval(() => {
      if (document.hidden || fly || !zone.isConnected) return;
      spawnFly();
    }, SPAWN_INTERVAL_MS);
    const firstSpawn = setTimeout(() => {
      if (!document.hidden && !fly && zone.isConnected) spawnFly();
    }, FIRST_SPAWN_MS);

    return () => {
      zone.classList.remove("game-zone");
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
      zone.removeEventListener("pointerdown", onDown);
      clearInterval(interval);
      clearTimeout(firstSpawn);
      clearTimeout(swayTimeout);
      toastTimeouts.forEach(clearTimeout);
      cancelAnimationFrame(flyRaf);
      fly?.el.remove();
      overlay.querySelector("[data-game-toast]")?.remove();
    };
  }, [zoneRef]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
    >
      <div
        ref={racketRef}
        className="pointer-events-none absolute left-0 top-0 z-[60] h-24 w-11 opacity-0"
        style={{
          transformOrigin: "22px 90px",
          transition: "transform 110ms cubic-bezier(0.22,1,0.36,1)",
          filter: "drop-shadow(0 6px 14px rgba(6,12,26,0.5))",
        }}
        dangerouslySetInnerHTML={{ __html: RACKET_SVG }}
      />
    </div>
  );
}
