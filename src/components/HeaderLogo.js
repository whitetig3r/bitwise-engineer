import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

import { FixedBar } from '../components';
import { BREAKPOINT } from '../utils/constants';
import { DarkModeToggle } from './DarkModeToggle';

const HeaderWrapper = styled(FixedBar)`
  justify-content: space-between;
`;

const ToggleAboutWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 6em;
`;

const Logo = styled.p`
  font-size: 32px;
  font-weight: 700;

  @media (max-width: ${BREAKPOINT}px) {
    font-size: 28px;
  }
`;

export const HeaderLogo = () => {
  return (
    <HeaderWrapper>
      <Logo>bitwise</Logo>
      <ToggleAboutWrapper>
        <Link to="/about">
          <p>About</p>
        </Link>
        <DarkModeToggle />
      </ToggleAboutWrapper>
    </HeaderWrapper>
  );
};
