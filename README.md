# Dinner tomorrow?

A one-page invitation. A cyanotype star wheel set to tomorrow at dinner time; two named stars are at their closest approach until she taps Yes, then they meet and the plan appears.

## Before you send it

Edit `src/invite.ts`. Every word on the page reads from it: her name, your name, date, time, pickup time, city, restaurant, address, what to wear, and your note.

## Run

```
npm install
npm run dev
```

## Deploy to Render

Push the repo to GitHub, then in Render choose New, Blueprint, and point it at this repo. `render.yaml` defines a static site that runs `npm ci && npm run build` and serves `dist`. Alternatively create a Static Site by hand with build command `npm ci && npm run build` and publish directory `dist`.
