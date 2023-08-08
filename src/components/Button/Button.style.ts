import styled from '@emotion/styled';
import { ButtonColorType } from './Button';
import { css } from '@emotion/react';

const buttonColor = {
  blue: {
    default: '#3e70d6',
    hover: '#7393d4',
  },
  red: {
    default: '#ff8787',
    hover: '#d41e1e',
  },
  normal: {
    default: '#e0e0e0',
    hover: '#3e70d6',
  },
  none: {
    default: '#fff',
    hover: '#efefef',
  },
};

export const Container = styled.button<{
  disabled: boolean;
  colorType: ButtonColorType;
}>`
  width: fit-content;
  min-width: 80px;
  height: 35px;
  padding: 0px 10px;
  font-size: 1.4rem;
  border-radius: 8px;

  border: 1px solid ${({ theme }) => theme?.mode?.actionButtonBorder};
  transition: border-color ${({ theme }) => theme?.modeTransition?.duration};
  outline: none;
  background-color: ${({ colorType }) =>
    colorType ? buttonColor[colorType].default : buttonColor.none.default};

  /* box-shadow: inset 0px 0px 0px 1px hsl(0, 0%, 75%); */
  transition: color ${({ theme }) => theme?.modeTransition?.duration},
    border ${({ theme }) => theme?.modeTransition?.duration},
    background-color ${({ theme }) => theme?.modeTransition?.duration};
  /* text-transform: uppercase; */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;

  &:hover {
    border: 1px solid ${({ theme }) => theme?.mode?.actionButtonBorderHover};
    background-color: ${({ colorType }) =>
      colorType ? buttonColor[colorType].hover : buttonColor.none.default};
  }
  &:hover svg {
    color: ${({ theme }) => theme?.mode?.iconActionButtonHover};
  }
  & svg {
    color: ${({ theme }) => theme?.mode?.iconActionButton};
    transition: color ${({ theme }) => theme?.modeTransition?.duration};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: default;
    `}
`;

export const ButtonText = styled.span<{ colorType: ButtonColorType }>`
  font-size: 1.4rem;
  color: ${({ colorType, theme }) => (colorType === 'normal' ? theme?.mode?.text : 'white')};
`;
