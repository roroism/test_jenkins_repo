import { grow } from '@app/src/components/Global.style';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Ul = styled.ul`
  all: unset;
  box-sizing: border-box;
  display: flex;
  gap: 5px;

  grid-area: global-toolbar;
  width: 100%;
  height: 40px;
  padding: 5px;
  background: white;
`;

interface LiButtonProps {
  selected?: boolean;
  blocked?: boolean;
}

export const LiButton = styled.button<LiButtonProps>`
  outline: none;
  border: none;
  padding: 0px;
  background: transparent;

  width: 30px;
  height: 100%;
  font-size: 1.6rem;
  transition: 300ms;
  border-radius: 8px;
  color: grey;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  ${(props) =>
    props.blocked &&
    css`
      color: hsl(0, 0%, 80%);
      cursor: inherit;
    `}

  ${(props) =>
    props.selected &&
    css`
      color: #3e70d6;
    `}
`;
