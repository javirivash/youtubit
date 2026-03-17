import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppContext from '../../context/app/appContext';
import { currentUser, selectedVideo } from '../../utils/testMocks';
import VideoItem from './VideoItem';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
}));

let mockPathname = '/';

beforeEach(() => {
  vi.clearAllMocks();
  mockPathname = '/';
  window.scrollTo = vi.fn();
});

const renderComponent = () =>
  render(
    <AppContext.Provider
      value={{ currentUser, setSelectedVideo: vi.fn() }}
    >
      <VideoItem video={selectedVideo} />
    </AppContext.Provider>,
  );

describe('VideoItem navigation', () => {
  it('navigates to /player/:id when on home page', async () => {
    mockPathname = '/';
    renderComponent();

    await userEvent.click(screen.getByRole('videoItem'));

    expect(mockNavigate).toHaveBeenCalledWith(
      `/player/${selectedVideo.id}`,
    );
  });

  it('navigates to /player/:id when on player page', async () => {
    mockPathname = '/player/some-other-id';
    renderComponent();

    await userEvent.click(screen.getByRole('videoItem'));

    expect(mockNavigate).toHaveBeenCalledWith(
      `/player/${selectedVideo.id}`,
    );
  });

  it('navigates to /favorites/player/:id when on favorites page', async () => {
    mockPathname = '/favorites';
    renderComponent();

    await userEvent.click(screen.getByRole('videoItem'));

    expect(mockNavigate).toHaveBeenCalledWith(
      `/favorites/player/${selectedVideo.id}`,
    );
  });

  it('navigates to /favorites/player/:id when on favorites player page', async () => {
    mockPathname = '/favorites/player/some-other-id';
    renderComponent();

    await userEvent.click(screen.getByRole('videoItem'));

    expect(mockNavigate).toHaveBeenCalledWith(
      `/favorites/player/${selectedVideo.id}`,
    );
  });
});
