import { toDivStyle } from '@app/src/components/Global.style';
import { Content as BaseContent } from '@app/src/components/Modal.style';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const FontStyleBox = styled.div`
  display: flex;
`;

type FontStyleProps = {
  selected?: boolean;
};

export const FontStyle = styled.button<FontStyleProps>`
  font-size: 2rem;
  padding: 0.5rem 1rem;

  ${(props) =>
    props.selected &&
    css`
      background: #3e70d6;
      color: white;
    `}
`;

export const Content = styled(BaseContent)`
  display: flex;
  flex-flow: row nowrap;
  gap: 15px;
`;

export const AlignContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, auto);
  justify-content: center;
  gap: 10px;
`;

type AlignOutItemProps = {
  selected?: boolean;
};

export const AlignOutItem = styled.button<AlignOutItemProps>`
  ${toDivStyle}
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  box-shadow: inset 0px 0px 0px 1px hsl(0, 0%, 75%);
  background: none;
  white-space: normal;
  transition: 300ms;
  font-size: 12px;
  cursor: pointer;

  ${(props) =>
    props.selected &&
    css`
      background: #3e70d6;
      color: white;
      box-shadow: inset 0px 0px 0px 1px #3e70d6;
    `}
`;

type SubBoxProps = {
  disabled?: boolean;
};

export const SubBox = styled.div<SubBoxProps>`
  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
    `}
`;

interface ColorPickerPopperButtonProps {
  backgroundColor: string;
}

export const ColorPickerPopperButton = styled.button<ColorPickerPopperButtonProps>`
  display: block;
  width: 50px;
  height: 30px;
  padding: 1px;
  background-color: transparent;
  border-radius: 3px;
  border: 1px solid #666;
  margin-left: 10px;
  & > div {
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.backgroundColor};
  }
`;