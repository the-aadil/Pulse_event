# UI Understanding Prompt — Pulse Event Website
> Hand this entire file to another AI to give it a complete understanding of the Pulse Event website's visual design, component structure, color system, typography, and interaction patterns.

---

## 1. WHAT THIS WEBSITE IS

**Pulse Event** is a premium event-planning business website based in **Pune, India**.
It books and showcases event services such as: Birthday Parties, Weddings, Corporate Galas, Carnival Themes, Bollywood Nights, Baby Showers, and Catering.

The design language is **warm luxury editorial** — rich dark backgrounds contrasted against cream/ivory surfaces, gold accents throughout, refined serif display headings, and clean sans-serif body text. Think high-end wedding magazine meets modern SaaS site.

---

## 2. DESIGN TOKENS — EXACT COLOR VALUES

These are the core design tokens. All colors below are exact hex values used in the codebase.

### Surface Colors
| Token Name       | Hex Value   | Usage                                    |
|-----------------|-------------|------------------------------------------|
| `--color-cream`  | `#faf6ef`   | Page background, light surface cards     |
| `--color-sand`   | `#f2ecdf`   | Secondary surfaces, image placeholders   |
| `--color-ink`    | `#1d1b18`   | Primary text color, dark sections bg     |
| `--color-ink-soft` | `#57534a` | Secondary/muted text                     |

### Gold Palette (Primary Brand)
| Token              | Hex Value   | Usage                                              |
|--------------------|-------------|---------------------------------------------------|
| `--color-gold-50`  | `#faf6e9`   | Icon background (resting state)                   |
| `--color-gold-100` | `#f3ead0`   | —                                                 |
| `--color-gold-200` | `#e8d8ae`   | Subtle borders on cards, form field borders        |
| `--color-gold-300` | `#dcc289`   | Decorative lines, hero eyebrow text, italic accents|
| `--color-gold-400` | `#cfa968`   | Icon borders, footer headings, hover border states |
| `--color-gold-500` | `#b98f3e`   | Primary brand color: focus rings, stars, nav underline|
| `--color-gold-600` | `#9c742d`   | Active nav link, price badge background            |
| `--color-gold-700` | `#7d5b22`   | Explore link text, card title on hover, icon text  |
| `--color-gold-800` | `#5f4419`   | —                                                 |
| `--color-gold-900` | `#44300f`   | —                                                 |

### Wine Palette (Secondary Accent)
| Token              | Hex Value   | Usage                                    |
|--------------------|-------------|------------------------------------------|
| `--color-wine-500` | `#a24a52`   | Ambient glow blobs in hero / CTA sections|
| `--color-wine-600` | `#8a3640`   | —                                        |
| `--color-wine-700` | `#6f2a33`   | —                                        |

### Special Colors (not tokenized)
| Usage                    | Value                  |
|--------------------------|------------------------|
| Stats bar background     | `#000000` (pure black) |
| Input field background   | `#ffffff` (pure white) |
| Card body background (light sections) | `#ffffff` |
| Text selection background | `#9c742d` (gold-600) |
| Text selection foreground | `#ffffff` |

---

## 3. TYPOGRAPHY

### Font Families
| Role         | Variable            | Stack                                        |
|--------------|---------------------|----------------------------------------------|
| **Display**  | `--font-display`    | `var(--font-playfair)`, Georgia, serif        |
| **Sans-Serif** | `--font-sans`     | `var(--font-inter)`, ui-sans-serif, system-ui |

- **Display font** (Playfair Display): Used for hero headings, section headings (h1/h2/h3), logo wordmark, testimonial quote marks, event card titles, stats numbers, price badges.
  - `letter-spacing: -0.015em` (slight negative tracking for editorial feel)
- **Sans-serif** (Inter): Used for all body copy, nav links, labels, buttons, captions, footer text.

### Font Feature Settings
```
font-feature-settings: "cv11", "ss01", "liga";
```
Applied globally to body — enables ligatures and stylistic alternates in Inter.

