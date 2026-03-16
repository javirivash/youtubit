import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppContext from '../../context/app/appContext';
import AlertContext from '../../context/alert/alertContext';
import { currentUser } from '../../utils/testMocks';
import Header from './Header';

describe('Header', () => {
  const shouldShowLogin = true;
  const setAlert = vi.fn();
  const activateLogin = vi.fn();
  const logOutUser = vi.fn();
  const toggleTheme = vi.fn();
  const getResultVideos = vi.fn();

  const renderComponent = (contextValue = {}) => {
    render(
      <MemoryRouter>
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
        </AlertContext.Provider>
      </MemoryRouter>,
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

  it('renders search input', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('renders theme toggle', () => {
    renderComponent();
    expect(
      screen.getByRole('button', { name: 'Toggle theme' }),
    ).toBeInTheDocument();
  });
});
