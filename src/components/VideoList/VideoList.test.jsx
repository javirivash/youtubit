import React, { Fragment } from 'react';
import { render, screen } from '@testing-library/react';
import AppContext from '../../context/app/appContext';
import { currentUser, resultVideos } from '../../utils/testMocks';
import VideoList from './VideoList';
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

describe('VideoList', () => {
  const title = <Fragment>This is the list title</Fragment>;
  const loading = false;
  const renderComponent = (contextValue = {}) => {
    render(
      <AppContext.Provider
        value={{
          currentUser,
          loading,
          ...contextValue,
        }}
      >
        <VideoList listTitle={title} videos={resultVideos} />
      </AppContext.Provider>,
    );
  };

  it('renders spinner when loading is true', () => {
    renderComponent({ loading: true });
    expect(
      screen.getByRole('img', { name: /Loading.../i }),
    ).toBeInTheDocument();
  });

  it('renders the list title passed as prop', () => {
    renderComponent();
    expect(
      screen.getByRole('heading', { name: /This is the list title/i }),
    ).toBeInTheDocument();
  });

  it('renders the videos container', () => {
    renderComponent();
    expect(screen.getByRole('videoList')).toBeInTheDocument();
  });

  it('renders the videos array provided as videoItem components', () => {
    renderComponent();
    expect(screen.getAllByRole('videoItem').length).toBe(resultVideos.length);
  });
});
