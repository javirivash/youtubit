import React from 'react';
import { render, screen, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import AppContext from '../../../context/app/appContext';
import AlertContext from '../../../context/alert/alertContext';
import { lightTheme } from '../../../context/app/themes';
import NavControls from './NavControls';

const logOutUser = vi.fn();
const activateLogin = vi.fn();
const toggleTheme = vi.fn();

const renderComponent = ({ isLoggedIn = false } = {}) => {
  const currentUser = isLoggedIn
    ? { id: 'uid-1', email: 'test@test.com', isLoggedIn: true }
    : {};

  return render(
    <AlertContext.Provider value={{ alert: null, setAlert: vi.fn() }}>
      <AppContext.Provider
        value={{
          currentUser,
          logOutUser,
          activateLogin,
          toggleTheme,
          theme: 'light',
        }}
      >
        <MemoryRouter>
          <ThemeProvider theme={lightTheme}>
            <NavControls />
          </ThemeProvider>
        </MemoryRouter>
      </AppContext.Provider>
    </AlertContext.Provider>,
  );
};

// The dropdown is portaled to document.body as a direct child div.
// "Theme" text only appears in the dropdown, so we use it as an anchor.
const getDropdown = () => screen.getByText('Theme').closest('div[class]').parentElement;

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('NavControls', () => {
  describe('hamburger toggle', () => {
    it('opens dropdown when hamburger is clicked', async () => {
      renderComponent();
      await userEvent.click(screen.getByLabelText('Menu'));

      expect(screen.getByText('Theme')).toBeInTheDocument();
    });

    it('closes dropdown when hamburger is clicked again', async () => {
      renderComponent();
      const hamburger = screen.getByLabelText('Menu');

      await userEvent.click(hamburger);
      expect(screen.getByText('Theme')).toBeInTheDocument();

      await userEvent.click(hamburger);
      act(() => vi.advanceTimersByTime(250));

      expect(screen.queryByText('Theme')).not.toBeInTheDocument();
    });
  });

  describe('dropdown items by auth state', () => {
    it('shows "Sign up" and no Favorites link when logged out', async () => {
      renderComponent({ isLoggedIn: false });
      await userEvent.click(screen.getByLabelText('Menu'));

      const dropdown = getDropdown();
      expect(within(dropdown).getByText('Sign up')).toBeInTheDocument();
      expect(within(dropdown).queryByText('Favorites')).not.toBeInTheDocument();
    });

    it('shows "Log out" and Favorites link when logged in', async () => {
      renderComponent({ isLoggedIn: true });
      await userEvent.click(screen.getByLabelText('Menu'));

      const dropdown = getDropdown();
      expect(within(dropdown).getByText('Log out')).toBeInTheDocument();
      expect(within(dropdown).getByText('Favorites')).toBeInTheDocument();
    });
  });

  describe('close behaviors', () => {
    it('closes dropdown on backdrop click', async () => {
      renderComponent();
      await userEvent.click(screen.getByLabelText('Menu'));
      expect(screen.getByText('Theme')).toBeInTheDocument();

      // Backdrop is the portaled sibling before the dropdown
      const dropdown = getDropdown();
      const backdrop = dropdown.previousElementSibling;
      await userEvent.click(backdrop);
      act(() => vi.advanceTimersByTime(250));

      expect(screen.queryByText('Theme')).not.toBeInTheDocument();
    });

    it('closes dropdown when Favorites link is clicked', async () => {
      renderComponent({ isLoggedIn: true });
      await userEvent.click(screen.getByLabelText('Menu'));

      const dropdown = getDropdown();
      await userEvent.click(within(dropdown).getByText('Favorites'));
      act(() => vi.advanceTimersByTime(250));

      expect(screen.queryByText('Theme')).not.toBeInTheDocument();
    });

    it('calls logOutUser and closes when "Log out" is clicked', async () => {
      renderComponent({ isLoggedIn: true });
      await userEvent.click(screen.getByLabelText('Menu'));

      const dropdown = getDropdown();
      await userEvent.click(within(dropdown).getByText('Log out'));
      act(() => vi.advanceTimersByTime(250));

      expect(logOutUser).toHaveBeenCalled();
      expect(screen.queryByText('Theme')).not.toBeInTheDocument();
    });

    it('calls activateLogin and closes when "Sign up" is clicked', async () => {
      renderComponent({ isLoggedIn: false });
      await userEvent.click(screen.getByLabelText('Menu'));

      const dropdown = getDropdown();
      await userEvent.click(within(dropdown).getByText('Sign up'));
      act(() => vi.advanceTimersByTime(250));

      expect(activateLogin).toHaveBeenCalled();
      expect(screen.queryByText('Theme')).not.toBeInTheDocument();
    });
  });
});
