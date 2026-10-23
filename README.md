# VEZAKU

**Learn. Build. Create.**

A Next.js 15 responsive front-end for VEZAKU, a proposed marketplace for practical courses, engineering projects and digital products.

## Run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

## Included
- Responsive violet-and-midnight homepage and navigation
- Online course previews, project section and digital-resource cards
- Original SVG illustrations in `public/images/`
- Keyboard-accessible links and reduced-motion styling

## Status
**Front-end prototype only.** Listings, prices and descriptions are illustrative sample content. No purchases, authentication, course video player, enrolment, creator uploads or protected downloads yet. Ratings are illustrative placeholders, not real reviews.

## Next steps
Integrate Xonbay storefront product and order APIs where appropriate. Build separate lesson access, enrollment, course progress, creator publishing and protected-download entitlement controls before accepting real purchases.

## Optional cinematic homepage hero video

The homepage now uses a rich violet hero with its existing SVG illustration by default. To enable a background video, place an optimized, silent MP4 at `public/videos/vezaku-hero.mp4` and set `NEXT_PUBLIC_VEZAKU_HERO_VIDEO_URL=/videos/vezaku-hero.mp4` in `.env.local` (or the production environment). The video is muted, loops, plays inline and is behind a contrast overlay; users preferring reduced motion see a still background. Without that environment variable, no video is requested. This repository does not yet include an actual MP4. Prefer short, compressed, cinematic footage without text overlays.

## Shared Xonbay accounts and student dashboard

VEZAKU reuses existing Xonbay Rails API accounts; it does not create its own user database. Implemented `/login`, `/signup`, `/dashboard`, `/dashboard/learning`, `/dashboard/projects` and `/dashboard/library`. The Next.js authentication handlers call `POST /v1/users/login`, `POST /v1/users/signup`, and `DELETE /v1/users/logout`, storing the access token in an HttpOnly SameSite=Lax cookie scoped to VEZAKU. Server-rendered dashboard pages call `GET /v1/digital_purchases` and `GET /v1/digital_downloads` using that token. Configure `XONBAY_API_URL=https://api.xonbay.com` as a **server-side** environment variable when deploying.

**Integration limits:** These pages use the same Xonbay identity but are not yet cross-domain SSO; an existing login at account.xonbay.com does not automatically establish a VEZAKU session. The projects page is a placeholder until type-specific entitlements and access links are integrated. Course player, lesson completion and protected file-download actions are not connected yet. This is not a replacement for authentication review or production testing. Never expose Xonbay bearer tokens to browser JavaScript or public environment variables.

## VEZAKU official shop source

The Xonbay backend `dev` branch includes `bin/rails vezaku:seed`. After an operator runs that task on the intended database, copy the emitted shop ID to the VEZAKU server environment:

```env
XONBAY_API_URL=https://api.xonbay.com
VEZAKU_SHOP_ID=<shop_id_from_seed_output>
```

The helper `lib/vezaku-digital-listings.ts` requests `/v1/public_digital_listings?shop_id=<id>` and rechecks the response belongs to subdomain `vezaku`. It returns no listings if the shop ID is absent, rather than accidentally displaying other shops. **Integrated:** the homepage featured listings, `/courses`, `/projects`, `/products`, and matching detail pages now use the filtered public Xonbay listings. No sample listings are shown as live inventory. Project guides (articles) appear under Projects, while download/bundle listings appear under Digital Products. Listings use Xonbay public IDs as detail-page slugs. The API currently serves its default first page (20 results); pagination is a future enhancement. Payments and protected course playback are not connected in this phase.
