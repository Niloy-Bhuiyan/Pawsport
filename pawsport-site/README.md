# Pawsport website

Next.js 16 (App Router), React 19, TypeScript. Deploys to Vercel with no extra setup.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

On Vercel: import the repo, add `NEXT_PUBLIC_SITE_URL`, deploy.

## What is in it

| URL | Page |
|---|---|
| `/` | Home (departure board, flight, Biscuit in the suitcase) |
| `/destinations` `/plan-builder` `/how-it-works` `/pricing` | Core pages |
| `/for-teams` `/partners` `/resources` `/portal` `/contact` | Audience pages, portal, contact hub |
| `/start` | Full pet passport (13 pages) |
| `/start/quick` `/start/documents` `/arrival` | Quick stamp, document upload, arrival card |
| `/for-teams/demo` `/partners/apply` | Company demo request, partner application |
| `/privacy` `/terms` | Draft legal pages. Have a lawyer review before launch |

The Biscuit chat widget is on every page. `sitemap.xml`, `robots.txt`, page titles, descriptions and an icon are set.

## How it is built

- `src/gen/*.tsx` are the pages, one phone layout (`M`) and one desktop layout (`D`) each. They were generated from the approved designs by `tools/convert.mjs` (templates in `gen-in/`). You can edit them directly.
- `src/lib/dc.tsx` holds the small state helper and the link component. `src/lib/routes.ts` maps page names to URLs.
- The desktop layout is drawn at 1440px and the phone layout at 390px. `PageSwitch` picks one by screen width (under 820px is phone) and scales it to fit. The server picks a first guess from the device so there is no flash.
- Fonts (Fraunces, Figtree, DM Mono) are self-hosted in `public/fonts`.

## Still to connect (front end only for now)

1. **Forms.** All seven forms validate and finish, but nothing is sent anywhere yet. Add an API route per form (`src/app/api/...`) and forward to your GoHighLevel webhook URLs from env vars.
2. **Chat.** Replies are scripted keyword answers in each page's `chReply`. Swap in your GoHighLevel chat or an AI endpoint. Keep the rules: coordinate only, no vet or legal advice, no border approval promise.
3. **Portal, checkout, prices.** The portal and payment steps are prototypes. Prices and names are samples.
4. **Legal text, article pages, real contact details.** Resource cards do not open articles yet.
5. Set the real domain in `NEXT_PUBLIC_SITE_URL`.
