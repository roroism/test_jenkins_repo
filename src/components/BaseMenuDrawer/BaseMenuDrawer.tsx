import { useTranslation } from '@app/src/hooks/useTranslation';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/pro-regular-svg-icons/faEdit';
import { faFolders } from '@fortawesome/pro-regular-svg-icons/faFolders';
import { faTags } from '@fortawesome/pro-regular-svg-icons/faTags';
import {
  faBoxes,
  faClock,
  faCommentAltLines,
  faDesktop,
  faPencilPaintbrush,
  faSendBackward,
  faShoppingBag,
  faStore,
  faUserFriends,
  faLayerGroup,
  faGameBoard,
  faUserCheck,
} from '@fortawesome/pro-regular-svg-icons';
import { faArrowLeft, faPresentation } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CublickLogo from '@app/public/media/logo.colored.png';
import CublickLogoWhite from '@app/public/media/logo.white.png';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as S from './BaseMenuDrawer.style';
import { useSelector } from 'react-redux';
import { selectUserData } from '@app/src/store/slices/authSlice';
import Collapse from '@mui/material/Collapse';
import { ListItemTitle } from './ListItemTitle';

const permissionsLookup = { ANONYMOUS: 0, END_USER: 0, ADMIN: 2, SUPER_ADMIN: 2 };

type Menu = {
  id: string;
  icon: IconDefinition;
  link: string;
  permission: number;
};

type MenuList = {
  dashboard: Menu[];
  management: Menu[];
  send: Menu[];
  share: Menu[];
  system: Menu[];
};

const menuList: MenuList = {
  dashboard: [
    {
      id: 'app-menu.item.dashboard',
      icon: faGameBoard,
      link: '/',
      permission: 0,
    },
  ],
  management: [
    {
      id: 'app-menu.item.device',
      icon: faDesktop,
      link: '/device',
      permission: 0,
    },
    {
      id: 'app-menu.item.groups',
      icon: faLayerGroup,
      link: '/groups',
      permission: 0,
    },
    {
      id: 'app-menu.item.users',
      icon: faUserFriends,
      link: '/users',
      permission: 0,
    },
    {
      id: 'app-menu.item.category',
      icon: faTags,
      link: '/category',
      permission: 0,
    },
  ],
  send: [
    {
      id: 'app-menu.item.asset',
      icon: faFolders,
      link: '/asset',
      permission: 0,
    },
    {
      id: 'app-common.pesentation',
      icon: faPresentation,
      link: '/presentation',
      permission: 0,
    },
    {
      id: 'app-common.widget',
      icon: faBoxes,
      link: '/widget',
      permission: 0,
    },
    {
      id: 'app-menu.item.instant-message',
      icon: faCommentAltLines,
      link: '/instantMessage',
      permission: 0,
    },
  ],
  share: [
    {
      id: 'app-common.store',
      icon: faStore,
      link: '/store',
      permission: 0,
    },
  ],
  system: [
    {
      id: 'app-menu.item.systemLog',
      icon: faClock,
      link: '/systemLogs',
      permission: 0,
    },
  ],
};

interface BaseMenuDrawerProps {
  darktheme: boolean;
}

