import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - API routes (/api/...)
    // - Next.js internals (_next/...)
    // - Static files (favicon.ico, images, etc.)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
