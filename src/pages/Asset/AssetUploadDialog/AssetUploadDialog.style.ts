import { grow } from '@app/src/components/Global.style';
import { toDivStyle } from '@app/src/components/Global.style';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

type LabelProps = {
  disabled?: boolean;
};

export const Label = styled.label<LabelProps>`
  ${toDivStyle}

  display: flex;
  width: 100%;
  min-height: 100px;
  padding: 20px;
  color: #707070;
  white-space: pre-line;
  font-size: 14px;
  border-radius: 15px;
  transition: 500ms;
  ${(props) =>
    !props.disabled &&
    css`
      cursor: pointer;
    `}

  box-shadow: inset 0px 0px 0px 1px hsl(0, 0%, 75%);
  &:hover {
    ${(props) =>
      !props.disabled &&
      css`
        transform: scale(0.95);
        box-shadow: inset 0px 0px 0px 2px hsl(220, 65%, 54%);
      `}
  }

  & > * {
    margin: auto;
  }
`;

export const Input = styled.input`
  /* display: none; */
  width: 0px;
  height: 0px;
`;

export const Ul = styled.ul`
  ${toDivStyle}
`;

type LiProps = {
  error?: boolean;
};

export const Li = styled.li<LiProps>`
  ${toDivStyle}
  position: relative;
  margin-bottom: 10px;
  padding-right: 60px;
  animation: ${grow} 1000ms cubic-bezier(0.5, 1.5, 0.6, 0.9);

  & h3 {
    ${toDivStyle}
    font-size: 14px;
    color: ${(props) => (props.error ? 'hsl(0, 65%, 60%)' : '#3e70d6')};
    transition: 500ms;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & h4 {
    ${toDivStyle}
    font-size: 12px;
    color: #707070;
  }

  & button {
    border: none;
    outline: none;
    background: transparent;

    position: absolute;
    top: 0px;
    right: 0px;
    height: 100%;
    padding: 0px;
    border-radius: 5px;
    transition: 500ms;
    cursor: pointer;
  }
  & button:hover {
    background: #e0e0e0;
  }
  & button:focus {
    box-shadow: inset 0px 0px 0px 2px hsl(220, 65%, 54%);
  }

  & button img {
    height: 100%;
  }
`;

export const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;
