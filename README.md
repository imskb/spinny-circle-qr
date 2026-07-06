# Spinny Circle — Smart App Download QR

One QR code that detects the visitor's device and sends them to the right store:

- **Android** → Google Play
- **iPhone / iPad** → App Store
- **Desktop / anything else** → a page with both buttons

`index.html` is the whole app — a single self-contained page, no build step, no dependencies.

---

## Why not host on Bitbucket directly?

Bitbucket **cannot serve a live web page** (its static hosting was discontinued in 2020, and
raw file URLs return `text/plain`, so the browser shows the source instead of running the
redirect). So we keep the **source in Bitbucket** and let **Cloudflare Pages** serve it — free,
unlimited requests, no expiry.

---

## Step 1 — Create your Bitbucket repo & push

```bash
cd ~/spinny-circle-qr
git init
git add .
git commit -m "Spinny Circle smart download redirect"

# Create an EMPTY repo in Bitbucket UI first (e.g. spinny-circle-qr), then:
git remote add origin https://bitbucket.org/<your-workspace>/spinny-circle-qr.git
git branch -M main
git push -u origin main
```

## Step 2 — Serve it free & unlimited with Cloudflare Pages

1. Go to **https://dash.cloudflare.com** → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → choose **Bitbucket** and authorize.
2. Pick the `spinny-circle-qr` repo.
3. Build settings: **Framework preset = None**, **Build command = (leave empty)**,
   **Build output directory = `/`**. Deploy.
4. You get a permanent URL like `https://spinny-circle-qr.pages.dev`.

> Alternative (no Cloudflare): drag this folder onto **https://app.netlify.com/drop** for an
> instant free URL, or use **GitHub Pages** if you'd rather host on GitHub.

## Step 3 — Generate the QR (static, never expires)

```bash
cd ~/spinny-circle-qr
uv run gen_qr.py "https://spinny-circle-qr.pages.dev"
# -> writes spinny-circle-qr.png
```

Because the QR encodes a **stable URL** (not a dynamic redirect service), it has **no scan
limit and no expiry** — print it on standees, badges, banners, anything.

## Step 4 — Test before printing

Scan with **both** an Android phone and an iPhone. Each should land on the correct store.

---

## Editing later

Change the store links in `index.html` (top of the `<script>` block), commit, push — Cloudflare
redeploys automatically. **The QR does not change** (same URL), so already-printed codes keep working.

Store links:
- App Store: `https://apps.apple.com/in/app/spinny-circle/id6755675833`
- Google Play: `https://play.google.com/store/apps/details?id=com.spinny.circle.prod`
