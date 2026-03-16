import React from 'react';
import { render, screen } from '@testing-library/react';
import AppContext from '../../context/app/appContext';
import { currentUser, resultVideos } from '../../utils/testMocks';
import HomeView from './HomeView';
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

describe('HomeView', () => {
  const searchText = '';
  const renderComponent = (contextValue = {}) => {
    render(
      <AppContext.Provider
        value={{
          searchText,
          currentUser,
          resultVideos,
          loading: false,
          ...contextValue,
        }}
      >
        <HomeView />
      </AppContext.Provider>,
    );
  };

  it('renders the videos list', () => {
    renderComponent();
    expect(screen.getByRole('videoList')).toBeInTheDocument();
  });

  it('renders the videos array provided as videoItem components', () => {
    renderComponent();
    expect(screen.getAllByRole('videoItem').length).toBe(resultVideos.length);
  });
});
