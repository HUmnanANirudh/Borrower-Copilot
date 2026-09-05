# Mentimeter Design Tokens & UI Reference System

This document is a technical and aesthetic reference derived from live extraction and deep analysis of [Mentimeter](https://www.mentimeter.com/) using Playwright. It defines exact design tokens, typography scales, color palettes, visual language, and foundational design principles to guide UI decisions for the project **without implementing any code yet**.

---

## 1. Core Design Philosophy & Visual Principles

Mentimeter’s landing page exhibits a signature **modern editorial SaaS** aesthetic with high-energy playful touches.

1. **High-Contrast Editorial Typography**:
   - Giant, condensed, character-rich display titles (`MentiDisplayCompressed`) combined with clean, legible humanist sans-serif copy (`MentiText` / system fallbacks).
   - Tight line-heights on display headings (\~0.9 line-height ratio) giving an authoritative, poster-like impact.
2. **Warm Neutral Foundation ("Sand & Cream")**:
   - Rather than clinical pure white (`#FFFFFF`) everywhere, Mentimeter heavily anchors its sections with warm sand and off-white tones (`#F3EDE7`, `#F7F6F4`, `#F2F1F0`), giving an inviting, physical paper-like warmth.
3. **Pill & Floating Geometry**:
   - Interactive elements (CTAs, filter badges, floating indicator chips) consistently use extreme pill radii (`border-radius: 9999px`).
   - Cards and container frames contrast this with moderate, comfortable rounded rectangles (`border-radius: 16px` – `20px`), occasionally bounded by pronounced black structural borders (`border: ~8.8px solid #000000` or clean `1px solid rgba(0,0,0,0.08)`).
4. **Deliberate Accent Sparseness**:
   - The brand electric blue (`#5769E7`) is saved for high-intent primary conversion actions and key focus highlights.
   - Complementary colors (Coral `#FF7471`, Yellow `#FFC738`, Mint/Green `#52AD6E`, Lilac/Purple `#8E8EEA`) appear in micro-surfaces, tags, and dynamic data visualization graphics.
5. **Generous Breathing Room & Asymmetrical Balance**:
   - Large horizontal and vertical sectional paddings (`padding: 64px`–`96px` horizontally, `80px`–`120px` vertically on desktop).
   - Text blocks are left-aligned or centered with clear hierarchy, paired with high-fidelity UI previews with subtle multi-layer drop shadows.

---

## 2. Color Palette & Functional Token Mapping

Mentimeter uses a strict two-layer token architecture: **Primitive Palettes** and **Semantic Tokens**.

### 2.1 Primitive Color Tokens

#### Brand & Accent Hues
| Token Name | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `--palette-blue-50` | `#E5E9FF` | Soft blue badge / chip background |
| `--palette-blue-100` | `#D5DAF7` | Border brand weakest |
| `--palette-blue-200` | `#A9B5FC` | Secondary brand weak |
| `--palette-blue-300` | `#8A9BFF` | Hover states |
| `--palette-blue-500` (Base) | `#5769E7` | **Primary Brand CTA**, core blue |
| `--palette-blue-600` | `#4958BE` | Button hover state |
| `--palette-blue-700` | `#3F4BA1` | Button active / pressed state |
| `--palette-blue-800` | `#323C7C` | Deep contrast text on light blue |

#### Coral / Warm Accent
| Token Name | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `--palette-coral-50` | `#FFF3F2` | Subtle negative/warm background |
| `--palette-coral-100` | `#FFDEDD` | Warm border / chip |
| `--palette-coral-500` (Base) | `#FF7471` | Warm highlight / logo secondary |
| `--palette-coral-600` | `#C74E4C` | Negative / alert emphasis |
| `--palette-coral-800` | `#802E2D` | High-contrast warning text |

#### Purple / Lilac Accent
| Token Name | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `--palette-purple-50` | `#F8F8FE` | Surface checked background |
| `--palette-purple-100` | `#EEEFFD` | Info border / badge |
| `--palette-purple-500` (Base) | `#8E8EEA` | Secondary brand hue |
| `--palette-purple-700` | `#5E59B3` | Info primary / tertiary button active |

#### Neutral & Sand Grays
| Token Name | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `--palette-sand-50` | `#FCF7F2` | Ultra-light warm canvas |
| `--palette-sand-100` | `#F3EDE7` | **Hero / Section Warm Canvas** |
| `--palette-sand-200` | `#DDD6CF` | Muted sand dividers |
| `--palette-gray-50` | `#FCFBF9` | Neutral lightest background |
| `--palette-gray-100` | `#F7F6F4` | Hover states on neutral surfaces |
| `--palette-gray-200` | `#F2F1F0` | Input backgrounds, pill secondary buttons |
| `--palette-gray-300` | `#EBEAE8` | Standard card / section borders |
| `--palette-gray-500` | `#DEDCD9` | Disabled borders / placeholder borders |
| `--palette-gray-600` | `#C5C3C1` | Secondary icon / text mute |
| `--palette-gray-900` | `#5D5B59` | Subtitle / body text muted |
| `--palette-gray-1100` | `#302E2C` | Headings and primary dark elements |
| `--palette-gray-1300` | `#171717` | Standard high-emphasis body text |
| `--palette-gray-1400` | `#101010` | Deep near-black background / text |
| `--palette-black-base` | `#000000` | Pure black lines / outlines |
| `--palette-white-base` | `#FFFFFF` | Pure white card surfaces |

---

### 2.2 Semantic Design Tokens

```css
:root {
  /* Surfaces & Backgrounds */
  --color-bg: var(--palette-white-base);
  --color-bg-warm: var(--palette-sand-100);             /* #F3EDE7 */
  --color-bg-neutral: var(--palette-gray-200);          /* #F2F1F0 */
  --color-surface: var(--palette-white-base);
  --color-surface-raised: var(--palette-white-base);
  --color-surface-sunken: var(--palette-gray-200);

  /* Typography Colors */
  --color-text-primary: var(--palette-gray-1300);       /* #171717 */
  --color-text-strong: var(--palette-gray-1400);        /* #101010 */
  --color-text-muted: rgba(0, 0, 0, 0.55);
  --color-text-secondary: rgba(0, 0, 0, 0.75);
  --color-text-on-brand: var(--palette-white-base);

  /* Borders */
  --color-border-subtle: var(--palette-gray-300);       /* #EBEAE8 */
  --color-border-strong: var(--palette-black-base);     /* #000000 */

  /* Interactive / Buttons */
  --color-brand: var(--palette-blue-500);               /* #5769E7 */
  --color-brand-hover: var(--palette-blue-600);         /* #4958BE */
  --color-brand-active: var(--palette-blue-700);        /* #3F4BA1 */
  --color-button-secondary-bg: var(--palette-gray-200); /* #F2F1F0 */
  --color-button-secondary-hover: var(--palette-gray-300);
}
```

---

## 3. Typography Architecture

Mentimeter uses a tiered typography strategy:

### 3.1 Font Families
- **Display Compressed Headings**:
  `"MentiDisplayCompressed", "MentiDisplayCompressed Fallback", Arial, sans-serif`
  *Characteristics*: Ultra-tall x-height, condensed character widths, confident editorial headline presence.
- **Display Standard**:
  `"MentiDisplay", Arial, sans-serif`
  *Characteristics*: Used for mid-tier section titles (H2/H3) where condensed proportions would be too dense.
- **Body & Interactive UI Text**:
  `"MentiText", ui-sans-serif, system-ui, sans-serif`
  *Characteristics*: Clean, open geometric humanist sans-serif with high legibility at 12px–16px.

### 3.2 Typography Scale & Line Heights

| Level | Size (`rem` / `px`) | Line Height | Weight | Letter Spacing | Font Family |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero H1** | `88px` (5.5rem) | `79.2px` (0.9) | 400 (Condensed) | Normal | `MentiDisplayCompressed` |
| **Section H2** | `52px` – `64px` | `44.2px` – `54px` (0.85–0.9) | 400 (Condensed) | Normal | `MentiDisplayCompressed` |
| **Subheading H2**| `24px` – `28px` | `27.6px` – `32.2px` (1.15) | 600 (Semibold) | Normal | `MentiDisplay` |
| **Card Heading**| `18px` – `20px` | `24px` – `26px` (1.3) | 600 (Semibold) | Normal | `MentiDisplay` / `MentiText` |
| **Body Large** | `18px` (1.125rem) | `26px` (1.45) | 400 (Regular) | Normal | `MentiText` |
| **Body Default**| `16px` (1rem) | `24px` (1.5) | 400 (Regular) | Normal | `MentiText` |
| **Body Small** | `14px` (0.875rem)| `19.6px` (1.4) | 400 (Regular) | Normal | `MentiText` |
| **Caption / Micro**| `12px` (0.75rem)| `16.8px` (1.4) | 400 / 500 | Normal | `MentiText` |
| **Button Text** | `14px` / `16px` | `16px` / `20px` | 600 (Semibold) | Normal | `MentiText` |

---

## 4. Spacing, Elevation & Corner Radius Scale

### 4.1 Corner Radii (`border-radius`)
- **Pill / Maximum (`9999px`)**: Primary buttons, secondary buttons, tags, search bars, category filters.
- **Large Container (`20px` – `24px`)**: Interactive demo frames, showcase cards, illustration containers.
- **Medium Surface (`12px` – `16px`)**: Standard content cards, dropdowns, modal windows.
- **Small Component (`8px`)**: Notification chips, inner nested elements.
- **Sharp / Micro (`4px`)**: Focus rings, tooltips, inline links.

### 4.2 Elevation & Shadow Hierarchy
Mentimeter relies very sparingly on blur shadows, favoring either **crisp flat surfaces with micro-borders** or **multi-stop diffuse isometric elevation** for product preview cards:

1. **Card Showcase Shadow (Layered Elevation)**:
   ```css
   box-shadow:
     rgba(0, 0, 0, 0.12) -1px 1.5px 4px 0px,
     rgba(0, 0, 0, 0.10) -3.5px 6.6px 7.6px 0px,
     rgba(0, 0, 0, 0.06) -8px 15px 10px 0px,
     rgba(0, 0, 0, 0.02) -14px 26.5px 12px 0px;
   ```
2. **Flat Editorial Frame (Graphic Poster style)**:
   ```css
   border: 8.8px solid #000000;
   border-radius: 20px;
   background: #FFFFFF;
   ```
3. **Subtle Interface Border**:
   ```css
   border: 1px solid rgb(235, 234, 232); /* or rgba(0, 0, 0, 0.08) */
   ```

---

## 5. UI Component Patterns & Rules

### 5.1 Buttons
- **Primary CTA**:
  - `background`: `#5769E7`
  - `color`: `#FFFFFF`
  - `border-radius`: `9999px`
  - `padding`: `12px 24px` (or `14px 28px` for hero buttons)
  - `font-size`: `14px` / `16px`, `font-weight: 600`
  - `transition`: `background-color 150ms ease`
  - Hover: `#4958BE`
  - Active: `#3F4BA1`

- **Secondary / Neutral Pill**:
  - `background`: `#F2F1F0`
  - `color`: `#171717`
  - `border-radius`: `9999px`
  - `padding`: `12px 20px`
  - `font-size`: `14px`, `font-weight: 600`
  - Hover: `#EBEAE8`

- **Ghost / Inverted Pill**:
  - `background`: `#FFFFFF`
  - `color`: `#171717`
  - `border-radius`: `9999px`
  - `border`: `1px solid #DEDCD9`

### 5.2 Header / Navigation Bar
- `height`: `64px`
- `background`: `transparent` merging seamlessly into the warm section background (`#F3EDE7` or `#FFFFFF`).
- `layout`: Flexbox with logo on left, navigation links centered or grouped, right-aligned auth CTAs with pill styling.

### 5.3 Sectional Layout & Grid Structure
- **Section Background Rhythm**:
  Alternates between warm sand (`#F3EDE7`), crisp white (`#FFFFFF`), and soft gray (`#F7F6F4`) to clearly separate logical narratives without harsh dividing lines.
- **Section Padding**:
  `64px` desktop gutter horizontal padding (`padding: 0 64px`), with `80px` to `120px` vertical breathing room between major sections.
- **Content Max-Width**:
  Content blocks max out around `1200px` – `1280px` for optimal readability and balanced multi-column grids.

---

## 6. Guidelines for UI Decision Making (Project Checklist)

When building our application's UI, adhere to the following decisions:
- [ ] **Never use harsh pure black text (`#000000`) on white**: Use `--palette-gray-1300` (`#171717`) or `--palette-gray-1400` (`#101010`) for a soft, readable editorial feel.
- [ ] **All buttons & micro-badges must be fully rounded pills (`rounded-full` / `9999px`)**.
- [ ] **Warm background over sterile gray**: Favor warm sand tones (`#F3EDE7` / `#FCF7F2`) for page hero and hero-adjacent zones.
- [ ] **Hero headlines must be tall and tight**: Use condensed sans display typefaces with line-height capped at `0.85`–`0.95` of font size.
- [ ] **Primary Accent Blue (`#5769E7`) reserved for actionable conversions**: Avoid overusing blue as decorative background; preserve it for buttons, active pills, and interaction triggers.
