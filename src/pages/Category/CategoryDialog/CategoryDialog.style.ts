import styled from '@emotion/styled';
import { Button } from '@mui/material';

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

export const InputWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;

export const SelectButton = styled(Button)`
  border-radius: 8px;
  padding: 8px 16px;
  background: #3e70d6;
  color: white;
  font-size: 14px;
  transition: background-color 500ms;
  text-align: center;
  border: none;
  height: auto;
  line-height: 1.5em;
  margin-left: 16px;
  text-transform: none;

  &:hover {
    background-color: #7393d4;
  }
`;
