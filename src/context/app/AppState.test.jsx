import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AppState from './AppState';
import AlertState from '../alert/AlertState';
import { useAppContext } from './appContext';
import { useAlertContext } from '../alert/alertContext';
import { youtubeSearch, youtubeVideos } from '../../api/youtube';
import getFavorites from '../../utils/getFavorites';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { ref, set, remove } from 'firebase/database';
import {
  selectedVideo,
  resultVideos,
  currentFavorites,
} from '../../utils/testMocks';

// Mock external dependencies
vi.mock('../../api/youtube');
vi.mock('../../utils/getFavorites');
vi.mock('firebase/auth');
vi.mock('firebase/database');
vi.mock('../../firebase/client', () => ({
  auth: {},
  db: {},
}));

// Capture onAuthStateChanged callback so tests can trigger it
let authCallback;
onAuthStateChanged.mockImplementation((_auth, cb) => {
  authCallback = cb;
  return vi.fn(); // unsubscribe
});

// Helper: renders AppState with a consumer that exposes context actions
function TestConsumer({ onContext }) {
  const context = useAppContext();
  const alertContext = useAlertContext();
  React.useEffect(() => {
    onContext(context, alertContext);
  });
  return (
    <div>
      <span data-testid="loading">{String(context.loading)}</span>
      <span data-testid="searchText">{context.searchText}</span>
      <span data-testid="theme">{context.theme}</span>
      <span data-testid="shouldShowLogin">{String(context.shouldShowLogin)}</span>
      <span data-testid="currentUser">{context.currentUser?.email || 'none'}</span>
      <span data-testid="resultCount">{context.resultVideos.length}</span>
      <span data-testid="favoritesCount">{context.currentFavorites.length}</span>
      <span data-testid="selectedVideoId">{context.selectedVideo?.id || 'none'}</span>
      <span data-testid="relatedCount">{context.relatedVideos.length}</span>
      <span data-testid="alert">{alertContext.alert || 'none'}</span>
    </div>
  );
}

function renderWithContext() {
  let contextRef = {};
  let alertRef = {};
  const onContext = (ctx, alertCtx) => {
    contextRef.current = ctx;
    alertRef.current = alertCtx;
  };

  render(
    <AlertState>
      <AppState>
        <TestConsumer onContext={onContext} />
      </AppState>
    </AlertState>,
  );

  return { contextRef, alertRef };
}

// Make YouTube API items that validateItems expects
const makeApiItem = (id, title = 'Test Video') => ({
  id: { videoId: id },
  snippet: {
    title,
    description: 'desc',
    channelTitle: 'channel',
    thumbnails: { medium: { url: 'https://img.youtube.com/test.jpg' } },
  },
});

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();

  // Default: no logged-in user on mount
  onAuthStateChanged.mockImplementation((_auth, cb) => {
    authCallback = cb;
    return vi.fn();
  });

  // Default mocks
  ref.mockReturnValue('mock-ref');
  set.mockResolvedValue();
  remove.mockResolvedValue();
  getFavorites.mockResolvedValue([]);
});

