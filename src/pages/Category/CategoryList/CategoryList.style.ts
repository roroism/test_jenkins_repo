import { css } from '@emotion/react';

export const CategoryListGrid = css`
  & > *:nth-of-type(1) {
    flex: 0 0 50px;
    text-align: center;
  }
  & > *:nth-of-type(2) {
    flex: 1 0 150px;
    word-wrap: break-word;
    text-align: center;
  }
  & > *:nth-of-type(3) {
    flex: 1 0 100px;
    /* max-width: 100px; */
    text-align: center;
  }
  & > *:nth-of-type(4) {
    flex: 1 0 70px;
    text-align: center;
    /* min-width: 70px; */
  }
  & > *:nth-of-type(5) {
    flex: 1 0 70px;
    text-align: center;
  }
  @media (max-width: 850px) {
    & > *:nth-of-type(5) {
      display: none;
    }
  }
  & > *:nth-of-type(6) {
    flex: 1 0 70px;
    text-align: center;
  }
  & > *:nth-of-type(7) {
    flex: 0 0 100px;
    text-align: center;
  }
`;
