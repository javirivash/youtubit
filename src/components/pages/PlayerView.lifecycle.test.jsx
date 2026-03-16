import React from 'react';
import { render } from '@testing-library/react';
import AppContext from '../../context/app/appContext';
import { currentUser, selectedVideo, relatedVideos } from '../../utils/testMocks';

// Must declare mock before imports that use it
let mockVideoId = selectedVideo.id;
vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/player' }),
  useNavigate: () => vi.fn(),
  useParams: () => ({ videoId: mockVideoId }),
}));

// Import after mock setup
import PlayerView from './PlayerView';
import FavoritesPlayer from './FavoritesPlayer';

describe('PlayerView lifecycle', () => {
  const loadPlayerById = vi.fn();

  const renderPlayerView = (contextOverrides = {}) =>
    render(
      <AppContext.Provider
        value={{
          currentUser,
          selectedVideo,
          relatedVideos,
          currentFavorites: [],
          loading: false,
          loadPlayerById,
          ...contextOverrides,
        }}
      >
        <PlayerView />
      </AppContext.Provider>,
    );

  const renderFavoritesPlayer = (contextOverrides = {}) =>
    render(
      <AppContext.Provider
        value={{
          currentUser,
          selectedVideo,
          currentFavorites: [selectedVideo],
          loading: false,
          loadPlayerById,
          ...contextOverrides,
        }}
      >
        <FavoritesPlayer />
      </AppContext.Provider>,
    );

  beforeEach(() => {
    vi.clearAllMocks();
    mockVideoId = selectedVideo.id;
  });

  it('calls loadPlayerById with includeRelated: true on PlayerView mount', () => {
    renderPlayerView();
    expect(loadPlayerById).toHaveBeenCalledWith({
      videoId: selectedVideo.id,
      includeRelated: true,
    });
  });

  it('calls loadPlayerById with includeRelated: false on FavoritesPlayer mount', () => {
    renderFavoritesPlayer();
    expect(loadPlayerById).toHaveBeenCalledWith({
      videoId: selectedVideo.id,
      includeRelated: false,
    });
  });

  it('re-calls loadPlayerById when videoId param changes on PlayerView', () => {
    const { rerender } = renderPlayerView();
    expect(loadPlayerById).toHaveBeenCalledTimes(1);

    mockVideoId = 'new-video-id';
    rerender(
      <AppContext.Provider
        value={{
          currentUser,
          selectedVideo,
          relatedVideos,
          currentFavorites: [],
          loading: false,
          loadPlayerById,
        }}
      >
        <PlayerView />
      </AppContext.Provider>,
    );

    expect(loadPlayerById).toHaveBeenCalledTimes(2);
    expect(loadPlayerById).toHaveBeenLastCalledWith({
      videoId: 'new-video-id',
      includeRelated: true,
    });
  });

  it('re-calls loadPlayerById when videoId param changes on FavoritesPlayer', () => {
    const { rerender } = renderFavoritesPlayer();
    expect(loadPlayerById).toHaveBeenCalledTimes(1);

    mockVideoId = 'new-video-id';
    rerender(
      <AppContext.Provider
        value={{
          currentUser,
          selectedVideo,
          currentFavorites: [selectedVideo],
          loading: false,
          loadPlayerById,
        }}
      >
        <FavoritesPlayer />
      </AppContext.Provider>,
    );

    expect(loadPlayerById).toHaveBeenCalledTimes(2);
    expect(loadPlayerById).toHaveBeenLastCalledWith({
      videoId: 'new-video-id',
      includeRelated: false,
    });
  });
});
