import React from 'react';
import { ThemeToggler } from 'gatsby-plugin-dark-mode';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';

import { BREAKPOINT } from '../utils/constants';

const MoonToggle = styled.div`
  height: 34px;
  max-width: 100%;
  max-height: 100%;
  width: 34px;
  align-self: center;
  cursor: pointer;
  @media (max-width: ${BREAKPOINT}px) {
    height: 28px;
    width: 28px;
  }
`;

export const DarkModeToggle = () => {
  return (
    <ThemeToggler>
      {({ theme, toggleTheme }) => (
        <MoonToggle>
          <FontAwesomeIcon
            icon={faMoon}
            size="lg"
            onClick={() =>
              theme === 'dark' ? toggleTheme('light') : toggleTheme('dark')
            }
          />
        </MoonToggle>
      )}
    </ThemeToggler>
  );
};
