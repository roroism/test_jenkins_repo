import { Button } from '@mui/material';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';
import { grow } from './Global.style';

export const Container = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const fadeIn = keyframes`
  from {
    background: transparent;
    backdrop-filter: blur(0px);
  }
`;

const fadeOut = keyframes`
  to {
    background: transparent;
    backdrop-filter: blur(0px);
  }
`;

type BackgroundProps = {
  alpha?: number;
};

export const Background = styled.div<BackgroundProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, ${(props) => props.alpha || 0.5});
  backdrop-filter: blur(1px);
  animation: ${fadeIn} 300ms ease-in-out;

  &.close {
    animation: ${fadeOut} 300ms ease-in-out forwards;
  }
`;

interface BodyProps {
  width?: string;
  height?: string;
  css?: SerializedStyles;
}

const shrink = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0);
  }
`;

export const Body = styled.div<BodyProps>`
  display: flex;
  flex-flow: column nowrap;

  position: absolute;
  width: ${(props) => props.width || '400px'};
  height: ${(props) => props.height || 'auto'};
  max-width: 95%;
  max-height: 95%;
  background-color: ${(props) => props.theme?.mode?.modalBackground ?? 'white'};
  transition: background-color ${(props) => props.theme?.modeTransition?.duration};
  border-radius: 8px;
  overflow: hidden;
  /* transition: 500ms; */
  ${(props) => props.css}

  animation: ${grow} 400ms cubic-bezier(0.5, 1.5, 0.6, 0.9);

  &.close {
    /* animation: ${shrink} 400ms cubic-bezier(0.770, -0.5, 0.295, 1.295) forwards; */
    animation: ${shrink} 400ms cubic-bezier(0.57, 0.19, 0.17, -0.64) forwards;
  }
`;

export const Title = styled.h2`
  all: unset;
  display: block;
  box-sizing: border-box;

  background-color: #3e70d6;
  height: 40px;
  color: white;
  font-size: 1.8rem;
  line-height: 40px;
  text-align: center;
`;

interface ContentProps {
  css?: any;
}

export const Content = styled.div<ContentProps>`
  flex: 1;
  overflow: auto;
  padding: 16px;

  display: flex;
  flex-flow: column nowrap;
  gap: 15px;

  ${(props) => props.css}
`;

interface ActionsProps {
  css?: any;
}

export const Actions = styled.div<ActionsProps>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 55px;

  padding: 10px 30px;

  ${(props) => props.css}

  & > *:not(:last-child) {
    margin-right: 15px;
  }
`;

export const SaveButton = styled(Button)`
  width: 80px;
  height: 35px;
  border-radius: 8px;
  padding: 0px;
  background-color: #3e70d6;
  color: white;
  font-size: 14px;
  line-height: 35px;
  transition: background-color 350ms;
  text-transform: none;

  &:hover {
    background-color: #7393d4;
  }
`;

export const DeleteButton = styled(Button)`
  width: 80px;
  height: 35px;
  border-radius: 8px;
  padding: 0px;
  background-color: #ff8787;
  color: white;
  font-size: 14px;
  line-height: 35px;
  transition: background-color 350ms;
  text-transform: none;

  &:hover {
    background-color: #d41e1e;
  }
`;

export const CloseButton = styled(Button)`
  width: 80px;
  height: 35px;
  border-radius: 8px;
  padding: 0px;
  background-color: #e0e0e0;
  color: #373a37;
  font-size: 14px;
  line-height: 35px;
  transition: background-color 350ms;
  text-transform: none;

  &:hover {
    background-color: #3e70d6;
    color: white;
  }
`;
