import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const CategoryListGrid = css`
  /* 아이디 */
  & > *:nth-of-type(1) {
    flex: 0 0 206px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  /* 이름 */
  & > *:nth-of-type(2) {
    flex: 1 1 100px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  /* 상태 */
  & > *:nth-of-type(3) {
    flex: 1 1 0%;
    max-width: 80px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  /* 이메일 */
  & > *:nth-of-type(4) {
    flex: 1 1 0%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  /* 특권 */
  & > *:nth-of-type(5) {
    flex: 1 1 0%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  /* 그룹 */
  & > *:nth-of-type(6) {
    flex: 1 1 0%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  /* 만료 날짜 */
  & > *:nth-of-type(7) {
    flex: 1 1 0%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  /* 동작 */
  & > *:nth-of-type(8) {
    flex: 1 1 0%;
    max-width: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  @media (max-width: 700px) {
    & > *:nth-of-type(5) {
      display: none;
    }
  }
  & > td:nth-of-type(1) {
    overflow: scroll;
  }

  td::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
  }
`;

export const deactivatedAccount = css`
  background-color: grey;
`;

export const spinning = css`
  @keyframes spinning {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  animation: spinning 2s infinite linear;
`;

export const iconContainer = styled.div`
  margin: 0;
`;
export const ButtonText = styled.span`
  width: 50px;
  height: 100%;
  font-size: 14px;
  font-weight: bold;
`;

export const TextSpan = styled.span`
  text-align: center;
`;

export const Status = styled.img`
  width: 10px;
  height: 10px;
`;
