import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../context/app/themes';
import NotFound from './NotFound';
vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/badroute' }),
}));

describe('NotFound', () => {
  const renderComponent = () => {
    render(
      <ThemeProvider theme={lightTheme}>
        <NotFound />
      </ThemeProvider>,
    );
  };

  it('renders Not Found title', () => {
    renderComponent();
    expect(
      screen.getByRole('heading', { name: /Page Not Found/i }),
    ).toBeInTheDocument();
  });

  it('renders description including the pathname not found', () => {
    renderComponent();
    expect(
      screen.getByRole('heading', {
        name: /No page matches the route \/badroute/i,
      }),
    ).toBeInTheDocument();
  });
});
