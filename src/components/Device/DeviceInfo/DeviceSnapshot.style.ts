import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react'

export const PreviewBox = styled.div`
  width: 462px;
  height: 322px;
  border: 1px solid #58585a;
  background-color: #fff;
  margin: 10px 0;
`;

export const LoadingImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
`;

const fadein = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const PreviewImg = styled.img`
  display: block;
  background-color: #fff;
  animation: ${fadein} 1s ease forwards;
`;

export const ErrorBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  animation: ${fadein} 1s ease forwards;
  font-size: 1.4rem;
  height: 100%;
`;

export const LoadingImg = styled.img`
  display: block;
  width: 25%;
`;