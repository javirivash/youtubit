import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppContext from '../../context/app/appContext';
import LoginView from './LoginView';

describe('LoginView', () => {
  const deactivateLogin = vi.fn();
  const signUpUser = vi.fn();
  const logInUser = vi.fn();

  const renderComponent = (contextValue = {}) => {
    render(
      <AppContext.Provider
        value={{
          deactivateLogin,
          signUpUser,
          logInUser,
          ...contextValue,
        }}
      >
        <LoginView />
      </AppContext.Provider>,
    );
  };

  describe('Sign up form', () => {
    it('initially renders Sign up form for new users', () => {
      renderComponent();
      const signUpHeading = screen.getByRole('heading', {
        name: /Enter a new email and password/i,
      });
      expect(signUpHeading).toBeInTheDocument();
    });

    it('calls signUpUser with email and password values', async () => {
      renderComponent();
      const someEmail = 'someemail@example.com';
      const somePassword = 'S4fePassw0rd.';
      await userEvent.type(screen.getByPlaceholderText('Email'), someEmail);
      await userEvent.type(
        screen.getByPlaceholderText('Password'),
        somePassword,
      );
      await userEvent.click(screen.getByRole('button', { name: /Sign up/i }));
      expect(signUpUser).toHaveBeenCalledWith(someEmail, somePassword);
    });

    it('switches to the Log in form by clicking the toggle', async () => {
      renderComponent();
      await userEvent.click(screen.getByRole('button', { name: /Log in/i }));
      const logInHeading = screen.getByRole('heading', {
        name: /Enter your email and password/i,
      });
      expect(logInHeading).toBeInTheDocument();
    });

    it('calls deactivateLogin when clicking the close button', async () => {
      renderComponent();
      await userEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(deactivateLogin).toHaveBeenCalled();
    });
  });

  describe('Log in form', () => {
    it('calls logInUser with email and password values', async () => {
      renderComponent();
      const email = 'knownemail@example.com';
      const password = 'S4f3RP4ssw0rd$';
      await userEvent.click(screen.getByRole('button', { name: /Log in/i }));
      await userEvent.type(screen.getByPlaceholderText('Email'), email);
      await userEvent.type(
        screen.getByPlaceholderText('Password'),
        password,
      );
      await userEvent.click(screen.getByRole('button', { name: /Log in/i }));
      expect(logInUser).toHaveBeenCalled();
    });

    it('switches back to the Sign up form by clicking the toggle', async () => {
      renderComponent();
      await userEvent.click(screen.getByRole('button', { name: /Log in/i }));
      await userEvent.click(screen.getByRole('button', { name: /Sign up/i }));
      const signUpHeading = screen.getByRole('heading', {
        name: /Enter a new email and password/i,
      });
      expect(signUpHeading).toBeInTheDocument();
    });
  });
});
