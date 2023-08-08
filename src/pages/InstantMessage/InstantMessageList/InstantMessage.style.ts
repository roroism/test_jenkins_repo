import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FontAwesomeIcon as MuiFontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const IsmListGrid = css`
  & > *:nth-of-type(1) {
    flex: 1 1 0%;
    max-width: 350px;
    text-align: center;
  }
  & > *:nth-of-type(2) {
    flex: 1 1 0%;
    text-align: center;
  }
  & > *:nth-of-type(3) {
    flex: 1 1 0%;
    max-width: 200px;
  }
  @media (max-width: 750px) {
    & > *:nth-of-type(3) {
      display: none;
    }
  }
  & > *:nth-of-type(4) {
    flex: 0 0 200px;
  }
  @media (max-width: 1000px) {
    & > *:nth-of-type(4) {
      display: none;
    }
  }
  & > *:nth-of-type(5) {
    width: 120px;
    text-align: center;
  }
`;

export const FontAwesomeIcon = styled(MuiFontAwesomeIcon)`
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;