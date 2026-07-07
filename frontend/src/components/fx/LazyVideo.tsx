"use client";

import { useEffect, useRef, useState } from "react";

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

/**
 * Video die pas laadt (en speelt) zodra hij bijna in beeld is, en pauzeert
 * zodra hij uit beeld scrolt. Tot die tijd staat er alleen de poster —
 * scheelt op mobiel de volledige videodownload tijdens de eerste paint.
 */
export function LazyVideo({ src, poster, className = "" }: LazyVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setLoad(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Buiten beeld pauzeren, in beeld (weer) afspelen — bespaart batterij/CPU.
  useEffect(() => {
    if (!load) return;
    const el = wrapperRef.current;
    const video = videoRef.current;
    if (!el || !video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay kan geweigerd worden — poster blijft staan */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [load]);

  return (
    <div ref={wrapperRef} className={className}>
      {load ? (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          className="h-full w-full object-cover"
        />
      ) : poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-gradient-to-b from-navy-700 to-navy-800" />
      )}
    </div>
  );
}
