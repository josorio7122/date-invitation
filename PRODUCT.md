# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite + TypeScript (user's choice), deploying later to Render as a static site.

## Users

One person: the author's fiancée, opening a link on her phone that he sends her. Her job is to read the invitation and say yes to dinner tomorrow.

Secondary: the author, who fills in names, time, and place before sending.

## Product Purpose

A single-page invitation to dinner tomorrow. Success is that she smiles, taps yes, and sees the plan (time, place, what to wear, a note from him).

## Positioning

Not an e-card or a form. A personal object made for one person, by her fiancé, that only makes sense between the two of them.

## Operating Context

Opened from a chat message, almost certainly on a phone, possibly in an in-app browser. Viewed once or twice. Deployed as static files on Render.

## Capabilities and Constraints

- Confirmed: dinner out, English copy, addressed by her first name, tapping yes reveals the details.
- Her first name, the time, the restaurant, and the note are supplied by the author in `src/invite.ts` (INFERRED placeholder mechanism; the user has not yet given the name).
- No backend, no data sent anywhere. The yes state lives on the page only.
- Must work offline-ish: no runtime fetches beyond fonts.

## Brand Commitments

None. Personal, not a brand. Copy should sound like him, not like a card.

## Evidence on Hand

No photos or assets supplied yet. Do not fabricate photos of the couple; use authored non-photographic material.

## Product Principles

1. One reader. Everything on the page is addressed to her.
2. The yes is the whole point; nothing competes with it.
3. Nothing generic. If a line could be on a store-bought card, cut it.
4. Works flawlessly on a phone in a chat browser.
