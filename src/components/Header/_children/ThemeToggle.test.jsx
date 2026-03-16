import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppContext from '../../../context/app/appContext';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  const toggleTheme = vi.fn();
  const renderComponent = (contextValue = {}) => {
    render(
      <AppContext.Provider
        value={{
          toggleTheme,
          ...contextValue,
        }}
      >
        <ThemeToggle />
      </AppContext.Provider>,
    );
  };

  it("toggles the theme every time it's clicked", async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('button'));
    expect(toggleTheme).toHaveBeenCalledTimes(4);
  });
});
