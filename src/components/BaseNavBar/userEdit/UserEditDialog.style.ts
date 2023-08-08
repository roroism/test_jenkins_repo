import styled from '@emotion/styled';

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
