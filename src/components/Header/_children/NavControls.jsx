import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAppContext } from '../../../context/app/appContext';
import LoginButton, { FavoritesLink } from './LoginButton';
import ThemeToggle from './ThemeToggle';

const MOBILE_BREAKPOINT = '700px';

const DesktopControls = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: none;
  }
`;

const MobileControls = styled.div`
  display: none;
  position: relative;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: flex;
    align-items: center;
  }
`;

const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c0c0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  height: 34px;
  width: 34px;
  font-size: 24px;
  transition: transform 0.3s ease-out, opacity 0.2s ease-out;
  transform: ${(props) => (props.$isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
  :hover {
    opacity: 1;
  }
`;

const Dropdown = styled.div`
  position: fixed;
  top: 64px;
  right: 0;
  background-color: rgb(28, 28, 28, 0.99);
  border-left: 1px solid #333;
  border-bottom: 1px solid #333;
  border-radius: 0 0 0 8px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  min-width: 150px;
  overflow: hidden;
  transform-origin: top right;
  animation: ${(props) => (props.$closing ? 'dropdownSlideUp' : 'dropdownSlideDown')} 0.25s ease-out forwards;

  @keyframes dropdownSlideDown {
    from { clip-path: inset(0 0 100% 0); }
    to { clip-path: inset(0 0 0 0); }
  }

  @keyframes dropdownSlideUp {
    from { clip-path: inset(0 0 0 0); }
    to { clip-path: inset(0 0 100% 0); }
  }

  & > *:last-child {
    border-bottom: none;
  }
`;

const rowStyles = `
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border-bottom: 1px solid #2a2a2a;
  color: #c0c0c0;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  background: transparent;
  border-top: none;
  border-left: none;
  border-right: none;
  box-sizing: border-box;
  :last-child {
    border-bottom: none;
  }
  :hover {
    background-color: #2a2a2a;
  }
`;

const ThemeRow = styled.div`
  ${rowStyles}
  cursor: default;
  :hover {
    background-color: transparent;
  }
`;

const DropdownLink = styled(Link)`
  ${rowStyles}
  cursor: pointer;
`;

const DropdownRow = styled.button`
  ${rowStyles}
  cursor: pointer;
  text-align: left;
`;

const DropdownIcon = styled.span`
  font-size: 18px;
  flex-shrink: 0;
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 64px 0 0 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.4);
  animation: ${(props) => (props.$closing ? 'backdropFadeOut' : 'backdropFadeIn')} 0.25s ease-out forwards;

  @keyframes backdropFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes backdropFadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

const ANIMATION_MS = 250;

const NavControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { currentUser, logOutUser, activateLogin } = useAppContext();

  const close = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, ANIMATION_MS);
  };

  return (
    <>
      <DesktopControls>
        <ThemeToggle />
        {currentUser.isLoggedIn && (
          <FavoritesLink to='/favorites'>
            <span
              className='material-icons'
              style={{
                fontSize: 16,
                height: 'auto',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              favorite
            </span>
            Favorites
          </FavoritesLink>
        )}
        <LoginButton />
      </DesktopControls>

      <MobileControls>
        <HamburgerButton
          onClick={() => (isOpen ? close() : setIsOpen(true))}
          aria-label='Menu'
          className='material-icons'
          $isOpen={isOpen && !isClosing}
        >
          {isOpen && !isClosing ? 'close' : 'menu'}
        </HamburgerButton>

        {isOpen &&
          createPortal(
            <>
              <Backdrop onClick={close} $closing={isClosing} />
              <Dropdown $closing={isClosing}>
                <ThemeRow>
                  <ThemeToggle />
                  <span>Theme</span>
                </ThemeRow>
                {currentUser.isLoggedIn && (
                  <DropdownLink to='/favorites' onClick={close}>
                    <DropdownIcon className='material-icons'>
                      favorite
                    </DropdownIcon>
                    Favorites
                  </DropdownLink>
                )}
                <DropdownRow
                  onClick={() => {
                    currentUser.isLoggedIn ? logOutUser() : activateLogin();
                    close();
                  }}
                >
                  <DropdownIcon className='material-icons'>
                    {currentUser.isLoggedIn ? 'logout' : 'person'}
                  </DropdownIcon>
                  {currentUser.isLoggedIn ? 'Log out' : 'Sign up'}
                </DropdownRow>
              </Dropdown>
            </>,
            document.body,
          )}
      </MobileControls>
    </>
  );
};

export default NavControls;
