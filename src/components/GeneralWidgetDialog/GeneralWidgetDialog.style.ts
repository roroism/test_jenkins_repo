import { toDivStyle } from '@app/src/components/Global.style';
import { Box as BaseBox } from '@app/src/components/Layout.style';
import { Label as BaseTextLabel } from '@app/src/components/Form.style';
import styled from '@emotion/styled';

export const Desc = styled.p`
  ${toDivStyle}
  font-size: 12px;
  margin-bottom: 5px;
  color: #707070;
`;

export const TextLabel = styled(BaseTextLabel)`
  color: black;
`;

export const Box = styled(BaseBox)`
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

const IconActionButton = styled.button`
  border: none;
  outline: none;
  background: transparent;

  width: 35px;
  height: 35px;
  padding: 0px;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: inset 0px 0px 0px 1px hsl(0, 0%, 75%);
  color: #707070;
  text-transform: uppercase;

  box-shadow: inset 0px 0px 0px 1px hsl(0, 0%, 75%);
  &:hover:active {
    box-shadow: inset 0px 0px 0px 2px hsl(220, 65%, 54%);
  }
  &:hover {
    transition: 300ms;
    box-shadow: inset 0px 0px 0px 1px black;
  }

  & > img {
    height: 100%;
  }
`;

export const SendButton = styled(IconActionButton)`
  & img {
    width: 35px;
    height: 35px;
  }
`;

export const ContentAddButton = styled.button`
  border: none;
  outline: none;
  background: transparent;

  width: 100%;
  max-width: 200px;
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

export const ImageItem = styled.div`
  position: relative;
  margin-bottom: 10px;
  padding-right: 90px;

  .name {
    height: 40px;
    font-size: 14px;
    line-height: 40px;
    color: #3e70d6;
  }

  .edit {
    outline: none;
    border: none;

    position: absolute;
    top: 50%;
    right: 50px;
    transform: translate(0, -50%);
    width: 40px;
    height: 30px;
    border-radius: 8px;
    background: #3e70d6;
    color: white;
  }

  .delete {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
`;

export const VideoItem = styled.div`
  position: relative;
  margin-bottom: 10px;
  padding-right: 90px;

  .name {
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    color: #3e70d6;
  }

  .duration {
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    color: #707070;
  }

  .edit {
    outline: none;
    border: none;

    position: absolute;
    top: 50%;
    right: 50px;
    transform: translate(0, -50%);
    width: 40px;
    height: 30px;
    border-radius: 8px;
    background: #3e70d6;
    color: white;
  }

  .delete {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
`;
