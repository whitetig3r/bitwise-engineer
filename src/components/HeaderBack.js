import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

import { FixedBar } from '../components';
import { DarkModeToggle } from './DarkModeToggle';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HeaderWrapper = styled(FixedBar)`
  justify-content: space-between;
`;

export const HeaderBack = () => {
  return (
    <HeaderWrapper>
      <Link to="/">
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </Link>
      <DarkModeToggle />
    </HeaderWrapper>
  );
};
