import * as Form from '@app/src/components/Form.style';
import { spin } from '@app/src/components/Global.style';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab as MuiTab, Tabs as MuiTabs } from '@mui/material';

export const Container = styled.div`
  grid-area: panel-tab;
  position: relative;
  display: flex;
`;

export const Ul = styled.ul`
  all: unset;
  display: block;
  box-sizing: border-box;

  width: 40px;
  height: 100%;
  padding: 5px;
  text-align: center;
  background: white;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  & > *:not(:last-child) {
    margin-bottom: 5px;
  }
`;

interface LiButtonProps {
  selected: boolean;
}

export const LiButton = styled.button<LiButtonProps>`
  outline: none;
  border: none;
  padding: 0px;
  background: transparent;

  width: 100%;
  height: 30px;
  font-size: 1.6rem;
  transition: 300ms;
  border-radius: 8px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  ${(props) =>
    props.selected
      ? css`
          color: #3e70d6;
        `
      : css`
          color: grey;
        `}
`;

interface PanelProps {
  open: boolean;
}

export const Panel = styled.div<PanelProps>`
  position: absolute;
  background: #e0e0e0;
  left: 100%;
  width: 0px;
  /* max-width: 20vw; */
  height: 100%;
  overflow: auto;
  /* background: white; */
  transition: 700ms;
  filter: blur(3px);

  display: flex;
  flex-flow: column nowrap;
  gap: 2px;

  ${(props) =>
    props.open
      ? css`
          width: 350px;
          padding: 0px 2px;
          filter: none;
        `
      : null};
`;

export const Tabs = styled(MuiTabs)`
  background: white;
  min-height: 45px;
`;

export const Tab = styled(MuiTab)`
  font-size: 12px;
  min-height: 45px;
  height: 45px;
`;

interface SubPanelProps {
  open: boolean;
}

export const SubPanel = styled.div<SubPanelProps>`
  width: 0px;
  height: 100%;
  overflow: auto;
  background: white;
  transition: 700ms;
  padding: 0px;
  filter: blur(3px);

  display: flex;
  flex-flow: column nowrap;

  ${(props) =>
    props.open &&
    css`
      width: 100%;
      padding: 8px;
      filter: none;
    `}
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  height: 35px;
`;

export const SearchInput = styled(Form.Input)`
  height: 35px;
  /* margin-right: 10px; */
  font-size: 1.4rem;
  flex: 1;
`;

interface SearchOptionButton {
  selected?: boolean;
  blocked?: boolean;
}

export const SearchOptionButton = styled.button<SearchOptionButton>`
  outline: none;
  border: none;
  padding: 0px;
  background: transparent;

  width: 35px;
  height: 100%;
  font-size: 2rem;
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

export const FaLoading = styled(FontAwesomeIcon)`
  animation: ${spin} 1s linear infinite;
`;
