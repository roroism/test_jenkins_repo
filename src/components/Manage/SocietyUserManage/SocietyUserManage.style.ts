import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const THeadGrid = css`
  & > *:nth-of-type(1) {
    flex: 1 1 5%; //grow shrink default-size
    text-align: center;
  }
  & > *:nth-of-type(2) {
    flex: 1 1 15%;
    text-align: center;
  }
  & > *:nth-of-type(3) {
    flex: 1 1 15%;
    text-align: center;
  }
  & > *:nth-of-type(4) {
    flex: 1 1 10%;
    text-align: center;
  }
  & > *:nth-of-type(5) {
    flex: 1 1 15%;
    text-align: center;
  }
  & > *:nth-of-type(6) {
    flex: 1 1 15%;
    text-align: center;
  }
  & > *:nth-of-type(7) {
    flex: 1 1 15%;
    text-align: center;
  }
`;

export const ButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
`;
