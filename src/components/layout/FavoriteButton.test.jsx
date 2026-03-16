import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppContext from '../../context/app/appContext';
import { currentUser, selectedVideo } from '../../utils/testMocks';
import FavoriteButton from './FavoriteButton';

describe('FavoriteButton', () => {
  const addFavorite = vi.fn();
  const removeFavorite = vi.fn();
  const renderComponent = (contextValue = {}) => {
    render(
      <AppContext.Provider
        value={{
          currentUser,
          addFavorite,
          removeFavorite,
          ...contextValue,
        }}
      >
        <FavoriteButton video={selectedVideo} />
      </AppContext.Provider>,
    );
  };

  it('renders button when there is an user logged in', () => {
    renderComponent();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it("adds or removes the video from favorites each time it's clicked", async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('button'));
    expect(addFavorite).toHaveBeenCalledTimes(2);
    expect(removeFavorite).toHaveBeenCalledTimes(1);
    expect(addFavorite).toHaveBeenCalledWith({
      ...selectedVideo,
      isFavorite: true,
    });
    expect(removeFavorite).toHaveBeenCalledWith(selectedVideo.id);
    expect(selectedVideo.isFavorite).toBe(true);
  });

  it('does not render button when there is no user logged in', () => {
    renderComponent({ currentUser: {} });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
