#!/usr/bin/env python3
"""Maakt een Editor-token ("frontend-write") aan voor het Badminton Borne-
project en zet die als SANITY_API_WRITE_TOKEN in frontend/.env.local (en in
de root-.env.local als die het veld heeft). Nodig voor het contactformulier
en de nieuwsbrief-opslag.

Draaien vanuit de repo-root:  python3 studio/scripts/create-write-token.py

Gebruikt je Sanity CLI-login (net als setup-sanity.py); print geen secrets.
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
LABEL = "frontend-write"

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


# 1. Project-id: uit studio/.env, anders opzoeken op naam
pid = None
studio_env = REPO / "studio" / ".env"
if studio_env.exists():
    m = re.search(r"^SANITY_STUDIO_PROJECT_ID=(.+)$", studio_env.read_text(), re.M)
    if m:
        pid = m.group(1).strip()
if not pid:
    projects = req("GET", "/projects")
    project = next((p for p in projects if p.get("displayName") == PROJECT_NAME), None)
    if project is None:
        sys.exit(f'Project "{PROJECT_NAME}" niet gevonden — draai eerst setup-sanity.py')
    pid = project["id"]
print(f"− Project: {pid}")

# 2. Editor-token aanmaken (uniek label; bestaande sleutels zijn niet opnieuw
#    opvraagbaar, dus bij een bestaand label nummeren we door)
existing_labels = {t.get("label") for t in req("GET", f"/projects/{pid}/tokens")}
label = LABEL
n = 2
while label in existing_labels:
    label = f"{LABEL}-{n}"
    n += 1
created = req("POST", f"/projects/{pid}/tokens", {"label": label, "roleName": "editor"})
key = created.get("key")
if not key:
    sys.exit("Token aangemaakt maar geen sleutel ontvangen — probeer opnieuw")
print(f"✓ Editor-token '{label}' aangemaakt")


# 3. SANITY_API_WRITE_TOKEN zetten/vervangen in de env-bestanden
def set_env(path: pathlib.Path, name: str, value: str):
    if not path.exists():
        return
    text = path.read_text()
    line = f"{name}={value}"
    if re.search(rf"^{name}=", text, re.M):
        text = re.sub(rf"^{name}=.*$", line, text, count=1, flags=re.M)
    else:
        text = text.rstrip("\n") + f"\n\n{line}\n"
    path.write_text(text)
    print(f"✓ {path.relative_to(REPO)}: {name} bijgewerkt")


set_env(REPO / "frontend" / ".env.local", "SANITY_API_WRITE_TOKEN", key)
root_env = REPO / ".env.local"
if root_env.exists() and "SANITY_API_WRITE_TOKEN" in root_env.read_text():
    set_env(root_env, "SANITY_API_WRITE_TOKEN", key)

print("""
Klaar! Herstart de frontend (npm run dev) zodat de nieuwe token geladen wordt.""")
