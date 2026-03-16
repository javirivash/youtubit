import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppContext from '../../context/app/appContext';
import { currentUser, selectedVideo } from '../../utils/testMocks';
import VideoItem from './VideoItem';
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

describe('VideoItem', () => {
  const setSelectedVideo = vi.fn();
  const renderComponent = (contextValue = {}) => {
    render(
      <AppContext.Provider
        value={{
          currentUser,
          setSelectedVideo,
          ...contextValue,
        }}
      >
        <VideoItem video={selectedVideo} />
      </AppContext.Provider>,
    );
  };

  beforeAll(() => {
    window.scrollTo = vi.fn();
  });
  afterAll(() => {
    window.scrollTo.mockClear();
  });

  it('renders video details', () => {
    renderComponent();
    expect(screen.getByRole('videoItemDetails')).toBeInTheDocument();
  });

  it('renders thumbnail', () => {
    renderComponent();
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      selectedVideo.thumbnail,
    );
  });

  it('calls setSelectedVideo when clicking the item', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('videoItem'));
    expect(setSelectedVideo).toHaveBeenCalledWith(selectedVideo);
  });
});
