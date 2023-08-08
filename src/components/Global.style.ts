import { css, keyframes } from '@emotion/react';

export const grow = keyframes`
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
`;

export const growX = keyframes`
  from {  
    transform: scaleX(0);
  }
  to {
    transform:scaleX(1);
  }
`;

export const shake = keyframes`
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-0.5rem, 0);
  }
  70% {
    transform: translate(0.5rem, 0);
  }
  100% {
    transform: translate(0, 0);
  }
`;

export const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const clear = keyframes`
  0% {
    filter: blur(3px);
  }
  100% {
    filter: blur(0px);
  }
`;

export const defaultInteractionCSS = (error: boolean) => {
  return css`
    transition: 300ms;
    box-shadow: inset 0px 0px 0px 1px ${error ? 'hsl(0, 65%, 60%)' : 'hsl(0, 0%, 75%)'};
    &:focus,
    &:focus:hover {
      box-shadow: inset 0px 0px 0px 2px ${error ? 'hsl(0, 65%, 60%)' : 'hsl(220, 65%, 54%)'};
    }
    &:hover {
      box-shadow: inset 0px 0px 0px 1px ${error ? 'hsl(0, 65%, 60%)' : 'black'};
    }
  `;
};

export const toDivStyle = css`
  all: unset;
  display: block;
  box-sizing: border-box;
`;

export const toPaperStyle = css`
  background: white;
  border-radius: 15px;
  box-shadow: 0px 3px 6px #00000029;
`;