### Type Scale Reference
| Element                        | Size                         | Weight    | Color                         |
|-------------------------------|-------------------------------|-----------|-------------------------------|
| H1 hero heading               | 4xl / 5xl / 7xl (responsive) | 600       | `#faf6ef` (cream)             |
| H1 italic accent span         | inherits                     | italic    | `#dcc289` (gold-300)          |
| H2 section heading            | 2xl / 3xl (responsive)       | 700       | `#1d1b18` (ink)               |
| H3 card heading               | 2xl                           | 600       | `#1d1b18` hover `#7d5b22`     |
| Eyebrow text (label above heading) | xs                     | 600 semibold, uppercase, tracking-[0.3em] | `#cfa968` or `#dcc289` |
| Body paragraph                | base / lg                    | 400       | ink at 70% or `#57534a`       |
| Nav links (default)           | sm (0.875rem)                | 500       | `#57534a` (ink-soft)          |
| Nav links (active)            | sm                           | 600       | `#7d5b22` (gold-700)          |
| Btn label                     | 1rem                          | 600       | see button section            |
| Footer column headings        | xs uppercase tracking-[0.25em] | 600     | `#cfa968` (gold-400)          |
| Footer body links             | sm                            | 400       | cream at 70%                  |
| Stats value                   | 3xl / 4xl                    | 600       | `#ffffff`                     |
| Stats label                   | sm                            | 500       | white at 60%                  |
| Input placeholder             | sm                            | 400       | ink at 40%                    |
| Price badge                   | xs bold tracking-wide         | 700       | `#1d1b18` on gold             |
| Capacity badge                | xs semibold tracking-wide     | 600       | `#faf6ef` on dark             |

---

## 4. PAGE LAYOUT STRUCTURE

The site is a **multi-page Next.js app** with a sticky header, full-width sections, and a footer.

```
+-----------------------------+
|  STICKY HEADER (z-50)       |  height: 64px
+-----------------------------+
|  [Page Sections...]         |  each section is full-width
+-----------------------------+
|  FOOTER                     |  bg-ink, 4-column grid
+-----------------------------+
```

**Max content width**: `max-w-7xl` (80rem / 1280px), centered with `mx-auto`.
**Horizontal padding**: `px-4 sm:px-6 lg:px-8`

---

## 5. COMPONENT-BY-COMPONENT BREAKDOWN

---

### 5.1 HEADER

**Container**: `sticky top-0 z-50 w-full`
**Background**: `#faf6ef` at 95% opacity + `backdrop-blur-md`
**Border**: Bottom `#e8d8ae` at 60% opacity (1px)
**Shadow**: `shadow-sm`
**Height**: 64px

**Logo** (left side):
- A square 36x36px box with gradient `#cfa968 to #9c742d` and white letter "P" (Playfair Display, bold, lg)
- Border: `#cfa968` at 70%
- Next to it: "Pulse Event" (Playfair Display, lg, semibold, `#1d1b18`) stacked above "Events · Pune" (9px, uppercase, tracking-[0.35em], `#9c742d`)
- Hover: the square box lifts -0.5 units and glows with `#b98f3e` shadow

**Navigation** (center-right, hidden on mobile):
- Links: Home, Events, About, Gallery, Contact
- Default: `text-sm font-medium color:#57534a` hover `color:#1d1b18`
- Active: `color:#7d5b22 font-weight:600` + gold underline bar `#b98f3e` at bottom
- Hover underline animation: `::after` pseudo scales from 0 to 1 (left origin, 0.3s ease-out)

**CTA Button** (far right): "Book an Event"
- Background: `#1d1b18`, text: `#faf6ef`
- Hover: background → `#7d5b22`, lifts -2px
- Hidden on xs; shown sm+

**Mobile Nav**: Hamburger shown below lg breakpoint

---

### 5.2 HERO SECTION

**Background**: `#1d1b18`
**Text**: `#faf6ef`
**Layout**: Centered, `max-w-4xl`, `text-center`
**Padding**: `pb-20 pt-16 sm:pb-28 sm:pt-20`

**Ambient Glow Decorations** (absolute, no pointer events):
- Right-top: 448px circle, `#b98f3e` at 15%, `blur-3xl`, glow-pulse animation
- Left-bottom: 416px circle, `#a24a52` at 15%, `blur-3xl`, glow-pulse animation with 3s delay
- Top hairline: 1px gradient `transparent via #b98f3e/60 transparent`

**Eyebrow Text**: "Crafting unforgettable memories in Pune"
- `text-xs font-semibold uppercase tracking-[0.3em] color:#dcc289`
- Flanked by 1px gold lines `#cfa968` (hidden mobile)

**H1**: "Celebrations that make hearts skip a beat"
- Playfair Display, `4xl/5xl/7xl`, weight 600, line-height 1.08
- Italic span `<em>hearts skip a beat</em>` = `italic color:#dcc289`

**Body**: Inter, `base/lg`, `#faf6ef` at 70%, `max-w-2xl`

**CTA Buttons**:
- Primary: gradient `#cfa968 → #9c742d`, text `#1a1a1a`, shimmer sweep
- Secondary: transparent, border `#faf6ef/25`, text `#faf6ef/90`

**Phone row**: icon circle `border:#faf6ef/20`, label `#faf6ef/45`, number `#faf6ef/80`, hover `#dcc289`

---

### 5.3 STATS BAR

**Background**: `#000000`
**Border**: top/bottom `#b98f3e/20`
**Layout**: 2-col mobile, 4-col md+, `py-12`

