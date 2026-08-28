---
name: Date Invitation
description: A living night sky in blues that asks one person to dinner and shows her the plan when she says yes.
colors:
  zenith: "#02040f"
  night: "#040a20"
  horizon: "#0e1c3f"
  blue-300: "#8fb4e6"
  blue-100: "#d3e2fb"
  white: "#f4f7ff"
  hairline: "rgba(244, 247, 255, 0.24)"
typography:
  display:
    fontFamily: "Great Vibes, Snell Roundhand, Apple Chancery, cursive"
    fontSize: "clamp(4.4rem, 20vw, 6.2rem)"
    fontWeight: 400
    lineHeight: 1.15
  script-label:
    fontFamily: "Great Vibes, Snell Roundhand, Apple Chancery, cursive"
    fontSize: "1.7rem"
    fontWeight: 400
    lineHeight: 1
  headline:
    fontFamily: "Cormorant Garamond, Cormorant, EB Garamond, Garamond, Times New Roman, serif"
    fontSize: "clamp(2.1rem, 8.5vw, 2.6rem)"
    fontWeight: 500
    lineHeight: 1.15
  title:
    fontFamily: "Cormorant Garamond, Cormorant, EB Garamond, Garamond, Times New Roman, serif"
    fontSize: "clamp(1.35rem, 5.4vw, 1.7rem)"
    fontWeight: 500
    lineHeight: 1.2
  body-lead:
    fontFamily: "Cormorant Garamond, Cormorant, EB Garamond, Garamond, Times New Roman, serif"
    fontSize: "clamp(1.3rem, 5.2vw, 1.55rem)"
    fontWeight: 500
    lineHeight: 1.35
  body:
    fontFamily: "Cormorant Garamond, Cormorant, EB Garamond, Garamond, Times New Roman, serif"
    fontSize: "1.2rem"
    fontWeight: 500
    lineHeight: 1.35
  label:
    fontFamily: "Cormorant Garamond, Cormorant, EB Garamond, Garamond, Times New Roman, serif"
    fontSize: "0.8rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.22em"
rounded:
  pill: "999px"
  dot: "50%"
spacing:
  row: "8px"
  sm: "14px"
  gutter: "24px"
  md: "28px"
  lg: "32px"
components:
  button-yes:
    backgroundColor: "{colors.white}"
    textColor: "{colors.zenith}"
    rounded: "{rounded.pill}"
    padding: "17px 48px"
    width: "min 210px"
  link-text:
    textColor: "{colors.blue-100}"
    typography: "{typography.label}"
  link-text-hover:
    textColor: "{colors.white}"
  plate-term:
    textColor: "{colors.blue-300}"
    typography: "{typography.label}"
  plate-value:
    textColor: "{colors.white}"
    typography: "{typography.body}"
  star-label:
    textColor: "{colors.white}"
    typography: "{typography.script-label}"
---

# Design System: Date Invitation

## Overview

**Creative North Star: "The Sky Is the Letter"**

The page is one screen of night sky, painted on a canvas that fills the viewport and never stops moving. Every piece of interface sits on that sky directly: no card, no panel, no gray surface between the words and the stars. Her name is written in the sky in script. Two named stars float in the upper half, joined by a dotted line, and spring together when she taps Yes. The lead (name, flourish, paragraph, question, button) then unmounts and the plan takes its place, so the whole story happens on one screen at 375x667 and 390x844 without scrolling.

Realism beats drama. The sky is near-black blue with a pale Milky Way band, a dark dust lane, stars in a real spectral mix (mostly white, some blue-white, a few warm), a small crescent moon, mist and two dark hill lines at the bottom. Meteors are rare and thin. The only things that glow more than a real sky would are the two named stars and the bloom on her name. The build diverged from the direction contract on the exact endpoints (contract said zenith `#02061a` to horizon `#122f6a`; the build settled on `#02040f` to `#0e1c3f`, brightening toward `#16305f` only after Yes). The build's values are the record.

