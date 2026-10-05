# Personalized Content Dashboard

One feed for news, movie recommendations and social posts, shaped by the categories you choose.
Built with **Next.js 14 (App Router), React, TypeScript, Redux Toolkit, Tailwind CSS and Framer Motion**.

Author: [Amit Kumar](https://github.com/Kumaramit0809)

## Run it

```bash
npm install
cp .env.example .env.local   # optional: add API keys
npm run dev                  # http://localhost:3000
```

Without keys the app serves built-in sample data, so it works out of the box.

| Variable | Source |
|---|---|
| `NEWS_API_KEY` | newsapi.org (free keys only work from localhost) |
| `TMDB_API_KEY` | themoviedb.org, use the v4 "API Read Access Token" |

## Tests

```bash
npm test                      # unit + integration tests
npm run dev                   # start the dev server
npm run e2e                   # run Cypress tests in another terminal
```

## Features

- **Unified feed**: news (one request per chosen category), movies and mock social posts, interleaved.
- **Settings panel**: pick categories; saved to localStorage along with dark mode and favorites.
- **Trending** and **Favorites** sections; favorites persist across reloads.
- **Debounced search** (400 ms) across news and movies; filters favorites locally.
- **Infinite scroll** via IntersectionObserver, with de-duplication of results.
- **Drag and drop** reordering of cards (Framer Motion `Reorder`).
- **Dark mode** using CSS custom properties and Tailwind's `dark` class.
- **States**: loading spinner, empty state, error with retry.
- **Accessibility**: labelled controls, `aria-pressed` / `aria-current`, visible focus, reduced-motion support.

## Architecture

```
src/app/api/content/route.ts   server proxy for NewsAPI/TMDB/mock social (keys stay server-side)
src/store/slice.ts             one Redux slice: preferences, favorites, feed, fetchContent thunk
src/store/store.ts, hooks.ts   store and typed hooks
src/components/                Providers (localStorage sync), Dashboard, Card
src/lib/                       types, useDebounce, mock data
__tests__/, cypress/e2e/       tests
```

## User flow

1. Open the app and see a feed built from your default categories.
2. Open **Settings** and change categories; the feed reloads.
3. Type in the search box; results update after you stop typing.
4. Star cards, then open **Favorites**. Drag cards to reorder. Toggle dark mode.

## Security

API keys are read only in the Next.js route handler and never sent to the browser. `.env*` files are git-ignored.

## Notes

The app works without API keys using built-in sample data. API keys can be added through `.env.local` for live news and movie data.
