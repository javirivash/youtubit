import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppContext from '../../../context/app/appContext';
import { currentUser } from '../../../utils/testMocks';
import LoginButton from './LoginButton';

describe('LoginButton', () => {
  const shouldShowLogin = false;
  const activateLogin = vi.fn();
  const logOutUser = vi.fn();
  const renderComponent = (contextValue = {}) => {
    render(
      <AppContext.Provider
        value={{
          currentUser,
          shouldShowLogin,
          activateLogin,
          logOutUser,
          ...contextValue,
        }}
      >
        <LoginButton />
      </AppContext.Provider>,
    );
  };

  describe('when there is an user logged in', () => {
    it("renders with the text 'Log out'", () => {
      renderComponent();
      expect(
        screen.getByRole('button', { name: /Log out/i }),
      ).toBeInTheDocument();
    });

    it('logs out the current user when clicked', async () => {
      renderComponent();
      await userEvent.click(screen.getByRole('button'));
      expect(logOutUser).toHaveBeenCalled();
    });
  });

  describe('when no user is logged in', () => {
    it("renders with the text 'Sign up'", () => {
      renderComponent({ currentUser: {} });
      expect(
        screen.getByRole('button', { name: /Sign up/i }),
      ).toBeInTheDocument();
    });

    it('activates the log in view when clicked', async () => {
      renderComponent({ currentUser: {} });
      await userEvent.click(screen.getByRole('button'));
      expect(activateLogin).toHaveBeenCalled();
    });
  });
});