Typography carries the voice. Great Vibes script is used exactly three times: her name as the headline, the two star labels, and his signature. Cormorant Garamond does everything else at weight 500, in three registers: italic for the spoken lines (the question, "It's a date.", the note), roman for running text, and one small uppercase tracked style at 600 for terms, links and the button.

**Key Characteristics:**
- One screen, one route, one reader. Nothing scrolls; the Yes reveal swaps content in place.
- Blues only. Every neutral is a tint of the sky; the palette has no gray.
- Depth is light, not shadow. Glow halos on stars, a bloom on her name, hairline rules for structure.
- Script only where a name would be handwritten; Cormorant 500 everywhere else, with a single caps style.
- Motion is slow and eased-out (1.1s entrances, a heavy spring for the stars), and fully removable under `prefers-reduced-motion`.

## Colors

Three sky darks, two pale blues for text, one near-white, and a translucent hairline; the canvas paints its own gradient with the same three darks.

### Primary
- **Sky White** (`white`): running text, the Yes button surface, the star labels, hover state of links and the bloom color of her name. This is the "ink" of the page; the sky is the paper.
- **Pale Blue** (`blue-100`): the lead paragraph, the flourish stroke, link text at rest, the note, secondary lines under plate values (`small`), and text selection background.
- **Steel Blue** (`blue-300`): the uppercase term labels in the plan (When, Where, Leaving, Wear) and the resting underline color of links. The one place text is deliberately quieter than pale blue.

### Neutral
- **Zenith** (`zenith`): the top of the sky gradient, the button's text color, and the selection text color. The darkest value on the page.
- **Night** (`night`): the `html` background and the gradient midpoint at 45%. What shows before the canvas paints.
- **Horizon** (`horizon`): the bottom of the CSS gradient. On the canvas the horizon lifts toward `#16305f` as `litAmount` rises after Yes.
- **Hairline** (`hairline`): the only border color. Sky white at 24% opacity, used as 1px rules above and between plate rows.

### Canvas-only values
The canvas in `src/Sky.tsx` owns a few colors the CSS never uses and that should stay there: star spectral colors (`#f2f5ff`, `#d5e3ff`, `#ffeccb`, `#ffc99a`), dust `#e6edff`, the moon `#f3f0ea`, hill fills `#050c1e` and `#02050f`, and the Milky Way blobs as `hsla` at hue 215 to 225, saturation 20 to 45%. They are scene paint, not UI tokens.

### Named Rules
**The No-Gray Rule.** Every neutral is a blue tint. If a value has equal R, G and B, it does not belong on this page. Dividers use `hairline`, never a gray line.

**The One Light Rule.** Solid sky white as a surface appears exactly once: the Yes button. Nothing else on the page is filled white, so the button is the brightest object under the moon.

**The Quieter Term Rule.** `blue-300` is for labels that name a field, not for content. Values and sentences stay in `white` or `blue-100`.

## Typography

**Display Font:** Great Vibes (with Snell Roundhand, Apple Chancery, cursive)
**Body Font:** Cormorant Garamond (with Cormorant, EB Garamond, Garamond, Times New Roman, serif)

Loaded locally through `@fontsource`: Cormorant Garamond at 500, 500 italic and 600; Great Vibes at 400. Nothing else is in the bundle. `body` sets weight 500 as the base, so a plain element is already at the right weight; 600 is reserved for the caps style.

**Character:** Handwriting for names, a book face for everything said. Great Vibes reads as the hand that wrote the invitation; Cormorant at 1.125rem base with `optimizeLegibility` and tabular numerals reads as the letter itself.

