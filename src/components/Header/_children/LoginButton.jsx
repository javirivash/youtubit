import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../../context/app/appContext';
import Modal from '../../layout/Modal';
import styled, { css } from 'styled-components';

export const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: #c0c0c0;
  background-color: transparent;
  border: solid 1px #c0c0c0;
  border-radius: 14px;
  margin-left: 10px;
  padding: 0 12px;
  width: 110px;
  height: 34px;
  cursor: pointer;
  opacity: 0.7;
  :hover {
    opacity: 1;
  }
  :focus {
    opacity: 1;
  }
`;

export const StyledButton = styled.button`
  ${buttonStyles}
`;

export const FavoritesLink = styled(Link)`
  ${buttonStyles}
`;

export const Icon = styled.span`
  font-size: 16px;
  height: auto;
  line-height: 1;
  display: flex;
  align-items: center;
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
    <>
      <StyledButton onClick={onClick}>
        {currentUser.isLoggedIn ? (
          <>
            <Icon className='material-icons'>logout</Icon>
            Log out
          </>
        ) : (
          <>
            <Icon className='material-icons'>person</Icon>
            Sign up
          </>
        )}
      </StyledButton>
      <Modal />
    </>
  );
};

export default LoginButton;
