# Bloom — Product Brief

## What is Bloom?

Bloom is a branded content creation tool for beauty and PMU (permanent makeup) business owners. It allows users to build a brand kit once, upload their own photos, and create on-brand Instagram and Facebook carousel posts — with a real-time canvas editor for fine-tuning each slide before export.

The core value proposition: a beauty business owner should be able to go from a folder of photos to a publish-ready, on-brand Instagram carousel in under 10 minutes — without touching Canva, without hiring a designer, and without losing their brand identity.

---

## Target User

- Beauty salon owners, PMU artists, aesthetics practitioners
- Sole traders and small teams
- Non-technical users who are confident on Instagram but not in design tools
- Primary test case: Cambridge Brow Sanctuary (PMU business)

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database + Auth + Storage | Supabase |
| Canvas Editor | Konva.js / react-konva |
| Font Library | Google Fonts API |
| Hosting | Vercel |
| Version Control | GitHub |
| DNS | Cloudflare |

---

## Design Language

Bloom's UI should feel like the content it helps create: elevated, editorial, beauty-industry native. Reference aesthetic: @thehiddenbeautyrooms and @maeegency on Instagram.

- **Palette:** Deep near-black (`#1A1A1A`), warm off-white (`#FAF8F5`), muted rose-gold accent (`#C9A96E`)
- **Typography:** Serif display (Cormorant Garamond or Playfair Display) paired with clean sans-serif UI (Inter)
- **Tone:** Confident, minimal, premium — never cluttered
- **Layout:** Generous whitespace, clear hierarchy, no unnecessary decoration
- **Components:** Rounded cards, soft shadows, smooth transitions — slick and intentional

---

## Core Features — V1 Scope

### Epic 1: Brand Kit

The brand kit is set up once and applied automatically to every post.

**User Stories:**
- As a user, I want to upload my logo so it appears consistently on every image I create
- As a user, I want to select my display font (H1) and subheading font (H2) from Google Fonts so my posts match my brand typography
- As a user, I want to select a body/carousel font (H3) for carousel slide text
- As a user, I want to pick my brand colours (primary, secondary, accent) using a colour picker
- As a user, I want to set a default overlay colour and opacity so my text is always readable over photos
- As a user, I want to choose my default text position using a 3x3 grid selector (top-left, top-centre, top-right, middle-left, centre, middle-right, bottom-left, bottom-centre, bottom-right)
- As a user, I want to save my brand kit so it is automatically applied every time I create a new post

**Brand Kit Fields:**
- Logo upload (PNG with transparency preferred)
- H1 font + size + colour
- H2 font + size + colour (italic/script variant)
- H3 font + size + colour (carousel body text)
- Primary brand colour
- Secondary brand colour
- Accent colour
- Default overlay colour + opacity (0–100%)
- Default text position (3x3 grid)
- Handle/watermark text (e.g. @cambridgebrowsanctuary) — auto-placed bottom centre
- Logo position (top-left, top-right, bottom-left, bottom-right)

---

### Epic 2: Content Bank

A media library where users upload and tag their photos.

**User Stories:**
- As a user, I want to upload multiple images at once so I can build my content library quickly
- As a user, I want to tag each image with relevant categories (e.g. "brow lamination", "lip blush", "before/after", "healed result") so I can find the right images easily
- As a user, I want the system to suggest tags I have used before so tagging is fast and consistent
- As a user, I want to view my content bank as a grid so I can browse my library visually
- As a user, I want to filter my content bank by tag so I can find relevant images for a specific post
- As a user, I want to delete images from my content bank

**Data model:**
- image_id, user_id, file_url, tags[], uploaded_at, used_in_posts[]

---

### Epic 3: Post Creation

Assembling a carousel post from the content bank.

**User Stories:**
- As a user, I want to select one image from my content bank to be the Hero (slide 1) of my carousel
- As a user, I want to select additional images to follow as carousel slides
- As a user, I want to choose a slide type for each slide:
  - **Hero** — full bleed photo + overlay + H1 headline + H2 subheading
  - **Text-only** — plain or blurred background + body copy (no photo)
  - **Image-only** — photo with no text overlay
  - **CTA** — structured text slide with services list or call to action
