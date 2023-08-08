import * as Form from '@app/src/components/Form.style';
import { clear, toDivStyle } from '@app/src/components/Global.style';
import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { MenuItem as BaseMenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  min-height: 100%;
  padding: 16px 24px;
  background-color: ${(props) => props.theme?.mode?.background};
  transition: background-color ${(props) => props.theme?.modeTransition?.duration};
`;

interface ContentWrapperProps {
  sx?: any;
}

export const ContentWrapper = styled.div<ContentWrapperProps>`
  /* width: 100%; */
  margin-top: 24px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${(props) => props.theme?.mode?.backgroundHomeItem};
  transition: background-color ${(props) => props.theme?.modeTransition?.duration},
    color ${(props) => props.theme?.modeTransition?.duration};
  /* box-shadow: 0px 3px 6px #00000029; */
  /* box-shadow: 0 0 15px rgba(0,0,0,.1); */
  box-shadow: 0 20px 20px -20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 0, 0, 0.08);
  ${(props) => props.sx}
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0px;

  display: flex;
  align-items: center;
`;

export const Actions = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
`;

type ActionButtonProps = {
  disabled?: boolean;
};

export const ActionButton = styled.button<ActionButtonProps>`
    border: none;
    outline: none;
    background: transparent;
  
    height: 35px;
    padding: 0px 10px;
    font-size: 1.4rem;
    border-radius: 8px;
    font-size: 1.4rem;
    box-shadow: inset 0px 0px 0px 1px hsl(0, 0%, 75%);
    color: #707070;
    /* text-transform: uppercase; */
    gap: 0.5rem;
  
    box-shadow: inset 0px 0px 0px 1px hsl(0, 0%, 75%);
    &:active {
      box-shadow: inset 0px 0px 0px 2px hsl(220, 65%, 54%);
    }
    &:hover {
      transition: 300ms;
      box-shadow: inset 0px 0px 0px 1px black;
    }
  
    ${(props) =>
    props.disabled &&
    css`
        opacity: 0.5;
      `}
  `;

type ActionSelectProps = {
  mw?: string;
};

export const ActionSelect = styled(Form.Select) <ActionSelectProps>`
width: auto;
min-width: ${(props) => props.mw || '100px'};
border-radius: 8px;
height: 35px;
`;

export const SearchInput = styled(Form.Input)`
  width: 150px;
  height: 35px;
  border-radius: 8px;
`;