Each stat:
- Value: Playfair Display, `3xl/4xl`, 600, `#ffffff`, CountUp animation
- Label: Inter, `sm`, 500, `rgba(255,255,255,0.6)`

---

### 5.4 SERVICES SECTION

**Background**: `#ffffff`, `py-16 sm:py-24`
**Grid**: 1-col → 2-col (sm) → 3-col (lg), gap-6

Section Heading:
- Eyebrow: `text-xs semibold uppercase tracking-[0.3em] color:#b98f3e`
- Title: Playfair Display, `2xl/3xl`, bold, `#1d1b18`
- Desc: Inter, base, `#57534a`

Each Service Card:
- `rounded-2xl border:#e8d8ae/50 bg:#ffffff padding:2rem`
- Hover: `border:#cfa968`, lift -8px + deep gold shadow
- Decorative blur blob: 128px circle, `#cfa968/10`, top-right, scales 150% hover

Icon Badge (`h-14 w-14 rounded-xl`):
- Rest: `border:#dcc289/60 bg:#faf6e9 color:#7d5b22`
- Hover: `-translate-y-1 scale-110 border:#cfa968 bg:#b98f3e color:#1d1b18 shadow-lg`

Card H3: Playfair Display, `2xl`, 600, `#1d1b18` hover `#7d5b22`
Card body: Inter, base, `relaxed`, `#57534a`

---

### 5.5 EVENT CARD

Container: `rounded-xl border:#e8d8ae/50 bg:#ffffff shadow-sm`
Hover: `border:#cfa968`, lift -8px

Image area (`aspect-4/3`):
- Hover: image scales 105%, dark overlay fades in `from #1d1b18/60`
- Fallback: first letter in Playfair `5xl bold #9c742d` on `#f2ecdf` bg

Capacity badge (top-right): `rounded-full bg:#1d1b18/70 text:#faf6ef`, icon `#cfa968`
Price badge (bottom-left): `rounded-full bg:#b98f3e/90 text:#1d1b18`

Card body (p-6):
- H3: Playfair, `2xl semibold #1d1b18` hover `#7d5b22`
- Tagline: Inter, `sm #57534a`, 2-line clamp
- Footer: "Explore" + arrow, `sm semibold #7d5b22`, border-top `#e8d8ae/70`

---

### 5.6 TESTIMONIALS SECTION

**Background**: `#ffffff`, `py-16 sm:py-24`
**Grid**: 1-col → 3-col (md)

Each card:
- `rounded-lg border:#e8d8ae/70 bg:#faf6ef padding:1.75rem`
- Hover: `border:#dcc289`, lift
- Giant quote mark: Playfair, `8xl bold #e8d8ae/60`, `absolute -top-4 right-3`

Stars: 5x `h-4 w-4 color:#b98f3e`, hover scale 1.25

Blockquote: Inter, `sm #1d1b18/75`

Author:
- Avatar circle: `h-11 w-11 rounded-full border:#dcc289/70 bg:#faf6e9`
  - Initial: Playfair, `base semibold #7d5b22`
- Name: `sm semibold #1d1b18`
- Event: `xs #57534a`

---

### 5.7 CTA SECTION

Outer: `bg:#faf6ef`
Inner block: `rounded-lg border:#b98f3e/25 bg:#1d1b18 text-center color:#faf6ef`
Padding: `px-6 py-16 sm:px-12 sm:py-20`

Decorations: same gold + wine glows as hero

Eyebrow: "Your next chapter" — `xs semibold uppercase tracking-[0.3em] #dcc289`
H2: Playfair, `3xl/4xl`, semibold, `#faf6ef`
Body: `base #faf6ef/70`
Buttons: Primary + Light Outline (same as hero)

---

### 5.8 FOOTER

**Background**: `#1d1b18`, text: `#faf6ef`
**Top**: Gold hairline `1px linear-gradient(to right, transparent, #cfa968, transparent)`
**Grid**: 1-col → 2-col (sm) → 4-col (lg), `py-9`

Col 1 (Brand):
- Logo: "Pulse Event" `#faf6ef`, subtext `#cfa968`
- Tagline: `sm #faf6ef/60`
- Social icons: `36x36 rounded-md border:#faf6ef/15 color:#faf6ef/70`
  - Hover: `border:#cfa968 color:#cfa968 -translateY-0.5`

Col 2/3 (Links):
- Heading: `xs semibold uppercase tracking-[0.25em] #cfa968`
- Links: `sm #faf6ef/70` hover `#cfa968`

Col 4 (Contact):
- Icons: `h-4 w-4 #cfa968`
- Text: `sm #faf6ef/70` hover `#cfa968`

Bottom bar: `border-t #faf6ef/10`, copyright `xs #faf6ef/40`

---

## 6. BUTTON SYSTEM