### Hierarchy
- **Display** (Great Vibes 400, `clamp(4.4rem, 20vw, 6.2rem)` mobile, 7rem at 900px+, line-height 1.15): her name only. Balanced wrap, 0.12em side padding so the script swashes are not clipped, and a three-layer blue bloom text-shadow.
- **Script label** (Great Vibes 400, 1.7rem mobile, 2.2rem at 900px+, line-height 1): the two star names, offset 18px (22px desktop) above or below the star core. The signature under the note is the same face at 2rem.
- **Headline** (Cormorant 500 italic, `clamp(2.1rem, 8.5vw, 2.6rem)`, line-height 1.15, centered): "It's a date." after Yes. Focusable (`tabIndex=-1`) so focus moves here on reveal.
- **Title** (Cormorant 500 italic, `clamp(1.35rem, 5.4vw, 1.7rem)`, line-height 1.2): the question "Will you have dinner with me?".
- **Body lead** (500, `clamp(1.3rem, 5.2vw, 1.55rem)` mobile, 1.7rem at 900px+, line-height 1.35, `blue-100`): the paragraph under her name, with `em` in white for the time. Balanced wrap.
- **Body** (500, 1.2rem, line-height 1.35): plate values and, in italic at line-height 1.4 in `blue-100`, the note. Secondary detail lines drop to 1.05rem in `blue-100`. Pretty wrap.
- **Label** (600, 0.8rem, 0.22em tracking, uppercase): plate terms in `blue-300` and links in `blue-100`. The Yes button is the same style at 0.9rem with a matching 0.22em `text-indent` so the tracked word centers.

### Named Rules
**The Script-for-Names Rule.** Great Vibes appears on exactly three things: her name, the two star labels, and his signature. Never on running text, headings, labels, links or the button. "It's a date." is Cormorant italic, not script.

**The One Caps Style Rule.** There is one uppercase register: Cormorant 600, 0.22em tracking. Terms and links use it at 0.8rem, the button at 0.9rem. Do not introduce a second tracking value or weight for caps.

**The Italic Is Spoken Rule.** Italic (always 500) marks a line addressed to her in his voice: the question, "It's a date.", the note. Facts (date, place, time) stay roman.

**The Legibility Shadow Rule.** Any text sitting on the canvas carries a navy text-shadow (`0 1px 16px rgba(4, 10, 30, 0.8)` for body and the question, `0 2px 14px rgba(4, 10, 30, 0.9)` for star labels, `0 2px 30px rgba(4, 10, 30, 0.7)` for the headline). The shadow is the same hue as the sky, so it reads as depth, not as an outline.

## Layout

A single fixed canvas (`.sky`, `position: fixed; inset: 0; z-index: 0`) and one `main.stage` above it at `z-index: 1`. The stage is a three-row grid that fills `100dvh`, padded `max(24px, safe-area-top)` at the top and `max(32px, safe-area-bottom)` at the bottom, with `align-content: start`.

The rows are `spacer / pair / words`. Before Yes, `grid-template-rows` is `max(0px, calc(35dvh - 236px)) minmax(200px, 30dvh) auto` (`max(0px, calc(33dvh - 262px)) minmax(260px, 34dvh) auto` at 900px+). The spacer pushes the initial composition down so the name and ask land in the lower half above the hills. On `.stage-yes` the rows become `0px minmax(120px, 22dvh) auto` (`0px minmax(200px, 26dvh) auto` at 900px+): the spacer collapses and the star field tightens, and the whole `grid-template-rows` value transitions over 900ms `ease-out`. Nothing on `.pair` itself animates; it just occupies row 2.

Star positions are percentages of the pair box: apart at (28%, 42%) and (70%, 60%); together at (47.5%, 50%) and (52.5%, 52%).

Row three is `.words`, centered, `min(100%, 520px)` wide (600px at 900px+), with 24px side padding and a 28px row gap. Inside it, `AnimatePresence mode="wait"` swaps the ask (`.ask`, 28px gap; lead then an `.ask-row` with an 18px gap between question and button) for the details (`.details`, 14px gap) in place.

The plan is a definition list on a subgrid: `max-content 1fr` columns, 22px column gap, rows padded 8px with a hairline above the list and below each row. Terms and values align on baseline. The two links sit in a centered wrapping flex row, `10px 28px` gap, each link `nowrap` with 4px vertical padding.

One breakpoint, `900px`, which enlarges the display and lead type, the star labels and their offsets, the pair row heights, the flourish (190px to 240px) and the button's horizontal padding (48px to 56px). Everything else is fluid through `clamp()` and `dvh`.

