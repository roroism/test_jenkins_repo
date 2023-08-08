import { grow, toDivStyle } from '@app/src/components/Global.style';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import * as Form from '@app/src/components/Form.style';

export const Ul = styled.ul`
  all: unset;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  grid-area: toolbar;
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

interface LiToggleProps {
  blocked?: boolean;
}

export const LiToggle = styled.button<LiToggleProps>`
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
      color: #3e70d6;
    `}
`;

type LiSelectProps = {
  width?: string;
};

export const LiSelect = styled(Form.Select) <LiSelectProps>`
  width: ${(props) => props.width || '80px'};
  height: 100%;
`;

type LiColorProps = {
  color?: string;
};

export const LiColor = styled.div<LiColorProps>`
  width: 17px;
  height: 17px;
  border-radius: 100px;
  margin: auto;

  box-shadow: inset 0px 0px 0px 1px ${(props) => (props.color ? props.color : 'hsl(0, 0%, 75%)')};
  background: ${(props) => (props.color ? props.color : 'transparent')};
`;

type LiInputProps = {
  width?: string;
};

export const LiInput = styled(Form.Input) <LiInputProps>`
  width: ${(props) => props.width || '80px'};
  height: 100%;
`;
