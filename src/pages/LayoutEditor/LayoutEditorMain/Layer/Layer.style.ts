import { toDivStyle } from '@app/src/components/Global.style';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Container = styled.div`
  grid-area: layer;
  background: white;
  /* border-radius: 15px 0 0 15px; */
  /* box-shadow: inset 0 0 2px 0 #606060; */
  overflow-x: hidden;
`;

export const Ol = styled.ol`
  ${toDivStyle}
  width: 200px;

  grid-area: layer;
  background: white;
  /* border-radius: 15px 0 0 15px; */
  /* box-shadow: inset 0 0 2px 0 #606060; */
  overflow-x: hidden;
`;

type LiProps = {
  selected?: boolean;
};

export const Li = styled.li<LiProps>`
  ${toDivStyle}

  display:flex;
  align-items: center;
  gap: 5px;
  height: 3rem;
  margin: 3px 5px;
  line-height: 3rem;
  transition: 300ms;
  font-size: 1.4rem;
  color: grey;
  cursor: pointer;

  &:not(:last-of-type) {
    border-bottom: 1px solid hsl(0, 0%, 80%);
  }

  &:hover {
    color: black;
  }

  ${(props) =>
    props.selected &&
    css`
      color: #3e70d6;

      &:hover {
        color: #3e70d6;
      }
    `}
`;

export const LiName = styled.span`
  flex: 1;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
