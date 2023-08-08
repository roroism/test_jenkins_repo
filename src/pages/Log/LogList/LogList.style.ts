import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const LogListGrid = css`
  & > *:nth-of-type(1) {
    flex: 1 1 0%;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  & > *:nth-of-type(2) {
    flex: 1 1 0%;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  & > *:nth-of-type(3) {
    flex: 1 1 0%;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  @media (max-width: 1200px) {
    & > *:nth-of-type(3) {
      display: none;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  & > *:nth-of-type(4) {
    flex: 1 1 0%;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  & > *:nth-of-type(5) {
    flex: 1 1 0%;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  & > *:nth-of-type(6) {
    flex: 1 1 0%;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  & > *:nth-of-type(7) {
    flex: 1 1 0%;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  & > *:nth-of-type(8) {
    flex: 1 1 0%;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  & > *:nth-of-type(9) {
    flex: 1 1 0%;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  & > *:nth-of-type(10) {
    flex: 1 1 0%;
    max-width: 80px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  & > *:nth-of-type(11) {
    flex: 1 1 0%;
    max-width: 70px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const Status = styled.img`
  width: 12px;
  height: 12px;
`;