import styled from 'styled-components';

import { TextBody } from '../components';
import { BREAKPOINT } from '../utils/constants';

export const TextDate = styled(TextBody)`
  font-size: 16px;
  display: inline;
  @media (max-width: ${BREAKPOINT}px) {
    font-size: 15px;
  }
`;