- As a user, I want to type my text for each slide manually
- As a user, I want to see a live preview of each slide before entering the editor

---

### Epic 4: Canvas Editor

Real-time per-slide editing after auto-generation from brand kit.

**User Stories:**
- As a user, I want to see my slide auto-generated from my brand kit as a starting point
- As a user, I want to drag my H1 text block to any position on the canvas
- As a user, I want to drag my H2 text block independently
- As a user, I want to adjust the photo overlay opacity with a live slider
- As a user, I want to change the background colour on text-only slides
- As a user, I want to toggle the swipe arrow (→) on or off for each carousel slide
- As a user, I want to toggle the handle watermark on or off per slide
- As a user, I want to reorder my carousel slides by dragging them in a slide strip below the canvas
- As a user, I want to add or remove slides from the carousel
- As a user, I want to export my finished carousel as individual PNG files (one per slide)
- As a user, I want to export all slides as a ZIP file

---

## Slide Templates — Visual Reference

### Hero Slide
```
┌─────────────────────────────┐
│  [PHOTO — full bleed]       │
│  [dark overlay ~50%]        │
│                             │
│                             │
│  H1 HEADLINE TEXT           │
│  H2 italic subheading       │
│                             │
│  @handle                    │
└─────────────────────────────┘
```

### Text-Only Slide
```
┌─────────────────────────────┐
│  [plain colour background]  │
│                             │
│  "Quote or key message      │
│   goes here, centred,       │
│   generous line height"     │
│                             │
│  @handle                    │
└─────────────────────────────┘
```

### CTA Slide
```
┌─────────────────────────────┐
│  [photo + overlay]          │
│                             │
│  BOOK YOUR                  │
│  TREATMENTS TODAY.          │
│                             │
│  • Service one              │
│  • Service two              │
│  • Service three            │
│                             │
│  Link in bio  ★★★★★        │
│  @handle                    │
└─────────────────────────────┘
```

---

## Out of Scope for V1

The following features are planned for future versions and must NOT be built in V1:

- Instagram / Facebook publishing via Meta Graph API
- AI caption generation
- AI auto-categorisation of uploaded images
- Scheduling / post calendar
- Analytics / performance tracking
- Multi-user / team accounts
- Mobile app
- Video / Reels support
- WhatsApp image intake

---

## File Structure (suggested)

```
/app
  /dashboard          → main logged-in view
  /brand-kit          → brand kit setup
  /content-bank       → image library
  /posts
    /new              → post creation flow
    /[id]/edit        → canvas editor
/components
  /editor             → Konva canvas components
  /brand-kit          → brand kit form components
  /content-bank       → upload + grid components
  /ui                 → shared UI components
/lib
  /supabase.ts        → supabase client
  /fonts.ts           → Google Fonts loader
/public
```

---

## Success Criteria for V1

V1 is complete when a user can:

1. Sign up and log in
2. Set up their brand kit (fonts, colours, overlay, logo, handle)
3. Upload images to their content bank and tag them
4. Create a new post by selecting images and slide types
5. See each slide auto-generated from their brand kit
6. Open the canvas editor and drag text, adjust opacity, change background colour
7. Reorder slides in the carousel strip
8. Export all slides as PNG files or a ZIP

---

## Notes for Claude Code

- Read CLAUDE.md before writing any code
- Think before coding — state assumptions and ask if unclear
- Build the simplest thing that satisfies each user story
- Do not add features not listed in this brief
- Use Supabase for all auth, database, and file storage
- Use react-konva for all canvas editor functionality
- Use Google Fonts API for font selection — do not bundle fonts locally
- Target mobile-responsive layout throughout — many users will access on phone
- All components should be reusable and clearly named
- Commit working increments — do not attempt to build everything in one pass
