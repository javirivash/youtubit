# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow

Always create a new branch off `master` before starting work on any new feature or fix.

Before committing any changes, always run lint (`npm run lint`), tests (`npm run test:coverage`), and build (`npm run build`) to catch errors early.

After pushing a branch, check whether a PR already exists for it (`gh pr view <branch> --repo javirivash/youtubit --json url 2>/dev/null`). If no PR exists, create one automatically using `gh pr create --repo javirivash/youtubit` with a descriptive title and body summarizing the changes. The PR should target `master`. Always pass `--repo javirivash/youtubit` to all `gh` commands to avoid defaulting to the upstream fork.

## Commands

- `npm start` — Vite dev server (frontend only, no Netlify Functions)
- `netlify dev` — Full local dev with serverless functions
- `npm run build` — Production build (output: `dist/`)
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `npm test` — Vitest in watch mode
- `npm run test:run` — Single test run
- `npm run test:coverage` — Coverage report
- Run a single test: `npx vitest run src/components/Header/Header.test.jsx`

## Architecture

React 18 SPA for browsing YouTube videos with auth and favorites. Deployed on Netlify.

**State management**: Context API + useReducer, split into two contexts:
- `AppContext` (`src/context/app/`) — videos, auth, theme, favorites, loading, UI flags. 14 action types in `src/context/types.js`.
- `AlertContext` (`src/context/alert/`) — toast notifications, auto-dismiss after 5 seconds.

Custom hooks `useAppContext()` and `useAlertContext()` provide access with error handling.

**API layer**: Client-side fetches hit Netlify Functions (`netlify/functions/`) which proxy YouTube Data API v3. The API key lives server-side only.
- `youtube-search` — search videos
- `youtube-player-data` — video details + related videos

**Auth & data**: Firebase Auth (email/password) + Realtime Database for favorites. `onAuthStateChanged` resolves auth state on mount. `PrivateRoute` guards `/favorites` routes.

**Favorites sync**: `updateLocalFavorites()` merges server favorites with local video lists, marking videos with `isFavorite`. Called on search, player load, add/remove favorite, and login.

**Routing** (React Router v6): `/` (HomeView), `/player/:videoId` (PlayerView), `/favorites` (FavoritesView), `/favorites/player/:videoId` (FavoritesPlayer), `*` (NotFound).

**Styling**: Styled Components with light/dark theme support (`src/context/app/themes.js`). Theme persisted in localStorage.

## Conventions

- Components are PascalCase `.jsx`, utilities are camelCase `.js`
- Tests are colocated: `Component.test.jsx` next to `Component.jsx`
- Child components go in `_children/` subdirectories
- Styled components are defined inline in each component file
- Mock data for tests lives in `src/utils/testMocks.js`
- Environment variables: server-side `YOUTUBE_API_KEY`; client-side `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`

## ESLint Config

Flat config (ESLint 9) with separate rule sets for app code, test files, and Netlify Functions. React-in-JSX-scope and prop-types rules are disabled. Prettier integration via eslint-config-prettier.
