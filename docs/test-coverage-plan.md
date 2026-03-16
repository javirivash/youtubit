# Test Coverage Assessment & Implementation Plan

## Current State

15 test files, 49 tests — all passing. Coverage is focused on component rendering and basic user interactions.

### What's Well Covered

- **Component rendering**: All major views (Home, Player, FavoritesPlayer, FavoritesView, NotFound, LoginView) have basic render tests
- **Conditional rendering**: Logged-in vs. anonymous states, empty vs. populated lists, loading spinner
- **Simple user interactions**: Login/logout buttons, theme toggle, search submit, favorite button toggling
- **Form flows**: LoginView signup/login form switching, email/password submission
- **Route guarding**: PrivateRoute redirects unauthenticated users

### Coverage Gaps

#### 1. State Management (Priority: High)

**appReducer.js** — No tests for any of the 13 reducer cases. Pure function, easy to test, high ROI.

**AppState.jsx action creators** — No tests for:
- `getResultVideos` (API call, error handling, loading state)
- `loadPlayerById` (API call, related videos, error fallback)
- `addFavorite` / `removeFavorite` (Firebase write, refetch, local state merge)
- `signUpUser` / `logInUser` / `logOutUser` (Firebase auth, error handling, alerts)
- `toggleTheme` (localStorage persistence)
- `onAuthStateChanged` useEffect (auth resolution, favorite loading on login)

#### 2. Utility Functions (Priority: High)

No tests exist for:
- `validateItems` — Filters and normalizes video data from YouTube API
- `getFavorites` — Fetches user favorites from Firebase
- `updateLocalFavorites` — Merges server favorites with local video lists, marks `isFavorite` flags

These are pure data transformation functions (except `getFavorites`) and are called throughout the app.

#### 3. NavControls Component (Priority: Medium)

The mobile hamburger menu, dropdown, and transitions (NavControls.jsx) have zero test coverage. This replaced the old SideMenu/MenuButton which had tests. Should cover:
- Hamburger button toggles dropdown open/closed
- Dropdown renders correct items based on auth state
- Close behavior (backdrop click, hamburger click, menu item click)

#### 4. Navigation & Routing Integration (Priority: Medium)

All tests mock `useNavigate` away. No tests verify:
- Clicking a VideoItem navigates to the correct player route
- Search submission navigates to home when on another page
- Favorites routes use `/favorites/player/:id` prefix
- NotFound renders for unmatched routes

#### 5. Async Behavior & Error Handling (Priority: Medium)

- Loading state transitions (loading → loaded, loading → error)
- API failure scenarios in `getResultVideos` and `loadPlayerById`
- Firebase auth errors during signup/login
- Firebase database errors during add/remove favorite
- Alert messages shown on success and failure

#### 6. Player View Lifecycle (Priority: Low)

PlayerView and FavoritesPlayer tests only verify static rendering. Missing:
- `loadPlayerById` called with correct `videoId` from URL params on mount
- `loadPlayerById` re-called when `videoId` param changes
- `includeRelated: true` for PlayerView vs. `false` for FavoritesPlayer

#### 7. Netlify Serverless Functions (Priority: Low)

`netlify/functions/youtube-search.js` and `netlify/functions/youtube-player-data.js` have no tests:
- Request parameter handling
- YouTube API response transformation
- Error responses

---

## Implementation Plan

### Milestone 1: Core Logic (High Priority)

**Goal**: Cover the pure logic layer — reducer and utilities.

- [ ] **appReducer tests** — Test all 13 cases with expected state transitions
  - GET_RESULT_VIDEOS, SET_SELECTED_VIDEO, LOAD_PLAYER_SUCCESS, LOAD_PLAYER_ERROR
  - SET_LOADING, TOGGLE_THEME, ACTIVATE_LOGIN, DEACTIVATE_LOGIN
  - SIGN_UP_USER, LOG_IN_USER, LOG_OUT_USER, ADD_FAVORITE, REMOVE_FAVORITE
- [ ] **validateItems tests** — Normal items, items missing fields, empty array, HTML entity decoding
- [ ] **updateLocalFavorites tests** — Merge scenarios: no favorites, partial overlap, full overlap, empty lists

### Milestone 2: State Management Actions (High Priority)

**Goal**: Cover async action creators with mocked API/Firebase calls.

- [ ] **getResultVideos** — Success path (dispatches results), error path (dispatches empty, shows alert)
- [ ] **loadPlayerById** — Success with/without related videos, error fallback
- [ ] **Auth actions** — signUpUser, logInUser, logOutUser with success and error scenarios
- [ ] **Favorite actions** — addFavorite, removeFavorite with Firebase mock, refetch, and error handling
- [ ] **onAuthStateChanged** — Auth resolution sets authResolved, loads favorites for logged-in user

### Milestone 3: Component Interactions (Medium Priority)

**Goal**: Cover the interactive components that are currently untested.

- [ ] **NavControls** — Hamburger toggle, dropdown items by auth state, close behaviors
- [ ] **Player view lifecycle** — loadPlayerById called on mount and param change
- [ ] **VideoItem navigation** — Correct route construction for home vs. favorites context

### Milestone 4: Integration & Edge Cases (Low Priority)

**Goal**: Higher-level integration tests and edge cases.

- [ ] **Routing integration** — Full route matching with MemoryRouter
- [ ] **Netlify functions** — Request handling and response transformation
- [ ] **Error boundary scenarios** — Component error states
