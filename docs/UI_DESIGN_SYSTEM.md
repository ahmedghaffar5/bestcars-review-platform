# Obsidian Diamond Luxury

Best Cars uses one signature dark interface across the React application and
the standalone Django-served pages. The visual language is automotive
editorial: layered graphite surfaces, platinum type, and small champagne
highlights. It is not a theme toggle or a claim that the colors are
universally accessible without testing each state.

## Tokens

| Role | Value |
| --- | --- |
| Canvas / obsidian | `#090B10` |
| Section background | `#10141B` |
| Card surface | `#171C25` |
| Elevated surface | `#202733` |
| Primary text | `#F4F3EF` |
| Secondary text | `#B7BDC8` |
| Muted text | `#929BAA` |
| Champagne accent | `#D4B77E` |
| Accent hover | `#E6CEA5` |
| Quiet border | `#2E3643` |
| Positive sentiment | `#78D6AC` |
| Neutral sentiment | `#AEBBCF` |
| Negative sentiment | `#F29A9A` |

These values are defined as CSS variables in
`server/frontend/styles/obsidian.input.css` and exposed to the Tailwind 3.4
configuration for utility use.

## Typography and spacing

- System sans-serif fallback is mandatory; the interface uses `Inter` when
  available and falls back to the platform UI sans-serif stack.
- Body text is approximately 16px with a 1.6 line height.
- Headings use a fluid scale and remain readable on narrow screens.
- Layout spacing follows 4px/8px increments; the public content width is
  capped at approximately 1280px.
- Cards use 16px radii and controls use approximately 10px radii.

## Components and states

Shared public patterns include the faceted wordmark, header/navigation,
primary and secondary buttons, cards, form fields, alerts, status/empty
states, sentiment badges, review cards, and the footer. Interactive controls
use real links/buttons, visible labels, focus-visible outlines, disabled
states, and pending text where network work is in progress.

The mobile header uses a real button, closes on Escape, and keeps navigation
links in the DOM. Reduced-motion preferences disable decorative transitions.
Sentiment is always labeled as automated text analysis rather than a star
rating or verification signal.

## Build and asset conventions

`npm run build` first compiles
`styles/obsidian.input.css` with the pinned Tailwind 3.4 CLI into
`public/static/css/obsidian.css`, then synchronizes the same stylesheet into
`static/css/obsidian.css` for Django-served previews, and finally runs the CRA
production build. There is no Tailwind CDN or browser compiler.

Static pages use `/static/css/obsidian.css` and `/static/style.css`; the React
shell links the generated stylesheet from `/static/css/obsidian.css`. Django
Admin remains outside the public template and does not load public Preflight.
