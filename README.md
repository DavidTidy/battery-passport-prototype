# Brompton Electric battery passport: prototype

A clickable proof of concept for the EU Batteries Regulation (EU) 2023/1542 battery passport. It works on mobile and desktop and uses **dummy data only**.

The page reuses the brompton.com *Why Brompton* page shell: trust strip, header, mega-menu navigation (with a mobile drawer) and the hero banner, retitled **Digital Product Passport**. Everything else from that page is removed, and the passport journeys sit under the banner. A "Battery passport · New" link is added under *Electric Bikes → Useful links* to show where the entry point could live.

## Journeys covered

| Journey | Entry point | Device |
|---|---|---|
| Scan QR → public passport | QR code on the battery (simulated with a button) | Mobile first |
| Serial lookup → public passport | Serial number form, including the not-found state | Desktop |
| Restricted tier sign-in | Sign in with role: repairer, second-life operator, recycler or authority | Both |
| Restricted passport view | Sections unlock by role. *Test reports* stay locked for everyone except authorities | Both |

Routes are hash based, so the site works on GitHub Pages with no server config: `#start`, `#passport`, `#signin`, `#restricted`.

## Files

```
index.html          page shell: trust strip, header, drawer, hero, app container
assets/site.js      navigation data, mega menu, mobile drawer, trust strip rotation
assets/site.css     site chrome and hero styles
assets/data.js      all passport content and access rules. Edit this to change fields
assets/app.js       router, rendering, sign-in logic (no framework, no build)
assets/styles.css   mobile-first styles, light and dark mode
assets/qrcode.js    QR generator (qrcode-generator 1.4.4, MIT)
.nojekyll           tells GitHub Pages to serve files as they are
```

To change what a section shows, edit `assets/data.js`. Each restricted section has a `roles` list that controls who can see it.

## Brand assets and links

- The logo and hero image load from `www.brompton.com` and `dam.brompton.com`. If either is blocked (hotlink protection on Cloudflare, say), the logo falls back to a text wordmark and the hero to a dark background. For a sturdier demo, copy the logo SVG and a hero image into `assets/` and update the two `src` values in `index.html`.
- Fonts are stand-ins (Archivo and IBM Plex). Swap in the brand fonts and colours from the Alokai theme if you want a closer match.
- Menu links point at live brompton.com pages, captured on 8 October 2026. The account (`/account`) and cart (`/cart`) URLs are guesses, so check them.

## Publish on GitHub Pages

1. Create a new repository on GitHub, for example `battery-passport-prototype`.
2. Upload these files to it, keeping the folder structure. You can drag and drop them on **Add file → Upload files**, or use git:
   ```bash
   git init
   git add .
   git commit -m "Battery passport prototype"
   git branch -M main
   git remote add origin https://github.com/OWNER/battery-passport-prototype.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, then **main** and **/ (root)**, and click **Save**.
4. After a minute or so, the site is live at `https://OWNER.github.io/battery-passport-prototype/`.
5. Open that URL on desktop. The QR code on the start page then points to the live passport, so you can scan it with a phone.

**Private vs public:** on a free GitHub plan, Pages only works for **public** repos. On GitHub Team or Enterprise you can publish Pages from a private repo, but the site itself is still public. Only Enterprise Cloud can restrict the site to organisation members. The data is dummy, but the page now looks like brompton.com, so treat the URL with care: it is set to `noindex` and carries a prototype notice, so keep both. If you'd rather it isn't publicly reachable at all, host it behind Cloudflare Access or on an internal environment instead. Don't commit real serials, supplier names or test reports.

## Open questions to settle before a real build

- Who is the economic operator for EU-placed batteries: Brompton, an EU importer or an authorised representative?
- Which DPP provider hosts the passport record and how are restricted-tier users verified? Role selection here is for demo purposes only.
- Final Annex XIII field list and the carbon footprint class scheme, once delegated acts are confirmed.
- Whether the PDP or account area should link to the passport (optional, not mandated).
