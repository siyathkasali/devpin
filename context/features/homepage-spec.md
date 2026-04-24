# Homepage Spec

## Overview

Implement the DevStash marketing homepage based on the mockup at `prototypes/homepage/`. Use server/client component pattern with Tailwind/ShadCN.

## Component Structure

```
app/page.tsx                    # Server component, main layout
app/components/
  Header.tsx                    # Client - navbar with scroll effect
  Hero.tsx                      # Client - chaos animation, dashboard preview
  Features.tsx                  # Server - features grid
  AIFeatures.tsx                # Server - AI section
  Pricing.tsx                   # Client - pricing toggle
  CTA.tsx                       # Server - call to action
  Footer.tsx                    # Server - footer
```

## Requirements

### Navigation (Header.tsx)
- Logo links to `/`
- "Features" scrolls to `#features`
- "Pricing" scrolls to `#pricing`
- "Sign In" → `/auth/signin`
- "Get Started" → `/register`
- Navbar background becomes opaque on scroll

### Hero Section (Hero.tsx)
- "Your knowledge today..." box with animated floating icons
  - Icons: Notion, GitHub, Slack, VS Code, browser, terminal, file, bookmark
  - Float/bounce animation with mouse repulsion
- Transform arrow with pulse animation
- "...with DevStash" dashboard preview mockup
  - Header with logo, search bar, action buttons
  - Sidebar with type filters (all active states for demo)
  - Item cards with colored top borders

### Features Section (Features.tsx)
- 6 feature cards in grid with accent colors:
  - Snippet (blue #3b82f6)
  - Prompt (amber #f59e0b)
  - Command (cyan #06b6d4)
  - Note (green #22c55e)
  - File (slate #64748b)
  - URL (indigo #6366f1)

### AI Section (AIFeatures.tsx)
- "Pro Feature" badge
- Checklist of AI capabilities
- Code editor mockup with "AI Generated Tags" demo

### Pricing Section (Pricing.tsx)
- Monthly/Yearly toggle (client component)
- Free ($0): 50 items, 3 collections, basic search
- Pro ($8/mo or $72/yr): unlimited, AI features
- "Most Popular" badge on Pro card

### CTA Section (CTA.tsx)
- "Start Your Free Account" button → `/register`

### Footer (Footer.tsx)
- Logo, link columns (Product, Company, Legal)
- Copyright with current year

## Navigation Routes

| Link | Destination |
|------|-------------|
| Logo | `/` |
| Features | `#features` (scroll) |
| Pricing | `#pricing` (scroll) |
| Sign In | `/auth/signin` |
| Get Started | `/register` |
| Start Free | `/register` |

## Styling

- Dark theme (matches app/globals.css)
- Use existing shadcn components (Button, Dialog where applicable)
- Tailwind v4 utilities
- Responsive breakpoints: mobile-first

## Notes

- Keep code DRY - extract shared styles where possible
- Homepage is public (no auth required)
- Scroll animations via Intersection Observer (client component)
