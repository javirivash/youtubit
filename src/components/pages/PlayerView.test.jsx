import React from 'react';
import { render, screen } from '@testing-library/react';
import PlayerView from './PlayerView';
import AppContext from '../../context/app/appContext';
import {
  currentUser,
  selectedVideo,
  relatedVideos,
} from '../../utils/testMocks';
vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/player' }),
  useNavigate: () => vi.fn(),
  useParams: () => ({ videoId: selectedVideo.id }),
}));

describe('PlayerView', () => {
  const loadPlayerById = vi.fn();
  const renderComponent = (contextValue = {}) => {
    render(
      <AppContext.Provider
        value={{
          currentUser,
          selectedVideo,
          relatedVideos,
          loading: false,
          loadPlayerById,
          ...contextValue,
        }}
      >
        <PlayerView />
      </AppContext.Provider>,
    );
  };

  it('renders iframe including link to the selected video', () => {
    const videoLink = `https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`;
    renderComponent();
    const iframe = screen.getByRole('presentation');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', videoLink);
  });

  it('renders player details', () => {
    renderComponent();
    expect(screen.getByRole('playerDetails')).toBeInTheDocument();
  });

  it('renders videos list title', () => {
    renderComponent();
    expect(
      screen.getByRole('heading', { name: /More videos you may like/i }),
    ).toBeInTheDocument();
  });

  it('renders videos list', () => {
    renderComponent();
    expect(screen.getByRole('videoList')).toBeInTheDocument();
  });
});
