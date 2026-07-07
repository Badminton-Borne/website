#!/usr/bin/env python3
"""Voegt CORS-origins toe aan het Sanity-project, zodat de browser-kant van
de site (live content-verversing) met Sanity mag praten.

Draaien vanuit de repo-root, bv.:
  python3 studio/scripts/add-cors.py https://badminton-borne.vercel.app https://badmintonborne.nl

Gebruikt je Sanity CLI-login (administratie@badmintonborne.nl); idempotent.
"""
import json
import pathlib
import re
import sys
import urllib.error
import urllib.request

CFG = pathlib.Path.home() / ".config/sanity/config.json"
API = "https://api.sanity.io/v2021-06-07"
REPO = pathlib.Path(__file__).resolve().parents[2]

origins = sys.argv[1:]
if not origins:
    sys.exit("Gebruik: python3 studio/scripts/add-cors.py <origin> [origin …]")
for origin in origins:
    if not re.match(r"^https?://[^/]+$", origin):
        sys.exit(f"Ongeldige origin (verwacht bv. https://voorbeeld.nl, zonder pad): {origin}")

if not CFG.exists():
    sys.exit("Geen Sanity CLI-login gevonden. Draai eerst: npx sanity login")
token = json.loads(CFG.read_text()).get("authToken")
if not token:
    sys.exit("Geen authToken in de Sanity CLI-config. Draai eerst: npx sanity login")


def req(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(
        API + path,
        data=data,
        method=method,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(r) as resp:
            return json.loads(resp.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        raise SystemExit(f"HTTP {e.code} bij {method} {path}: {e.read().decode()[:500]}")


studio_env = (REPO / "studio" / ".env").read_text()
pid = re.search(r"^SANITY_STUDIO_PROJECT_ID=(.+)$", studio_env, re.M).group(1).strip()
print(f"− Project: {pid}")

existing = {c.get("origin") for c in req("GET", f"/projects/{pid}/cors")}
for origin in origins:
    if origin in existing:
        print(f"− CORS bestond al: {origin}")
    else:
        req("POST", f"/projects/{pid}/cors", {"origin": origin, "allowCredentials": True})
        print(f"✓ CORS toegevoegd: {origin}")
