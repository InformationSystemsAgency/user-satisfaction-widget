# Satisfaction Thumbs Widget

Page-level feedback bar (Yes / No / Report issue) that can be embedded into any website via iframe.

> **Ministry / service-team integration guides:**  
> - Armenian: [GUIDE-thumbs-integration-hy.pdf](./GUIDE-thumbs-integration-hy.pdf) · [`.md`](./GUIDE-thumbs-integration-hy.md)  
> - English: [GUIDE-thumbs-integration-en.pdf](./GUIDE-thumbs-integration-en.pdf) · [`.md`](./GUIDE-thumbs-integration-en.md)

**Production base URL:** `https://nps.services.catalog.isaa.cloud`  
**Widget path:** `/thumbs`  
**API endpoint:** `POST /v1/satisfaction-thumbs/`

---

## Table of contents

1. [Overview](#overview)
2. [How it works](#how-it-works)
3. [Quick start](#quick-start)
4. [URL parameters](#url-parameters)
5. [User flow](#user-flow)
6. [Rating mapping](#rating-mapping)
7. [pageName resolution](#pagename-resolution)
8. [Auto height (`embed.js`)](#auto-height-embedjs)
9. [Languages](#languages)
10. [Local development](#local-development)
11. [Troubleshooting](#troubleshooting)

---

## Overview

Unlike the 5-star score widget (`/`), the thumbs widget measures **page usefulness** on a specific URL inside a service journey.

| Widget | Route | Purpose |
| ------ | ----- | ------- |
| Stars | `/` | Overall service satisfaction (CSAT) |
| Thumbs | `/thumbs` | Per-page feedback bar |

Typical placement: bottom of a page content area (full width).

---

## How it works

```text
┌──────────────────────────── parent site ────────────────────────────┐
│  index.html loads embed.js                                         │
│  Layout renders <iframe id="satisfaction-thumbs" src=".../thumbs"> │
│                                                                    │
│  embed.js                                                          │
│   • answers page URL requests                                      │
│   • syncs pageName into iframe src on SPA navigation              │
│   • resizes iframe height from postMessage                         │
└────────────────────────────────┬───────────────────────────────────┘
                                 │ iframe + postMessage
┌────────────────────────────────▼───────────────────────────────────┐
│  /thumbs widget                                                    │
│   • UI: Yes / No / Report issue → comment → thank-you              │
│   • Resolves pageName (query → parent → referrer)                 │
│   • POST /v1/satisfaction-thumbs/                                  │
│   • Sends satisfaction-thumbs:resize when height changes           │
└────────────────────────────────────────────────────────────────────┘
```

1. Parent page embeds `/thumbs` with `serviceId` (and optional params).
2. `embed.js` keeps `pageName` equal to the parent page URL and resizes the iframe.
3. User clicks a button → widget opens a comment form and submits rating to the NPS API.
4. API stores the score in CMS (`satisfaction_thumbs_scores` / `satisfaction_thumbs_page_scores`).
5. Service name is filled by a Directus flow from the national catalog using `serviceId` (not sent by the widget).

---

## Quick start

### 1. Load `embed.js` once (required)

Add this to the parent app `index.html` (before the app boots):

```html
<!-- Production -->
<script src="https://nps.services.catalog.isaa.cloud/embed.js"></script>

<!-- Local -->
<!-- <script src="http://localhost:3001/embed.js"></script> -->
```

`embed.js` is required for:

- full `pageName` (domain + path) across origins
- iframe auto-height
- SPA route changes (`pushState` / `popstate`)

### 2. Place the iframe

```html
<iframe
  id="satisfaction-thumbs"
  title="satisfaction-thumbs"
  src="https://nps.services.catalog.isaa.cloud/thumbs?lang=hy&serviceId=YOUR_SERVICE_ID&channel=yesem"
></iframe>
```

Notes:

- `id="satisfaction-thumbs"` is required so `embed.js` can find the iframe.
- You do **not** need to set `height` / `width` / `border` manually — `embed.js` applies them.
- Alternative selector: `data-satisfaction-thumbs` on the iframe.

### 3. React / Vue / Angular example

```tsx
<iframe
  id="satisfaction-thumbs"
  title="satisfaction-thumbs"
  src={`https://nps.services.catalog.isaa.cloud/thumbs?lang=${lang}&serviceId=${serviceId}&channel=yesem`}
/>
```

---

## URL parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `serviceId` | **Yes** | UUID from the national service catalog |
| `lang` | No | `hy` (default), `en`, `ru` |
| `channel` | No | Service provision channel (`yesem`, `online`, `app`, …) |
| `institutionId` | No | Institution UUID |
| `transactionId` | No | Case / session identifier |
| `pageName` | No | Full page URL — usually filled by `embed.js` |
| `pageUrl` | No | Alias of `pageName` |

Example:

```text
https://nps.services.catalog.isaa.cloud/thumbs?lang=hy&serviceId=035ccf9e-696b-4926-95ab-c28bcc7e777d&channel=yesem
```

---

## User flow

1. **Initial bar** — “Was this page helpful?” with **Yes**, **No**, and **Report an issue**.
2. **Comment** — after a click, comment textarea + Cancel / Submit.
3. **Thank you** — confirmation message after submit.

Cancel returns to the initial bar.

---

## Rating mapping

| User action | `rating` sent to API |
| ----------- | -------------------- |
| Yes 👍 | `5` |
| No 👎 | `1` |
| Report an issue | `null` |

Request body also includes:

- `comment`
- `commentSubmitted` (`true` after final submit)
- `pageName`
- `pageLanguage`
- `userAgent`
- `serviceProvisionChannel` / `institutionId` / `transactionId` when provided
- `id` — page row id returned as `pageId` (used for subsequent updates on the same page)

---

## pageName resolution

The widget resolves `pageName` in this order:

1. `pageName` or `pageUrl` query param (if it is a full URL with path)
2. Parent `postMessage` response (`satisfaction-thumbs:get-page-url` → `satisfaction-thumbs:page-url`)
3. `document.referrer` (only when path is present)
4. Widget’s own `window.location.href` (fallback)

Cross-origin iframes often expose only the parent **origin** in `document.referrer` (path is stripped). That is why `embed.js` is required — it sends the full `window.location.href`.

Expected CMS value example:

```text
http://localhost:5173/babyfirststeps/polyclinic/choose-doctor
```

Not:

```text
http://localhost:5173
```

---

## Auto height (`embed.js`)

Browser default iframe height is **150px**. The bar is shorter, so without resize you see empty space under the bar.

### Message types

| Type | Direction | Purpose |
| ---- | --------- | ------- |
| `satisfaction-thumbs:resize` | widget → parent | `{ height: number }` set iframe height |
| `satisfaction-thumbs:request-resize` | parent → widget | ask widget to re-send height |
| `satisfaction-thumbs:get-page-url` | widget → parent | ask for current page URL |
| `satisfaction-thumbs:page-url` | parent → widget | `{ url: string }` |

`embed.js` also:

- sets `display: block`, `width: 100%`, `border: 0`, `overflow: hidden`
- syncs `pageName` into the iframe `src` on SPA navigation

---

## Languages

Controlled by `lang` query param:

| `lang` | UI language |
| ------ | ----------- |
| `hy` | Armenian (default) |
| `en` | English |
| `ru` | Russian |

---

## Local development

| Service | URL |
| ------- | --- |
| Widget | `http://localhost:3001/thumbs` |
| API | from `NUXT_PUBLIC_API_URL` in `.env` |
| Embed script | `http://localhost:3001/embed.js` |

Example parent iframe:

```html
<script src="http://localhost:3001/embed.js"></script>

<iframe
  id="satisfaction-thumbs"
  title="satisfaction-thumbs"
  src="http://localhost:3001/thumbs?lang=hy&serviceId=YOUR_SERVICE_ID&channel=yesem"
></iframe>
```

---

## Troubleshooting

### Empty space under the bar

- Confirm `embed.js` is loaded on the parent page.
- Confirm iframe `id="satisfaction-thumbs"`.
- In DevTools, check that iframe computed `height` is ~content height (not `150px`).

### `pageName` is only the origin (`http://localhost:5173`)

- `embed.js` is missing, or SPA navigation is not updating `pageName`.
- Prefer letting `embed.js` manage `pageName`; do not rely on `document.referrer` alone.

### Data not appearing in CMS

- Check `serviceId` is a valid catalog UUID.
- Check API URL / network `POST /v1/satisfaction-thumbs/` response.
- Local widget writes to local API/CMS; production widget writes to production CMS.

### Height does not grow after click

- `embed.js` must listen for `satisfaction-thumbs:resize`.
- Ensure no host CSS forces a fixed iframe height that overrides inline styles.

---

## Related files

| File | Role |
| ---- | ---- |
| `app/pages/thumbs.vue` | Route wrapper |
| `app/components/satisfaction-thumbs/SatisfactionThumbs.vue` | UI |
| `app/composables/useThumbsFeedback.ts` | API + `pageName` logic |
| `app/composables/useIframeAutoHeight.ts` | Resize `postMessage` |
| `public/embed.js` | Parent-side helper (required) |

For the 5-star score widget integration, see the main [README.md](./README.md).
