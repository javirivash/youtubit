import React from 'react';
import { render, screen } from '@testing-library/react';
import FavoritesView from './FavoritesView';
import AppContext from '../../context/app/appContext';
import { currentUser, currentFavorites } from '../../utils/testMocks';
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/favorites' }),
}));

describe('FavoritesView', () => {
  const renderComponent = (contextValue = {}) => {
    render(
      <AppContext.Provider
        value={{
          currentUser,
          currentFavorites,
          loading: false,
          ...contextValue,
        }}
      >
        <FavoritesView />
      </AppContext.Provider>,
    );
  };

  it('renders videos list', () => {
    renderComponent();
    expect(screen.getByRole('videoList')).toBeInTheDocument();
  });

  it('renders favorite videos as video items', () => {
    renderComponent();
    expect(screen.getAllByRole('videoItem').length).toBe(
      currentFavorites.length,
    );
  });

  it('renders empty list when there are no favorite videos', () => {
    renderComponent({ currentFavorites: [] });
    const list = screen.getByRole('videoList');
    expect(list).toBeInTheDocument();
    expect(list.children.length).toBe(0);
  });
});
