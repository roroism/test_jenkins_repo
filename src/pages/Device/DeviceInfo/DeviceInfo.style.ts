import { toPaperStyle } from '@app/src/components/Global.style';
import { toDivStyle } from '@app/src/components/Global.style';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link as LinkBase } from 'react-router-dom';
import { Label as BaseLabel } from '@app/src/components/Form.style';
import { FormControlLabel as MuiFormControlLabel } from '@mui/material';

export const Link = styled(LinkBase)`
  all: unset;
  cursor: pointer;
  font-size: 3rem;
  padding-right: 10px;
`;

export const Head = styled.div`
  ${toPaperStyle}

  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px;
  justify-content: flex-start;

  & > *:not(:last-child) {
    margin-right: 15px;
  }
  & svg:first-child {
    width: 5%;
  }
`;

export const HeadButtonContainer = styled.div`
  margin-left: auto;
`;

export const FormControlLabel = styled(MuiFormControlLabel)`
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
  & input,
  & span {
    font-size: 1.4rem;
    color: ${(props) => props.theme?.mode?.text};
    transition: color ${(props) => props.theme?.modeTransition?.duration};
  }
`;

export const ReadOnlyText = styled.div`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  background: transparent;
  font-size: 1.4rem;
`;

export const DeviceName = styled.h1`
  ${toDivStyle}
  font-size: 25px;
  font-weight: bold;
`;

export const DeviceLastUpdate = styled.div`
  font-size: 12px;
  color: #b2b2b2;
`;

export const DeleteButton = styled.button`
  width: 80px;
  height: 35px;
  border-radius: 8px;
  padding: 0px;
  background: #3e70d6;
  color: white;
  font-size: 14px;
  line-height: 35px;
  transition: 500ms;
  text-transform: none;
  text-align: center;

  &:hover {
    background: #7393d4;
  }
`;

export const EditButton = styled.button`
  width: 80px;
  height: 35px;
  border-radius: 8px;
  padding: 0px;
  background: #3e70d6;
  color: white;
  font-size: 14px;
  line-height: 35px;
  transition: 500ms;
  text-transform: none;
  text-align: center;
  border: none;

  &:hover {
    background: #7393d4;
  }
`;

export const Body = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
`;

export const InfoTitle = styled.h1`
  ${toDivStyle}
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0px;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;

export const InfoContent = styled.div`
  display: grid;
  align-items: center;
  gap: 10px;
  grid-template-columns: auto 1fr;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InfoBox = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;

  & label {
    margin-left: 1rem;
  }
`;

type CheckIconProps = {
  checked?: boolean;
};

export const CheckIcon = styled(FontAwesomeIcon)<CheckIconProps>`
  color: ${({ checked }) => (checked ? '#009667' : '#bbb')};
`;

export const TextLabel = styled(BaseLabel)`
  font-size: 14px;
  margin-bottom: 0px;
`;

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 0.5rem;
`;
