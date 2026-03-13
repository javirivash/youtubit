import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/app/appContext';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
  const { currentUser, authResolved } = useAppContext();
  if (!authResolved) return null;
  return currentUser?.isLoggedIn ? children : <Navigate to='/' replace />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
