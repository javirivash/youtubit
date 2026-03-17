import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import AppContext from './context/app/appContext';
import AlertContext from './context/alert/alertContext';
import { lightTheme } from './context/app/themes';
import HomeView from './components/pages/HomeView';
import PlayerView from './components/pages/PlayerView';
import FavoritesView from './components/pages/FavoritesView';
import FavoritesPlayer from './components/pages/FavoritesPlayer';
import PrivateRoute from './components/pages/PrivateRoute';
import NotFound from './components/pages/NotFound';
import {
  currentUser,
  selectedVideo,
  relatedVideos,
  resultVideos,
  currentFavorites,
} from './utils/testMocks';

const alertValue = { alert: null, setAlert: vi.fn(), removeAlert: vi.fn() };

const renderWithRouter = (initialPath, { isLoggedIn = false, authResolved = true } = {}) => {
  const user = isLoggedIn ? currentUser : {};

  return render(
    <AlertContext.Provider value={alertValue}>
      <AppContext.Provider
        value={{
          currentUser: user,
          authResolved,
          selectedVideo,
          relatedVideos,
          resultVideos,
          currentFavorites: isLoggedIn ? currentFavorites : [],
          loading: false,
          loadPlayerById: vi.fn(),
          setSelectedVideo: vi.fn(),
          getResultVideos: vi.fn(),
          theme: 'light',
        }}
      >
        <MemoryRouter initialEntries={[initialPath]}>
          <ThemeProvider theme={lightTheme}>
            <Routes>
              <Route
                path="/favorites/player/:videoId"
                element={
                  <PrivateRoute>
                    <FavoritesPlayer />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <PrivateRoute>
                    <FavoritesView />
                  </PrivateRoute>
                }
              />
              <Route path="/player/:videoId" element={<PlayerView />} />
              <Route path="/" element={<HomeView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </MemoryRouter>
      </AppContext.Provider>
    </AlertContext.Provider>,
  );
};

describe('Routing integration', () => {
  it('renders HomeView at /', () => {
    renderWithRouter('/');
    expect(screen.getByRole('videoList')).toBeInTheDocument();
  });

  it('renders PlayerView at /player/:videoId', () => {
    renderWithRouter(`/player/${selectedVideo.id}`);
    const iframe = screen.getByRole('presentation');
    expect(iframe).toHaveAttribute(
      'src',
      `https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`,
    );
  });

  it('renders FavoritesView at /favorites when logged in', () => {
    renderWithRouter('/favorites', { isLoggedIn: true });
    expect(screen.getByRole('videoList')).toBeInTheDocument();
  });

  it('renders FavoritesPlayer at /favorites/player/:videoId when logged in', () => {
    renderWithRouter(`/favorites/player/${selectedVideo.id}`, { isLoggedIn: true });
    const iframe = screen.getByRole('presentation');
    expect(iframe).toHaveAttribute(
      'src',
      `https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`,
    );
  });

  it('redirects /favorites to / when not logged in', () => {
    renderWithRouter('/favorites', { isLoggedIn: false });
    // Should render HomeView (redirected to /)
    expect(screen.getByRole('videoList')).toBeInTheDocument();
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('redirects /favorites/player/:videoId to / when not logged in', () => {
    renderWithRouter(`/favorites/player/${selectedVideo.id}`, { isLoggedIn: false });
    expect(screen.getByRole('videoList')).toBeInTheDocument();
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('renders NotFound for unmatched routes', () => {
    renderWithRouter('/some/random/path');
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText(/\/some\/random\/path/)).toBeInTheDocument();
  });

  it('renders nothing for private routes while auth is resolving', () => {
    renderWithRouter('/favorites', {
      isLoggedIn: false,
      authResolved: false,
    });
    // PrivateRoute returns null when authResolved is false
    expect(screen.queryByRole('videoList')).not.toBeInTheDocument();
    expect(screen.queryByText('Page Not Found')).not.toBeInTheDocument();
  });
});
