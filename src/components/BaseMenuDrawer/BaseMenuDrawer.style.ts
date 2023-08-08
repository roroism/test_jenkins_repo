import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { toDivStyle } from '../Global.style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListItem from '@mui/material/ListItem';

const HoverLogo = keyframes`
  from {
    opacity: .3;
  }
  to {
    opacity: 1;
  }
`;

type LogoLinkProps = {
  darktheme: boolean;
};

export const LogoLinkWrapper = styled.div<LogoLinkProps>`
  transition: all 600ms, background-color ${(props) => props.theme?.modeTransition?.duration};

  & .logo-color {
    display: ${({ darktheme }) => (darktheme ? 'none' : 'block')};
  }
  & .logo-white {
    display: ${({ darktheme }) => (darktheme ? 'block' : 'none')};
  }
  &:hover .logo-color {
    display: ${({ darktheme }) => (darktheme ? 'block' : 'none')};
    animation: ${HoverLogo} 0.6s;
  }
  &:hover .logo-white {
    display: ${({ darktheme }) => (darktheme ? 'none' : 'block')};
    animation: ${HoverLogo} 0.6s;
  }
  &:hover {
    background-color: #efefef;
    /* background-position: right; */
  }
`;

export const LogoLink = styled(Link)`
  display: flex;
  height: 80px;
`;

export const LogoImg = styled.img`
  width: 70%;
  height: 70%;
  margin: auto;
  object-fit: contain;
`;

const drawerOpen = keyframes`
  from {
    width: 0px;
  }
`;

type AsideProps = {
  shrinked?: boolean;
};

export const Aside = styled.aside<AsideProps>`
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
  width: ${(props) => (props.shrinked ? '60px' : '240px')};
  /* transition: 600ms cubic-bezier(0.5, 1.6, 0.6, 0.9); */
  animation: ${drawerOpen} 600ms cubic-bezier(0.5, 1.6, 0.6, 0.9);
  background-color: ${(props) => props.theme?.mode?.backgroundAside};
  transition: background-color ${(props) => props.theme?.modeTransition?.duration},
    width 0.6s cubic-bezier(0.5, 1.6, 0.6, 0.9),
    border-right ${(props) => props.theme?.modeTransition?.duration};
  box-sizing: border-box;
  border-right: 1px solid ${(props) => props.theme?.mode?.borderAside};

  grid-area: aside;
`;

export const Ul = styled.ul`
  ${toDivStyle}
  flex: 1;

  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
`;

type ListItemProps = {
  selected?: boolean;
};

export const Li = styled.li<ListItemProps>`
  ${toDivStyle}
  height: auto;

  padding: 8px;
  font-size: 2rem;
  text-align: center;
  /* color: #e0e0e0; */
  /* transition: all 600ms, background-color 0.35s; */
  cursor: pointer;

  /* &:hover {
    background-color: ${(props) => props.theme?.mode?.backgroundAsideHover};
    color: #2f2f2f;
  } */

  /* ${(props) =>
    props.selected &&
    css`
      background-color: #3e70d6;

      &:hover {
        background: #3e70d6;
        color: #e0e0e0;
      }
      & svg {
        color: #fff;
      }
    `} */
`;

export const StyledListItem = styled(Li)`
`;

export const StyledListItemTitleInnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 8px;

  & .icon-arrow {
    color: ${(props) => props.theme?.mode?.text};
    transition: color ${(props) => props.theme?.modeTransition?.duration};
  }

  & .leftbox {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;

type ListItemInnerWrapperProps = {
  selected?: boolean;
};

export const ListItemInnerWrapper = styled.div<ListItemInnerWrapperProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 8px 8px 32px;
  border-radius: 8px;

  &:hover {
    /* transition: background-color ${(props) => props.theme?.modeTransition?.duration}; */
    background-color: ${(props) => props.theme?.mode?.backgroundAsideHover};
    color: #2f2f2f;
  }

  & .leftbox {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  ${(props) =>
    props.selected &&
    css`
      background-color: #3e70d6;
      box-shadow: 0 .375rem .875rem 0 rgba(0,0,0,.33), 0 .0625rem .25rem 0 rgba(0,0,0,.31);

      &:hover {
        background: #3e70d6;
        color: #e0e0e0;
      }
      & svg {
        color: #fff;
      }
    `}
`;

export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme?.mode?.iconAside};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;

type ListItemTextProps = {
  shrinked?: boolean;
  selected?: boolean;
};

export const ListItemText = styled.h4<ListItemTextProps>`
  margin: 10px 0 0 0;
  font-size: 1.4rem;
  color: ${(props) => props.theme?.mode?.textAside};
  transition: transform 600ms cubic-bezier(0.5, 1.6, 1.1, 0.9),
    font-size 500ms cubic-bezier(1.2, 1.6, 1.1, 0.9), margin 600ms cubic-bezier(0.5, 1.6, 1.1, 0.9),
    color ${(props) => props.theme?.modeTransition?.duration};

  ${(props) =>
    props.shrinked &&
    css`
      transform: scale(0);
      font-size: 0px;
      margin: 0px;
    `}

  ${(props) =>
    props.selected &&
    css`
      color: #fff;
    `}
`;

export const StyledListItemText = styled.h4<ListItemTextProps>`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 400;
  color: ${(props) => props.theme?.mode?.textAside};
  transition: transform 600ms cubic-bezier(0.5, 1.6, 1.1, 0.9),
    font-size 500ms cubic-bezier(1.2, 1.6, 1.1, 0.9), margin 600ms cubic-bezier(0.5, 1.6, 1.1, 0.9),
    color ${(props) => props.theme?.modeTransition?.duration};

  &.title {
    font-size: 1.5rem;
    font-weight: 700;
  }

  ${(props) =>
    props.shrinked &&
    css`
      transform: scale(0);
      font-size: 0px;
      margin: 0px;
    `}

  ${(props) =>
    props.selected &&
    css`
      color: #fff;
  `}
`;

export const InnerUl = styled.ul`
  margin: 0 8px;
  padding: 0;
  border-radius: 8px;

  &.active {
    /* background-color: ${(props) => props.theme?.mode?.backgroundSelectedAsideGroup}; */
    /* transition: background-color ${(props) => props.theme?.modeTransition?.duration}; */
  }
`;

export const UnstyledLi = styled.li`
  all: unset;
`;

type ShrinkButtonProps = {
  shrinked?: boolean;
};

export const ShrinkButton = styled.button<ShrinkButtonProps>`
  border: none;
  outline: none;
  background: transparent;

  padding: 10px 0px;
  font-size: 2rem;
  text-align: center;
  color: #e0e0e0;

  & > *:first-of-type {
    transition: 500ms;
  }

  ${(props) =>
    props.shrinked &&
    css`
      & > *:first-of-type {
        transform: rotate(180deg);
      }
    `}
`;
