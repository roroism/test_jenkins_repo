import { css } from '@emotion/react';

export const LogListGrid = css`
  & > *:nth-of-type(1) {
    width: 100px;
    text-align: left;
  }
  & > *:nth-of-type(2) {
    width: 100px;
    max-width: 200px;
    text-align: left;
  }
  & > *:nth-of-type(3) {
    width: 150px;
    text-align: left;
  }
  @media (max-width: 1200px) {
    & > *:nth-of-type(3) {
      display: none;
    }
  }
  & > *:nth-of-type(4) {
    flex: 1 1 0%;
    text-align: left;
  }
  & > *:nth-of-type(5) {
    width: 150px;
  }
`;
