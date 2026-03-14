import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Search from './_children/Search';
import NavControls from './_children/NavControls';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 1;
  top: 0;
  background-color: rgb(24, 24, 24, 0.99);
  width: 100%;
  height: 64px;
  padding: 16px;

  * {
    text-align: center;
    height: 34px;
  }

  *:focus {
    outline: none;
  }
`;

const HomeLink = styled(Link)`
  font-family: 'Oswald', sans-serif;
  font-size: 24px;
  color: #c0c0c0;
  white-space: nowrap;
  opacity: 0.7;
  :hover {
    opacity: 1;
  }
`;

const Header = () => {
  return (
    <Container>
      <HomeLink to='/'>YouTubit</HomeLink>
      <Search />
      <NavControls />
    </Container>
  );
};

export default Header;
