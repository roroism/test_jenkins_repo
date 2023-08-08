import { css } from '@emotion/react';

export const CategoryListGrid = css`
  & > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & > *:nth-of-type(1) {
    flex: 1 1 0%;
    text-align: left;
  }
  & > *:nth-of-type(2) {
    flex: 1 1 0%;
    max-width: 200px;
  }
  @media (max-width: 1000px) {
    & > *:nth-of-type(2) {
      display: none;
    }
  }
  & > *:nth-of-type(3) {
    width: 160px;
  }
  @media (max-width: 800px) {
    & > *:nth-of-type(3) {
      display: none;
    }
  }
  & > *:nth-of-type(4) {
    flex: 2 2 0%;
  }
  @media (max-width: 630px) {
    & > *:nth-of-type(4) {
      display: none;
    }
  }
  & > *:nth-of-type(5) {
    width: 160px;
  }
  @media (max-width: 900px) {
    & > *:nth-of-type(5) {
      display: none;
    }
  }
  & > *:nth-of-type(6) {
    width: 100px;
  }
`;
