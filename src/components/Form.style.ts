import styled from '@emotion/styled';
import { MenuItem, Select as MuiSelect, Switch as MuiSwitch } from '@mui/material';
import { defaultInteractionCSS, shake } from './Global.style';

interface LabelProps {
  css?: any;
}

export const Label = styled.label<LabelProps>`
  display: block;
  width: auto;
  margin-bottom: 5px;
  font-size: 1.4rem;
  /* color: #707070; */
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
  ${(props) => props.css}
`;

interface InputProps {
  error?: boolean;
}

export const WrapDiv = styled.div`
  display: flex;
`;

export const EditBtn = styled.button`
  outline: none;
  border: none;
  box-sizing: border-box;

  width: 80px;
  height: 25px;
  border: 1px solid #707070;
  border-radius: 5px;
  background: white;
  transition: 300ms ease-in-out;
  color: #707070;

  &:hover {
    background: #3e70d6;
    color: #fff;
  }
`;

export const Input = styled.input<InputProps>`
  border: none;
  outline: none;

  width: 100%;
  padding: 10px;
  border-radius: 5px;
  background: transparent;
  font-size: 1.4rem;
  /* color: #707070; */
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
  ${(props) => defaultInteractionCSS(props.error === true)}

  &::placeholder {
    color: #c0c0c0;
    font-size: 14px;
  }
`;

interface TextAreaProps {
  error?: boolean;
}

export const TextArea = styled.textarea<TextAreaProps>`
  width: 100%;
  font-size: 14px;
  padding: 10px;
  background: transparent;
  border: none;
  box-shadow: inset 0px 0px 0px 1px hsl(0, 0%, 75%);
  border-radius: 5px;
  outline: none;
  font-family: 'Roboto';
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
  resize: none;
  overflow: hidden;
  ${(props) => defaultInteractionCSS(props.error === true)}

  &::placeholder {
    color: #c0c0c0;
    font-size: 14px;
  }
`;

export const Select = styled(MuiSelect)`
  width: 100%;
  /* height: 35px; */
  font-size: 14px;
  transition: 300ms;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
  border: 1px solid #373A37;

  & .MuiSelect-select {
    transition: 300ms;
    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
`;

export const Option = styled(MenuItem)`
  font-size: 14px;
`;

export const ErrMsg = styled.div`
  font-size: 12px;
  margin-bottom: 5px;
  color: hsl(0, 65%, 60%);
  animation: ${shake} 200ms 2;
`;

export const PassMsg = styled.div`
  font-size: 12px;
  margin-bottom: 5px;
  color: hsl(148, 38%, 34%);
`;

export const Switch = styled(MuiSwitch)`

`;