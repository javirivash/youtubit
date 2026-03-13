import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../../context/app/appContext';
import Modal from '../../layout/Modal';
import styled from 'styled-components';

const buttonStyles = `
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: #c0c0c0;
  background-color: transparent;
  border: solid 1px #c0c0c0;
  border-radius: 14px;
  margin-right: 10px;
  padding: 8px 12px;
  min-width: 74px;
  cursor: pointer;
  opacity: 0.7;
  :hover {
    opacity: 1;
  }
  :focus {
    opacity: 1;
  }
`;

const StyledButton = styled.button`
  justify-self: end;
  ${buttonStyles}
`;

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${buttonStyles}
`;

const LoginButton = () => {
  const { currentUser, activateLogin, logOutUser } = useAppContext();

  const onClick = () => {
    if (currentUser.isLoggedIn) {
      logOutUser();
    } else {
      activateLogin();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {currentUser.isLoggedIn && (
        <StyledLink to='/favorites'>Favorites</StyledLink>
      )}
      <StyledButton onClick={onClick}>
        {currentUser.isLoggedIn ? 'Log out' : 'Sign up'}
      </StyledButton>
      <Modal />
    </div>
  );
};

export default LoginButton;
