import styled from '@emotion/styled';
import { Content as BaseCotnent } from '@app/src/components/Modal.style';
import { css } from '@emotion/react';

export const Content = styled(BaseCotnent)`
  display: flex;
  flex-flow: column nowrap;
`;

export const GroupListGrid = css`
  & > *:nth-of-type(1) {
    flex: 1 1 0%;
    text-align: left;
  }
  & > *:nth-of-type(2) {
    flex: 1 1 0%;
    max-width: 200px;
  }
  & > *:nth-of-type(3) {
    flex: 1 1 0%;
  }
  @media (max-width: 700px) {
    & > *:nth-of-type(3) {
      display: none;
    }
  }
  & > *:nth-of-type(4) {
    flex: 0 0 100px;
  }
  & > *:nth-of-type(5) {
    width: 160px;
  }
`;