describe('AppState action creators', () => {
  describe('getResultVideos', () => {
    it('fetches videos and updates state on success', async () => {
      const apiItems = [makeApiItem('vid1'), makeApiItem('vid2')];
      youtubeSearch.mockResolvedValue({ items: apiItems });

      const { contextRef } = renderWithContext();
      await act(async () => authCallback(null));

      await act(async () => {
        await contextRef.current.getResultVideos('react');
      });

      expect(youtubeSearch).toHaveBeenCalledWith({ q: 'react' });
      expect(screen.getByTestId('searchText')).toHaveTextContent('react');
      expect(screen.getByTestId('resultCount')).toHaveTextContent('2');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    it('dispatches empty results and shows alert on error', async () => {
      youtubeSearch.mockRejectedValue(new Error('Network error'));

      const { contextRef } = renderWithContext();
      await act(async () => authCallback(null));

      await act(async () => {
        await contextRef.current.getResultVideos('fail');
      });

      expect(screen.getByTestId('resultCount')).toHaveTextContent('0');
      expect(screen.getByTestId('alert')).toHaveTextContent(
        'Error: Failed fetching results',
      );
    });
  });

  describe('loadPlayerById', () => {
    it('loads player with related videos on success', async () => {
      const relatedItems = [makeApiItem('rel1'), makeApiItem('rel2')];
      youtubeVideos.mockResolvedValue({
        selectedVideo,
        relatedItems,
      });

      const { contextRef } = renderWithContext();
      await act(async () => authCallback(null));

      await act(async () => {
        await contextRef.current.loadPlayerById({
          videoId: 'PrZHBTv3fjw',
          includeRelated: true,
        });
      });

      expect(youtubeVideos).toHaveBeenCalledWith({
        videoId: 'PrZHBTv3fjw',
        includeRelated: true,
      });
      expect(screen.getByTestId('selectedVideoId')).toHaveTextContent(
        'PrZHBTv3fjw',
      );
      expect(screen.getByTestId('relatedCount')).toHaveTextContent('2');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    it('loads player without related videos when includeRelated is false', async () => {
      youtubeVideos.mockResolvedValue({
        selectedVideo,
        relatedItems: [],
      });

      const { contextRef } = renderWithContext();
      await act(async () => authCallback(null));

      await act(async () => {
        await contextRef.current.loadPlayerById({
          videoId: 'PrZHBTv3fjw',
          includeRelated: false,
        });
      });

      expect(screen.getByTestId('relatedCount')).toHaveTextContent('0');
    });

    it('dispatches error and shows alert on failure', async () => {
      youtubeVideos.mockRejectedValue(new Error('API down'));

      const { contextRef } = renderWithContext();
      await act(async () => authCallback(null));

      await act(async () => {
        await contextRef.current.loadPlayerById({
          videoId: 'bad',
          includeRelated: true,
        });
      });

      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('alert')).toHaveTextContent(
        'Error: Failed loading player',
      );
    });
  });

  describe('toggleTheme', () => {
    it('toggles from light to dark and persists to localStorage', async () => {
      const { contextRef } = renderWithContext();
      await act(async () => authCallback(null));

      expect(screen.getByTestId('theme')).toHaveTextContent('light');

      await act(async () => {
        contextRef.current.toggleTheme();
      });

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('toggles from dark back to light', async () => {
      localStorage.setItem('theme', 'dark');
      const { contextRef } = renderWithContext();
      await act(async () => authCallback(null));

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');

      await act(async () => {
        contextRef.current.toggleTheme();
      });

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });
  });

  describe('signUpUser', () => {
    it('creates user and shows success alert', async () => {
      createUserWithEmailAndPassword.mockResolvedValue({
        user: { uid: 'new-uid', email: 'test@test.com' },
      });

      const { contextRef } = renderWithContext();
      await act(async () => authCallback(null));

      await act(async () => {
        await contextRef.current.signUpUser('test@test.com', 'pass123');
      });

      expect(screen.getByTestId('currentUser')).toHaveTextContent(
        'test@test.com',
      );
      expect(screen.getByTestId('shouldShowLogin')).toHaveTextContent('false');
      expect(screen.getByTestId('alert')).toHaveTextContent(
        "You've successfully signed up as test@test.com",
      );
    });

    it('shows error alert on signup failure', async () => {
      createUserWithEmailAndPassword.mockRejectedValue(
        new Error('Email already in use'),
      );

      const { contextRef } = renderWithContext();
      await act(async () => authCallback(null));

      await act(async () => {
        await contextRef.current.signUpUser('test@test.com', 'pass123');
      });

      expect(screen.getByTestId('currentUser')).toHaveTextContent('none');
      expect(screen.getByTestId('alert')).toHaveTextContent(
        'Error while signing up: Email already in use',
      );
    });
  });

  describe('logInUser', () => {
    it('logs in user, fetches favorites, and shows success alert', async () => {
      signInWithEmailAndPassword.mockResolvedValue({
        user: { uid: 'uid-123', email: 'user@test.com' },
      });
      getFavorites.mockResolvedValue(currentFavorites);

      const { contextRef } = renderWithContext();
      await act(async () => authCallback(null));

      await act(async () => {
        await contextRef.current.logInUser('user@test.com', 'pass123');
      });

      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(getFavorites).toHaveBeenCalledWith('uid-123');
      expect(screen.getByTestId('currentUser')).toHaveTextContent(
        'user@test.com',
      );
      expect(screen.getByTestId('favoritesCount')).toHaveTextContent('3');
      expect(screen.getByTestId('shouldShowLogin')).toHaveTextContent('false');
      expect(screen.getByTestId('alert')).toHaveTextContent(
        "You've successfully logged in as user@test.com",
      );
    });

    it('shows error alert on login failure', async () => {
      signInWithEmailAndPassword.mockRejectedValue(
        new Error('Wrong password'),
      );

      const { contextRef } = renderWithContext();
      await act(async () => authCallback(null));

      await act(async () => {
        await contextRef.current.logInUser('user@test.com', 'bad');
      });

      expect(screen.getByTestId('currentUser')).toHaveTextContent('none');
      expect(screen.getByTestId('alert')).toHaveTextContent(
        'Error while logging in: Wrong password',
      );
    });
  });

  describe('logOutUser', () => {
    it('signs out and shows success alert', async () => {
      signOut.mockResolvedValue();

      const { contextRef } = renderWithContext();
      // Simulate logged-in user via onAuthStateChanged
      getFavorites.mockResolvedValue([]);
      await act(async () =>
        authCallback({ uid: 'uid-123', email: 'user@test.com' }),
      );

      await act(async () => {
        await contextRef.current.logOutUser();
      });

      expect(signOut).toHaveBeenCalled();
      expect(screen.getByTestId('currentUser')).toHaveTextContent('none');
      expect(screen.getByTestId('favoritesCount')).toHaveTextContent('0');
    });

    it('shows error alert on sign out failure', async () => {
      signOut.mockRejectedValue(new Error('Sign out failed'));

      const { contextRef } = renderWithContext();
      await act(async () => authCallback(null));

      await act(async () => {
        await contextRef.current.logOutUser();
      });

      expect(screen.getByTestId('alert')).toHaveTextContent(
        'There was a problem while logging out',
      );
    });
  });

  describe('addFavorite', () => {
    it('writes to Firebase, refetches favorites, and shows alert', async () => {
      const video = resultVideos[0];
      getFavorites.mockResolvedValue([{ ...video, isFavorite: true }]);

      const { contextRef } = renderWithContext();
      // Log in first
      getFavorites.mockResolvedValueOnce([]);
      await act(async () =>
        authCallback({ uid: 'uid-123', email: 'user@test.com' }),
      );
      getFavorites.mockResolvedValue([{ ...video, isFavorite: true }]);

      await act(async () => {
        await contextRef.current.addFavorite(video);
      });

      expect(set).toHaveBeenCalled();
      expect(getFavorites).toHaveBeenCalledWith('uid-123');
      expect(screen.getByTestId('favoritesCount')).toHaveTextContent('1');
      expect(screen.getByTestId('alert')).toHaveTextContent(
        'Added to Favorites',
      );
    });

    it('shows error alert on Firebase write failure', async () => {
      set.mockRejectedValue(new Error('Permission denied'));

      const { contextRef } = renderWithContext();
      getFavorites.mockResolvedValueOnce([]);
      await act(async () =>
        authCallback({ uid: 'uid-123', email: 'user@test.com' }),
      );

      await act(async () => {
        await contextRef.current.addFavorite(resultVideos[0]);
      });

      expect(screen.getByTestId('alert')).toHaveTextContent(
        'There was an error while adding to Favorites',
      );
    });
  });

  describe('removeFavorite', () => {
    it('removes from Firebase, refetches favorites, and shows alert', async () => {
      const { contextRef } = renderWithContext();
      getFavorites.mockResolvedValueOnce(currentFavorites);
      await act(async () =>
        authCallback({ uid: 'uid-123', email: 'user@test.com' }),
      );

      getFavorites.mockResolvedValue([currentFavorites[1], currentFavorites[2]]);

      await act(async () => {
        await contextRef.current.removeFavorite(currentFavorites[0].id);
      });

      expect(remove).toHaveBeenCalled();
      expect(screen.getByTestId('favoritesCount')).toHaveTextContent('2');
      expect(screen.getByTestId('alert')).toHaveTextContent(
        'Removed from Favorites',
      );
    });

    it('shows error alert on Firebase remove failure', async () => {
      remove.mockRejectedValue(new Error('Permission denied'));

      const { contextRef } = renderWithContext();
      getFavorites.mockResolvedValueOnce([]);
      await act(async () =>
        authCallback({ uid: 'uid-123', email: 'user@test.com' }),
      );

      await act(async () => {
        await contextRef.current.removeFavorite('some-id');
      });

      expect(screen.getByTestId('alert')).toHaveTextContent(
        'There was an error while removing from Favorites',
      );
    });
  });

  describe('onAuthStateChanged', () => {
    it('sets user and fetches favorites when Firebase reports logged-in user', async () => {
      getFavorites.mockResolvedValue(currentFavorites);

      renderWithContext();

      await act(async () =>
        authCallback({ uid: 'uid-abc', email: 'auto@test.com' }),
      );

      expect(getFavorites).toHaveBeenCalledWith('uid-abc');
      expect(screen.getByTestId('currentUser')).toHaveTextContent(
        'auto@test.com',
      );
      expect(screen.getByTestId('favoritesCount')).toHaveTextContent('3');
    });

    it('does not set user when Firebase reports no user', async () => {
      renderWithContext();

      await act(async () => authCallback(null));

      expect(screen.getByTestId('currentUser')).toHaveTextContent('none');
      expect(screen.getByTestId('favoritesCount')).toHaveTextContent('0');
    });
  });

  describe('activateLogin / deactivateLogin', () => {
    it('toggles shouldShowLogin', async () => {
      const { contextRef } = renderWithContext();
      await act(async () => authCallback(null));

      expect(screen.getByTestId('shouldShowLogin')).toHaveTextContent('false');

      await act(async () => {
        contextRef.current.activateLogin();
      });
      expect(screen.getByTestId('shouldShowLogin')).toHaveTextContent('true');

      await act(async () => {
        contextRef.current.deactivateLogin();
      });
      expect(screen.getByTestId('shouldShowLogin')).toHaveTextContent('false');
    });
  });
});