Base `.btn`: `border-radius:6px padding:0.75rem 1.75rem font-size:1rem font-weight:600`
Transitions: transform, box-shadow, bg, border, color — 0.2s
Active: `scale(0.98)` | Disabled: `opacity:0.6`

| Variant         | Background               | Text Color | Border               | Hover                                  |
|-----------------|--------------------------|------------|----------------------|----------------------------------------|
| `.btn-primary`  | `#cfa968 → #9c742d` grad | `#1a1a1a`  | `1px solid #cfa968`  | Lighter grad + lift -2px + deep shadow |
| `.btn-outline`  | transparent              | `#7d5b22`  | `1px solid #b98f3e`  | Fill `#b98f3e`, text `#1d1b18`         |
| `.btn-dark`     | `#1d1b18`                | `#faf6ef`  | none                 | bg → `#7d5b22`, lift -2px              |
| `.btn-light-outline` | transparent         | `#faf6ef/90`| `1px solid #faf6ef/25` | border/50 + faint cream bg          |
| `.btn-sm`       | (inherits)               | (inherits) |                      | Smaller: `0.5rem 1.125rem`, 0.875rem  |
| `.btn-shine`    | + shimmer `::after`      |            |                      | White gradient sweeps every 3.2s      |

---

## 7. FORM INPUTS

`.input` base:
- `border-radius:6px border:1px solid #e8d8ae/80 bg:#ffffff`
- `padding:0.75rem 1rem font-size:0.875rem color:#1d1b18`
- Placeholder: `#1d1b18/40`
- Hover border: `#dcc289`
- Focus border: `#b98f3e` + ring: `0 0 0 3px rgb(185 143 62 / 0.25)`
- Disabled: `bg:#f2ecdf cursor:not-allowed`

---

## 8. CARD HOVER (card-lift)

All cards: `.card-lift`
- Hover: `translateY(-8px)` + `box-shadow: 0 32px 64px -24px rgb(185 143 62 / 0.15), 0 16px 32px -12px rgb(29 27 24 / 0.25)` + `border-color:#cfa968`
- Transition: 0.4s ease-out

---

## 9. ANIMATIONS

| Class                  | Effect                              | Duration |
|------------------------|-------------------------------------|----------|
| animate-fade-up        | Fade + rise 16px                    | 0.6s     |
| animate-fade-in        | Opacity 0→1                         | 0.8s     |
| animate-zoom-in        | scale 0.96→1 + fade                 | 0.7s     |
| animate-float          | Hover -10px + back                  | 5s ∞     |
| animate-glow           | Opacity + scale pulse (1→1.08)      | 6s ∞     |
| animate-ken-burns      | scale 1→1.08, alternate             | 14s ∞    |
| animate-text-glow      | White + gold text-shadow pulse      | 4s ∞     |
| animate-twinkle        | Opacity + scale star pulse          | 3s ∞     |
| animate-sway           | rotate -3→3deg                      | 6s ∞     |
| animate-sparkle-rise   | Rise + fade particles               | 4s ∞     |
| animate-confetti-drift | Fall + rotate confetti              | 6s ∞     |
| .btn-shine::after      | Shimmer sweep across button         | 3.2s ∞   |

**Scroll Reveal**: IntersectionObserver — elements hidden (opacity:0 + offset/blur/scale) until in viewport, then transition to visible. Variants: up, down, left, right, zoom, blur, fade. Stagger via `--reveal-delay` CSS variable.

---

## 10. SECTION HEADING PATTERN

All sections use the same centered heading layout:
1. Eyebrow: `xs semibold uppercase tracking-[0.3em] #b98f3e` — e.g. "Why Choose Us"
2. Title: Playfair Display `2xl–3xl bold #1d1b18` — main heading
3. Description: Inter `base #57534a` — subtitle/summary

---

## 11. HOME PAGE SECTION ORDER

1. Hero (dark `#1d1b18`)
2. Stats Bar (pure black `#000000`)
3. Services (white `#ffffff`)
4. Featured Events (cream `#faf6ef`)
5. Gallery Preview
6. Testimonials (white `#ffffff`)
7. CTA Block (cream wrapper, dark inner card)
8. Footer (dark `#1d1b18`)

---

## 12. DESIGN PRINCIPLES TO PRESERVE

1. **Dark sections** use cream text, gold-300/400 accents, wine + gold blobs.
2. **Light sections** use ink text, gold borders, white card surfaces.
3. **Every gold border** is subtle — always 50–70% opacity at rest.
4. **Hover always lifts**: buttons -2px, cards -8px, icons -4px.
5. **No harsh black** — dark bg is warm `#1d1b18` not `#000` (except stats bar).
6. **Serif (Playfair) for display only**, Inter for everything else.
7. **Gold is the connective tissue** — runs through every section.
8. **Cream-opacity layering**: text-on-dark is never plain white — always `#faf6ef` at 70/60/45/40%.
