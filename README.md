# Youtubit

A YouTube-inspired video browsing app built as part of the **React Bootcamp** at [Wizeline](https://www.wizeline.com/). Users can search for videos, watch them, discover related videos, and sign up to save favorites to a personal list — all with light and dark theme support.

**Live demo:** [youtubit.netlify.app](https://youtubit.netlify.app)

---

## Features

- **Video search** — search YouTube and browse results in a responsive grid
- **Video player** — embedded player with related videos displayed alongside
- **User authentication** — sign up and log in with email and password (Firebase Auth)
- **Favorites** — save and remove videos to a personal favorites list, persisted per user (Firebase Realtime Database)
- **Protected routes** — favorites pages are only accessible to logged-in users
- **Light / dark theme** — toggle with full styled-components theming
- **Alert system** — non-blocking notifications for user actions and errors
- **Responsive layout** — adapts to mobile and desktop viewports

---

## Tech Stack

| Category         | Technology                                              |
| ---------------- | ------------------------------------------------------- |
| UI               | React 18, React Router DOM v6                           |
| Styling          | Styled Components v6 (light/dark theming)               |
| State management | React Context API + `useReducer`                        |
| Auth & database  | Firebase v12 (Authentication + Realtime Database)       |
| API integration  | YouTube Data API v3 (proxied via Netlify Functions)     |
| Build tool       | Vite 7                                                  |
| Deployment       | Netlify (CI/CD + serverless functions)                  |
| Testing          | Vitest + React Testing Library + jest-styled-components |
| Code quality     | ESLint + Prettier                                       |

---

## Architecture Highlights

- **Netlify Functions as API proxy** — the YouTube API key is kept server-side in a Netlify serverless function, never exposed to the client bundle.
- **Context + Reducer pattern** — global state (videos, auth, theme, favorites) is managed with `useContext` + `useReducer`, avoiding external state libraries while keeping logic centralized and testable.
- **Component co-location** — each component lives alongside its tests and child components in a `_children/` subdirectory.
- **Private route wrapper** — a `PrivateRoute` component redirects unauthenticated users away from protected pages.

---

## Project Structure

```
src/
├── api/              # YouTube API client (calls Netlify Functions)
├── components/
│   ├── Header/       # App header with search, theme toggle, auth, side menu
│   ├── Player/       # Video player and details panel
│   ├── VideoItem/    # Single video card (thumbnail + metadata)
│   ├── VideoList/    # Grid of VideoItems
│   ├── layout/       # Alert, Modal, Spinner, FavoriteButton
│   └── pages/        # Route-level components and PrivateRoute
├── context/
│   ├── app/          # Main app state (videos, auth, theme, favorites)
│   └── alert/        # Alert notification state
├── firebase/         # Firebase app initialization
└── utils/            # Favorites sync, validation helpers
netlify/
└── functions/        # Serverless functions proxying the YouTube API
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [YouTube Data API v3](https://developers.google.com/youtube/v3) key
- A [Firebase](https://firebase.google.com/) project with Authentication (Email/Password) and Realtime Database enabled

### Environment Variables

Create a `.env` file at the project root:

```env
# Used server-side by Netlify Functions only
YOUTUBE_API_KEY=your_youtube_api_key

# Used client-side by Vite
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### Install and Run

```bash
npm install
npm start        # start Vite dev server (no Netlify Functions)
```

To develop with Netlify Functions locally, use the [Netlify CLI](https://docs.netlify.com/cli/get-started/):

```bash
netlify dev
```

### Tests

```bash
npm test             # watch mode
npm run test:run     # single run
npm run test:coverage
```

---

## Deployment

The app is deployed on Netlify with continuous deployment from the `master` branch. Environment variables are configured in the Netlify project settings. The `netlify.toml` configures the build command, publish directory, and a catch-all redirect for client-side routing.
