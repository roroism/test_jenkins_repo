import MuiButton from '@mui/material/Button';
import MuiMenuItem from '@mui/material/MenuItem';
import styled from '@emotion/styled';
import { Link as BaseLink } from 'react-router-dom';
import { Menu as MuiMenu, Switch as MuiSwitch } from '@mui/material';

interface NavProps {
  accessHomepage: boolean;
}

export const Nav = styled.nav<NavProps>`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: ${(props) => props.theme?.mode?.background};
  transition: background-color ${(props) => props.theme?.modeTransition?.duration};
  ${(props) =>
    props.accessHomepage
      ? `border-bottom: 1px solid ${props.theme?.mode?.borderBottomBaseNavBar};
      padding-right : 3rem;
      gap: 1.5rem;
    `
      : null};

  grid-area: nav;
`;

export const Button = styled(MuiButton)`
  text-transform: none;
  height: 40px;
  size: 20px;
  display: flex;
  color: ${(props) => props.theme?.mode?.iconAside};
  transition: color ${(props) => props.theme?.modeTransition?.duration};

  & span:nth-of-type(1) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    margin: 0 0;

    & svg:nth-of-type(1) {
      font-size: 30px;
    }
  }
  & span:nth-of-type(2) {
    display: flex;
    align-items: center;
    justify-content: left;
    padding-top: 2px;
    font-weight: 400;
    /* flex-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */
  }
`;

export const AvatarIcon = styled.div`
  width: 100%;
  height: auto;
`;

export const Link = styled(BaseLink)`
  display: block;
  all: unset;
  width: 100%;
  height: 100%;
  /* margin: 6px 16px; */
  font-size: 14px;
  padding: 9px 6px;
  text-align: center;
  &.logout {
    color: #ff5252;
  }
  &.bottom-menu-item {
    /* font-size: 13px; */
  }
`;

export const CustomStyledMenu = styled(MuiMenu)`
  & .MuiList-padding {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

export const MenuItemLLink = styled(MuiMenuItem)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px;
`;

export const MenuItem = styled(MuiMenuItem)`
  font-size: 14px;
  padding: 0;
`;

export const ButtonText = styled.span`
  width: 50px;
  height: 100%;
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;

export const Ul = styled.ul`
  list-style: none;
  padding-left: 0;
`;

export const Li = styled.li`
  color: #333;
  margin-bottom: 2px;
  &:nth-of-type(1) {
    font-size: 2.3rem;
    margin-bottom: 0px;
  }
  &:nth-of-type(2) {
    font-size: 1.3rem;
    color: #999;
    margin-bottom: 15px;
  }
  &:nth-of-type(3) {
    font-size: 1.4rem;
    margin-bottom: 5px;
  }
  &:nth-of-type(4) {
    font-size: 1.4rem;
  }
`;

export const AvatarImg = styled.img`
  display: block;
  width: 100%;
`;

export const LanguageButton = styled.button`
  background: inherit;
  border: none;
  box-shadow: none;
  border-radius: 0;
  overflow: visible;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 2px 8px;

  &:hover {
    background-color: #f7f7f7;
  }
  & img {
    margin-right: 10px;
    width: 25px;
  }
  & span {
    color: ${(props) => props.theme?.mode?.text};
    transition: color ${(props) => props.theme?.modeTransition?.duration};
  }
`;

export const Switch = styled(MuiSwitch)``;

export const MuiDarkmodeSwitch = styled(MuiSwitch)(({ theme }) => ({
  'width': 53,
  'height': 28,
  'padding': 7,
  '& .MuiSwitch-switchBase': {
    'margin': 1,
    'padding': 0,
    'transform': 'translateX(6px)',
    '&.Mui-checked': {
      'color': '#fff',
      'transform': 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        // backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        backgroundColor: '#7D8590',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    'backgroundColor': theme?.mode?.darkmodeSwitch,
    'width': 24,
    'height': 24,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    // backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    backgroundColor: '#7D8590',
    borderRadius: 20 / 2,
  },
}));

export const Menu = styled(MuiMenu)`
  & .MuiPaper-root {
    background-color: ${(props) => props.theme?.mode?.backgroundNavMenu};
    transition: background-color ${(props) => props.theme?.modeTransition?.duration};
  }
  & button:hover {
    background-color: ${(props) => props.theme?.mode?.backgroundNavMenuHover};
    transition: background-color ${(props) => props.theme?.modeTransition?.duration};
  }
`;