### Named Rules
**The One Screen Rule.** Nothing on this page should require scrolling at 375x667, 390x844 or on a laptop. Reveals replace content in place; if a new element is added, a grid row must give up height for it, the way the spacer and pair rows do on Yes.

## Elevation & Depth

No drop shadows on surfaces, because there are no surfaces. Depth comes from three things: parallax in the canvas (far, mid and near star layers move 10, 18 and 28px against pointer or device tilt; the nebula 8px; the moon 6px), light emission around bright points, and a hairline rule where a row boundary is needed.

The one exception is the Yes button. It sits on the sky like a lit object: a soft navy drop shadow, a 1px white ring at 35%, and a wide blue glow, all deepening on hover with a 2px lift.

### Shadow Vocabulary
- **Star glow** (`box-shadow: 0 0 6px 2px rgba(255,255,255,0.95), 0 0 22px 8px rgba(190,215,255,0.55), 0 0 60px 22px rgba(120,165,255,0.28)`): the 8px star core at rest, breathing between scale 1 and 1.18 over 3.6s.
- **Star glow, joined** (`box-shadow: 0 0 8px 3px rgba(255,255,255,1), 0 0 34px 12px rgba(200,220,255,0.7), 0 0 110px 40px rgba(130,175,255,0.4)`): after Yes, fading in over 1.8s with a 0.6s delay so it lands as the stars arrive.
- **Name bloom** (`text-shadow: 0 0 18px rgba(200,220,255,0.55), 0 0 48px rgba(140,180,255,0.35), 0 2px 30px rgba(4,10,30,0.8)`): her name in the display face. Two blue halos plus the legibility shadow.
- **Button rest** (`box-shadow: 0 10px 34px rgba(3,9,26,0.55), 0 0 0 1px rgba(255,255,255,0.35), 0 0 40px 4px rgba(170,200,255,0.35)`).
- **Button hover** (`box-shadow: 0 16px 40px rgba(3,9,26,0.6), 0 0 0 1px rgba(255,255,255,0.5), 0 0 60px 8px rgba(170,200,255,0.5)`, with `translateY(-2px)`).

### Named Rules
**The Glow-Not-Shadow Rule.** Depth is light coming off a point (star, name, button). Do not add a drop shadow under text, a rule or a block; if something needs separation, use a hairline or a navy text-shadow.

## Shapes

Two shapes only: the full pill (`999px`) for the Yes button and the focus ring, and the circle (`50%`) for the 8px star core. Nothing else has a radius because nothing else has a box. Structure is drawn with 1px hairlines (the plate) and 1px strokes (the dotted pair line at `2 6` dash, the flourish under her name). Links underline at 1px with a 0.24em offset. The flourish is an inline SVG: two mirrored curves meeting a small four-point star, with a 1px dot on each side, in `blue-100` at 85% opacity.

## Components

### Buttons
The page has one button and it should stay the only one.
- **Shape:** full pill (`999px`), minimum width 210px.
- **Yes:** sky white on zenith text, in the caps style at 0.9rem (600, uppercase, 0.22em tracking and text-indent); padding `17px 48px` (`18px 56px` at 900px+). Rest and hover shadows per Elevation.
- **Hover / Focus:** lifts 2px and deepens the glow over 320ms `ease-out`. Focus-visible draws a 2px sky-white outline offset 5px, itself pill-shaped.
- **Active:** returns to 0 and scales to 0.985.

### Links
- **Style:** the caps style at 0.8rem, `blue-100` text, 1px underline in `blue-300` offset 0.24em, 4px vertical padding, `white-space: nowrap`. The row wraps if two links do not fit.
- **Hover:** text and underline both go to sky white over 200ms `ease-out`.

### Plate (the plan)
- **Style:** a `dl` on a two-column subgrid (`max-content 1fr`, 22px gap). Hairline above the list and under each row; rows padded 8px.
- **Term:** caps style at 0.8rem in `blue-300`. **Value:** body at 1.2rem in white, with an optional `small` line at 1.05rem in `blue-100`.

