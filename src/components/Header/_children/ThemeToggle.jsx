import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../../context/app/appContext';

const Switch = styled.button`
  display: flex;
  align-items: center;
  background-color: rgb(24, 24, 24);
  border: 1px solid #c0c0c0;
  border-radius: 20px;
  width: 56px;
  height: 34px;
  padding: 0 4px;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  opacity: 0.7;
  :hover {
    opacity: 1;
  }
  :focus {
    opacity: 1;
  }
`;

const Knob = styled.span`
  position: absolute;
  left: ${(props) => (props.$isDark ? '30px' : '4px')};
  top: 50%;
  transform: translateY(-50%);
  transition: left 0.2s ease;
  font-size: 18px;
  line-height: 1;
  height: auto !important;
  color: #c0c0c0;
`;

const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppContext();
  const isDark = theme === 'dark';

  return (
    <Switch onClick={toggleTheme} aria-label='Toggle theme'>
      <Knob $isDark={isDark} className='material-icons'>
        {isDark ? 'dark_mode' : 'light_mode'}
      </Knob>
    </Switch>
  );
};

export default ThemeToggle;