export function BaseMenuDrawer({ darktheme }: BaseMenuDrawerProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isShrinked, setIsShrinked] = useState(false);
  const userData = useSelector(selectUserData());
  const [openManagement, setOpenManagement] = useState<boolean>(true);
  const [openSend, setOpenSend] = useState<boolean>(true);
  const [openShare, setOpenShare] = useState<boolean>(true);
  const [openSystem, setOpenSystem] = useState<boolean>(true);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const elementId = e.currentTarget.id;
    console.log('elementId : ', elementId);
    if (elementId === 'managementlist') setOpenManagement((prevOpen) => !prevOpen);
    else if (elementId === 'sendlist') setOpenSend((prevOpen) => !prevOpen);
    else if (elementId === 'sharelist') setOpenShare((prevOpen) => !prevOpen);
    else if (elementId === 'systemlist') setOpenSystem((prevOpen) => !prevOpen);
  };

  return (
    <S.Aside
      shrinked={isShrinked}
      // onMouseEnter={() => setIsShrinked(false)}
      // onMouseLeave={() => setIsShrinked(true)}
    >
      <S.LogoLinkWrapper darktheme={darktheme}>
        <S.LogoLink to='/'>
          <S.LogoImg className='logo-color' src={CublickLogo} />
          <S.LogoImg className='logo-white' src={CublickLogoWhite} />
        </S.LogoLink>
      </S.LogoLinkWrapper>

      <S.Ul>
        {/* dashboard */}
        <S.UnstyledLi>
          <S.InnerUl
            className={
              menuList.dashboard
                .map(({ link }) => link.split('/')[1])
                .includes(location.pathname.split('/')[1])
                ? 'active'
                : null
            }
          >
            <S.Li
              key={menuList.dashboard[0].link}
              onClick={() => navigate(menuList.dashboard[0].link, { replace: true })}
              selected={
                location.pathname.split('/')[1] === menuList.dashboard[0].link.split('/')[1]
              }
            >
              <S.ListItemInnerWrapper
                selected={
                  location.pathname.split('/')[1] === menuList.dashboard[0].link.split('/')[1]
                }
              >
                <div className='leftbox'>
                  <S.StyledFontAwesomeIcon icon={menuList.dashboard[0].icon} />
                  {!isShrinked && <br />}
                  <S.StyledListItemText
                    shrinked={isShrinked}
                    selected={
                      location.pathname.split('/')[1] === menuList.dashboard[0].link.split('/')[1]
                    }
                  >
                    {t(menuList.dashboard[0].id)}
                  </S.StyledListItemText>
                </div>
              </S.ListItemInnerWrapper>
            </S.Li>
          </S.InnerUl>
        </S.UnstyledLi>

        {/* management */}
        <S.UnstyledLi>
          <S.InnerUl
            className={
              menuList.management
                .map(({ link }) => link.split('/')[1])
                .includes(location.pathname.split('/')[1])
                ? 'active'
                : null
            }
          >
            <ListItemTitle
              id='managementlist'
              open={openManagement}
              onClick={handleClick}
              title={t('app-menu.item.title-management')}
            />
            <Collapse component='div' in={openManagement} timeout='auto' unmountOnExit>
              {menuList.management
                .filter((i) => i.permission <= permissionsLookup[userData.userRight])
                .map((menu) => (
                  <S.Li
                    key={menu.link}
                    onClick={() => navigate(menu.link, { replace: true })}
                    selected={location.pathname.split('/')[1] === menu.link.split('/')[1]}
                  >
                    <S.ListItemInnerWrapper
                      selected={location.pathname.split('/')[1] === menu.link.split('/')[1]}
                    >
                      <div className='leftbox'>
                        <S.StyledFontAwesomeIcon icon={menu.icon} />
                        {!isShrinked && <br />}
                        <S.StyledListItemText
                          shrinked={isShrinked}
                          selected={location.pathname.split('/')[1] === menu.link.split('/')[1]}
                        >
                          {t(menu.id)}
                        </S.StyledListItemText>
                      </div>
                    </S.ListItemInnerWrapper>
                  </S.Li>
                ))}
            </Collapse>
          </S.InnerUl>
        </S.UnstyledLi>

        {/* Send */}
        <S.UnstyledLi>
          <S.InnerUl
            className={
              menuList.send
                .map(({ link }) => link.split('/')[1])
                .includes(location.pathname.split('/')[1])
                ? 'active'
                : null
            }
          >
            <ListItemTitle
              id='sendlist'
              open={openSend}
              onClick={handleClick}
              title={t('app-menu.item.title-send')}
            />
            <Collapse component='div' in={openSend} timeout='auto' unmountOnExit>
              {menuList.send
                .filter((i) => i.permission <= permissionsLookup[userData.userRight])
                .map((menu) => (
                  <S.Li
                    key={menu.link}
                    onClick={() => navigate(menu.link, { replace: true })}
                    selected={location.pathname.split('/')[1] === menu.link.split('/')[1]}
                  >
                    <S.ListItemInnerWrapper
                      selected={location.pathname.split('/')[1] === menu.link.split('/')[1]}
                    >
                      <div className='leftbox'>
                        <S.StyledFontAwesomeIcon icon={menu.icon} />
                        {!isShrinked && <br />}
                        <S.StyledListItemText
                          shrinked={isShrinked}
                          selected={location.pathname.split('/')[1] === menu.link.split('/')[1]}
                        >
                          {t(menu.id)}
                        </S.StyledListItemText>
                      </div>
                    </S.ListItemInnerWrapper>
                  </S.Li>
                ))}
            </Collapse>
          </S.InnerUl>
        </S.UnstyledLi>

        {/* Share */}
        <S.UnstyledLi>
          <S.InnerUl
            className={
              menuList.share
                .map(({ link }) => link.split('/')[1])
                .includes(location.pathname.split('/')[1])
                ? 'active'
                : null
            }
          >
            <ListItemTitle
              id='sharelist'
              open={openShare}
              onClick={handleClick}
              title={t('app-menu.item.title-share')}
            />
            <Collapse component='div' in={openShare} timeout='auto' unmountOnExit>
              {menuList.share
                .filter((i) => i.permission <= permissionsLookup[userData.userRight])
                .map((menu) => (
                  <S.Li
                    key={menu.link}
                    onClick={() => navigate(menu.link, { replace: true })}
                    selected={location.pathname.split('/')[1] === menu.link.split('/')[1]}
                  >
                    <S.ListItemInnerWrapper
                      selected={location.pathname.split('/')[1] === menu.link.split('/')[1]}
                    >
                      <div className='leftbox'>
                        <S.StyledFontAwesomeIcon icon={menu.icon} />
                        {!isShrinked && <br />}
                        <S.StyledListItemText
                          shrinked={isShrinked}
                          selected={location.pathname.split('/')[1] === menu.link.split('/')[1]}
                        >
                          {t(menu.id)}
                        </S.StyledListItemText>
                      </div>
                    </S.ListItemInnerWrapper>
                  </S.Li>
                ))}
            </Collapse>
          </S.InnerUl>
        </S.UnstyledLi>

        {/* system */}
        <S.UnstyledLi>
          <S.InnerUl
            className={
              menuList.system
                .map(({ link }) => link.split('/')[1])
                .includes(location.pathname.split('/')[1])
                ? 'active'
                : null
            }
          >
            <ListItemTitle
              id='systemlist'
              open={openSystem}
              onClick={handleClick}
              title={t('app-menu.item.title-system')}
            />
            <Collapse component='div' in={openSystem} timeout='auto' unmountOnExit>
              {menuList.system
                .filter((i) => i.permission <= permissionsLookup[userData.userRight])
                .map((menu) => (
                  <S.Li
                    key={menu.link}
                    onClick={() => navigate(menu.link, { replace: true })}
                    selected={location.pathname.split('/')[1] === menu.link.split('/')[1]}
                  >
                    <S.ListItemInnerWrapper
                      selected={location.pathname.split('/')[1] === menu.link.split('/')[1]}
                    >
                      <div className='leftbox'>
                        <S.StyledFontAwesomeIcon icon={menu.icon} />
                        {!isShrinked && <br />}
                        <S.StyledListItemText
                          shrinked={isShrinked}
                          selected={location.pathname.split('/')[1] === menu.link.split('/')[1]}
                        >
                          {t(menu.id)}
                        </S.StyledListItemText>
                      </div>
                    </S.ListItemInnerWrapper>
                  </S.Li>
                ))}
            </Collapse>
          </S.InnerUl>
        </S.UnstyledLi>
      </S.Ul>

      {/* <S.ShrinkButton shrinked={isShrinked} onClick={() => setIsShrinked((prev) => !prev)}>
        <S.StyledFontAwesomeIcon icon={faArrowLeft} />
      </S.ShrinkButton> */}
    </S.Aside>
  );
}
