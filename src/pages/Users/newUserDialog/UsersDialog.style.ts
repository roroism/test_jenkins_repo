import styled from '@emotion/styled';
import { Content as BaseContent } from '@app/src/components/Modal.style';
import { css } from '@emotion/react';

export const ContentAddButton = styled.button`
  border: none;
  outline: none;
  background: transparent;

  width: minmax(200px, auto);
  min-width: 200px;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  color: #707070;
  text-transform: uppercase;
  box-shadow: inset 0px 0px 0px 1px hsl(0, 0%, 75%);
  transition: 300ms;

  &:focus {
    box-shadow: inset 0px 0px 0px 2px hsl(220, 65%, 54%);

    &:hover {
      box-shadow: inset 0px 0px 0px 2px hsl(220, 65%, 54%);
    }
  }

  &:hover {
    box-shadow: inset 0px 0px 0px 1px black;
  }
`;

export const Content = styled(BaseContent)`
  display: grid;
  grid-template-columns: repeat(auto-fit, 250px);
  justify-content: center;
  gap: 20px;
`;

export const ContentImageItem = styled.div`
  position: relative;
  margin-bottom: 10px;
  padding-right: 90px;

  .name {
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    color: #3e70d6;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .duration {
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    color: #707070;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .edit {
    outline: none;
    border: none;

    position: absolute;
    top: 50%;
    right: 40px;
    transform: translate(0, -50%);
    width: 40px;
    height: 30px;
    border-radius: 8px;
    background: #3e70d6;
    color: white;
  }

  .delete {
    border: none;
    outline: none;
    background: transparent;

    position: absolute;
    top: 0px;
    right: 0px;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
`;

export const DurationInput = styled.input`
  border: none;
  outline: none;
  width: 40px;
  text-align: center;
  box-shadow: inset 0 0 0 1px #ccc;
`;

export const ThumbnailImage = styled.img`
  object-fit: cover;
  border-radius: 8px;
  overflow: hidden;
  width: 60px;
  height: 60px;
  margin: auto;
`;

export const HoverDiv = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  border-radius: 8px;
`;

export const ThumbnailImageWrapper = styled.div`
  position: relative;
  border-radius: 8px;
  margin-right: 3px;
  &:hover .hover-div {
    opacity: 1;
  }
`;

export const HoverDivInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  & button {
    background-color: transparent;
    border: none;
    color: #fff;
    padding: 2px 4px;
    transition: color 0.3s;
    &:hover {
      color: #3e70d6;
    }
  }
`;

export const AddImgButton = styled.button`
  background-color: transparent;
  border: none;
  width: 60px;
  height: 60px;
  padding: 0;
  & > div > div {
    width: 60px;
    height: 60px;
    border: 1px dashed #cbced6;
    border-radius: 5px;
    position: relative;
    transition: all 0.3s;

    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 2px;
      height: 16px;
      /* background-color: #CBCED6; */
      background-color: #aaa;
      border-radius: 2px;
      top: 21px;
      left: 28px;
    }
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 16px;
      height: 2px;
      /* background-color: #CBCED6; */
      background-color: #aaa;
      border-radius: 2px;
      top: 28px;
      left: 21px;
    }
    &:hover {
      border-color: #333;
    }
  }
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
