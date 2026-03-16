import React from 'react';
import { render, screen } from '@testing-library/react';
import AppContext from '../../context/app/appContext';
import AlertContext from '../../context/alert/alertContext';
import { currentUser } from '../../utils/testMocks';
import Header from './Header';
vi.mock('react-router-dom', () => ({
  ...vi.requireActual('react-router-dom'),
  useHistory: () => [],
  useLocation: () => ({ pathname: '/' }),
}));

describe('Header', () => {
  const shouldShowLogin = true;
  const setAlert = vi.fn();
  const activateLogin = vi.fn();
  const logOutUser = vi.fn();
  const toggleTheme = vi.fn();
  const getResultVideos = vi.fn();

  const renderComponent = (contextValue = {}) => {
    render(
      <AlertContext.Provider value={{ setAlert }}>
        <AppContext.Provider
          value={{
            currentUser,
            shouldShowLogin,
            getResultVideos,
            activateLogin,
            logOutUser,
            toggleTheme,
            ...contextValue,
          }}
        >
          <Header />
        </AppContext.Provider>
      </AlertContext.Provider>,
    );
  };

  beforeAll(() => {
    window.scrollTo = vi.fn();
    window.scroll = vi.fn();
  });
  afterAll(() => {
    window.scrollTo.mockClear();
    window.scroll.mockClear();
  });

  it('renders menu button', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'menu' })).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('renders sign up button', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
  });

  it('renders theme toggle', () => {
    renderComponent();
    expect(
      screen.getByRole('button', { name: 'dark_mode' }),
    ).toBeInTheDocument();
  });
});
