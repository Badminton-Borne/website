#!/usr/bin/env python3
"""Eenmalige setup: maakt het Sanity-project "Badminton Borne" aan in jouw
account (je bent al ingelogd via de Sanity CLI), plus dataset, CORS-origins
en een read-token voor de frontend. Schrijft de env-bestanden.

Draaien vanuit de repo-root:  python3 studio/scripts/setup-sanity.py

Het script is idempotent: bestaande onderdelen worden hergebruikt, en er
worden geen secrets geprint.
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
PROJECT_NAME = "Badminton Borne"

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
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(r) as resp:
            return json.loads(resp.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        raise SystemExit(f"HTTP {e.code} bij {method} {path}: {e.read().decode()[:500]}")


# 1. Project (hergebruik als het al bestaat)
projects = req("GET", "/projects")
project = next((p for p in projects if p.get("displayName") == PROJECT_NAME), None)
if project is None:
    project = req("POST", "/projects", {"displayName": PROJECT_NAME})
    print(f"✓ Project aangemaakt: {project['id']}")
else:
    print(f"− Project bestond al: {project['id']}")
pid = project["id"]

# 2. Dataset "production" (publiek leesbaar voor gepubliceerde content,
#    zoals standaard bij Sanity-websites)
datasets = req("GET", f"/projects/{pid}/datasets")
if not any(d.get("name") == "production" for d in datasets):
    req("PUT", f"/projects/{pid}/datasets/production", {"aclMode": "public"})
    print("✓ Dataset production aangemaakt")
else:
    print("− Dataset production bestond al")

# 3. CORS voor de lokale studio en frontend
existing = {c.get("origin") for c in req("GET", f"/projects/{pid}/cors")}
for origin in ("http://localhost:3333", "http://localhost:3000"):
    if origin not in existing:
        req("POST", f"/projects/{pid}/cors", {"origin": origin, "allowCredentials": True})
        print(f"✓ CORS toegevoegd: {origin}")

# 4. Read-token voor de frontend (rol: viewer)
tokens = req("GET", f"/projects/{pid}/tokens")
read_key = None
if not any(t.get("label") == "frontend-read" for t in tokens):
    created = req("POST", f"/projects/{pid}/tokens", {"label": "frontend-read", "roleName": "viewer"})
    read_key = created.get("key")
    print("✓ Read-token 'frontend-read' aangemaakt")
else:
    print("− Token 'frontend-read' bestond al (sleutel is niet opnieuw opvraagbaar)")

# 5. Env-bestanden bijwerken: ontbrekende regels toevoegen, afwijkende
#    waarden vervangen (belangrijk bij verhuizen naar een ander project),
#    None-waarden overslaan (bv. read-token die al bestond).
def set_env(path: pathlib.Path, entries: dict, replace_only: bool = False):
    text = path.read_text() if path.exists() else ""
    changed = []
    for k, v in entries.items():
        if v is None:
            continue
        line = f"{k}={v}"
        pattern = re.compile(rf"^{re.escape(k)}=.*$", re.M)
        m = pattern.search(text)
        if m:
            if m.group(0) != line:
                text = pattern.sub(line.replace("\\", r"\\"), text, count=1)
                changed.append(k)
        elif not replace_only:
            text = (text.rstrip("\n") + "\n" + line + "\n") if text else line + "\n"
            changed.append(k)
    if changed:
        path.write_text(text)
        print(f"✓ {path.relative_to(REPO)} bijgewerkt: {', '.join(changed)}")
    else:
        print(f"− {path.relative_to(REPO)} was al up-to-date")


set_env(REPO / "studio" / ".env", {
    "SANITY_STUDIO_PROJECT_ID": pid,
    "SANITY_STUDIO_DATASET": "production",
})
set_env(REPO / "frontend" / ".env.local", {
    "NEXT_PUBLIC_SANITY_PROJECT_ID": pid,
    "NEXT_PUBLIC_SANITY_DATASET": "production",
    "SANITY_API_READ_TOKEN": read_key,
})
# Root-.env.local (als die bestaat) in sync houden voor dezelfde sleutels
set_env(REPO / ".env.local", {
    "NEXT_PUBLIC_SANITY_PROJECT_ID": pid,
    "SANITY_API_READ_TOKEN": read_key,
    "SANITY_STUDIO_PROJECT_ID": pid,
}, replace_only=True)

print(f"""
Klaar! Vervolgstappen:
  1. cd studio && npm run seed     # content uit het design inladen
  2. cd studio && npm run dev      # Studio op http://localhost:3333
  3. cd frontend && npm run dev    # site op http://localhost:3000
Beheer: https://www.sanity.io/manage/project/{pid}
""")
