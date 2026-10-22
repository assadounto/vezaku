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
