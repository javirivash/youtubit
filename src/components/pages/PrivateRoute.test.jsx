import React from 'react';
import { render, screen } from '@testing-library/react';
import AppContext from '../../context/app/appContext';
import { currentUser } from '../../utils/testMocks';
import { MemoryRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

describe('PrivateRoute', () => {
  const renderComponent = (contextValue = {}) => {
    render(
      <AppContext.Provider
        value={{
          currentUser,
          authResolved: true,
          ...contextValue,
        }}
      >
        <MemoryRouter>
          <PrivateRoute>
            <h1>Renders Alright!</h1>
          </PrivateRoute>
        </MemoryRouter>
      </AppContext.Provider>,
    );
  };

  it('renders children when there is an user logged in', () => {
    renderComponent();
    expect(
      screen.getByRole('heading', { name: /Renders Alright!/i }),
    ).toBeInTheDocument();
  });

  it('does not render children when there is no user logged in', () => {
    renderComponent({ currentUser: {} });
    expect(
      screen.queryByRole('heading', { name: /Renders Alright!/i }),
    ).not.toBeInTheDocument();
  });
});