### Navigation
None beyond the two links. No header, no footer, no menu.

### Named star pair (signature)
Two 8px white cores with the star glow, each carrying a script label 18px above (his) or below (hers), placed by percentage inside `.pair`, joined by a 1px dotted line (`rgba(238,244,255,0.75)`, dash `2 6`) that fades out when they meet. Entrance fades in with scale 0.6 to 1 over 1.4s (his at 1.0s, hers at 1.4s, the line at 2.2s). On Yes both stars and the line endpoints move on the same heavy spring (`stiffness 22, damping 11, mass 1.6`) and the joined glow takes over.

### Canvas sky (signature)
`src/Sky.tsx`, a single full-viewport 2D canvas capped at 1.5 device pixel ratio. Layers in paint order: vertical gradient (`#02040f`, mid `#040a20`, `#08132e`, `#0e1c3f`, each mid-to-bottom stop mixing toward a brighter blue as `litAmount` rises); nebula at quarter resolution (three pale Milky Way blobs plus a dark lane along the band at angle -0.75rad, and a low blue airglow); far layer (1100 stars plus 2600 dust points) and mid layer (320 stars) baked to offscreen sprites and refreshed at roughly 10Hz; 60 near stars twinkling live, the 8 brightest with a radial halo and a 0.5px cross glint; up to 2 meteors at a time, every 8 to 17s at rest and 2.5 to 5.5s after Yes; a crescent moon at (82%, 14%) with a wide soft glow; a mist gradient over two bezier hill silhouettes at 86% height. Pointer and device tilt drive parallax. Under reduced motion the canvas paints one static frame and repaints once on Yes.

### Motion grammar
Everything uses one easing, `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-out` in CSS, `ease` in App.tsx). Entrances rise 16px from 8px blur to sharp over 1.1s (lead at 0.6s, ask row at 1.4s). The ask exits up 10px into blur over 0.45s; details stagger children by 0.14s after a 0.7s hold, each over 0.9s. The stage's `grid-template-rows` transition takes 900ms. The `motion` package (`motion/react`) drives React motion; CSS transitions handle hover and the stage rows. `useReducedMotion` zeroes every duration, and the CSS media query removes the breathe animation and the button, link and stage transitions; smooth scroll is skipped too.

## Do's and Don'ts

### Do:
- **Do** put every new element straight on the sky, with a navy text-shadow for legibility, per The Legibility Shadow Rule.
- **Do** use `hairline` (`rgba(244, 247, 255, 0.24)`) at 1px for any divider.
- **Do** keep Great Vibes to her name, the star labels and the signature; use Cormorant 500 italic when a line is spoken and roman 500 when it is read.
- **Do** use the one caps style (600, uppercase, 0.22em) for any label, link or button text.
- **Do** use the one easing, `cubic-bezier(0.16, 1, 0.3, 1)`, and durations near 1s for entrances; and gate every animation on `useReducedMotion` / `prefers-reduced-motion`.
- **Do** keep the page to one screen at 375x667; take height from the stage's grid rows before adding scroll.
- **Do** read all copy from `src/invite.ts`. Names, times and place never appear as literals in components.

### Don't:
- **Don't** introduce a card, panel, backdrop blur or any filled container behind text. The sky is the only background.
- **Don't** use gray, a second accent, pink, or a warm tint anywhere in the UI. Warm values live only in the canvas star mix.
- **Don't** add a second filled button. Yes is the one lit object; further actions are text links.
- **Don't** add captions or subtitles to the star pair. The names are the only labels.
- **Don't** set script on a heading or a sentence. "It's a date." stays Cormorant italic.
- **Don't** raise the moon, the meteor rate or the nebula alpha for drama. The sky should read as a real night, with the two named stars as the only exaggeration.
- **Don't** request Cormorant Garamond outside 500, 500 italic and 600, or Great Vibes outside 400; they are not in the bundle.
