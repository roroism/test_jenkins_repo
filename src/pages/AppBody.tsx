import { BaseMenuDrawer } from '@app/src/components/BaseMenuDrawer';
import { BaseNavBar } from '@app/src/components/BaseNavBar';
import { ModalPlacer } from '@app/src/ModalPlacer';
import { selectToken } from '@app/src/store/slices/authSlice';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { isTokenValid } from '../utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { darkTheme, lightTheme } from '../styles/theme';
import { deepmerge } from '@mui/utils';
import { browserActions, selectDarkTheme } from '@app/src/store/slices/browserSlice';

// Override `Material-UI` theme for customizing.
// ref: https://material-ui.com/customization/themes/#muithemeprovider
const defaultTheme = {
  typography: {
    fontFamily: "'Roboto', 'Noto Sans', 'Noto Sans KR', sans-serif, Arial",
  },
  palette: {
    primary: {
      main: '#3d424e',
    },
    secondary: {
      main: '#3e70d6',
    },
    error: {
      main: '#FF0000',
    },
  },
};

const muilightTheme = createTheme(deepmerge(defaultTheme, lightTheme));
const muidarkTheme = createTheme(deepmerge(defaultTheme, darkTheme));

// const getCurrentTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

const useThemeDetector = () => {
  const localDarkTheme = useSelector(selectDarkTheme());
  const dispatch = useDispatch();

  const getCurrentTheme = useCallback(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  // useLayoutEffect(() => {
  //   if (localDarkTheme === null) {
  //     console.log('localDarkTheme : ', localDarkTheme);
  //     dispatch(browserActions.addDarkThemeData({ isDarkTheme: getCurrentTheme() }));
  //   }
  // }, [localDarkTheme]);

  if (localDarkTheme === null) {
    console.log('localDarkTheme : ', localDarkTheme);
    const systemTheme = getCurrentTheme();
    dispatch(browserActions.addDarkThemeData({ isDarkTheme: systemTheme }));
    return systemTheme;
  }

  console.log('useThemeDetector localDarkTheme : ', localDarkTheme);

  return localDarkTheme;
};

/**
 * 1. Auth라우트를 제외한 모든 라우트의 최상위 컴포넌트
 * 2. 각 컴포넌트의 위치를 정의한다.
 */
export function AppBody() {
  const authToken = useSelector(selectToken());

  const navigate = useNavigate();
  const location = useLocation();
  const isEditorPath = location.pathname.includes('layoutEditor/');
  const isDarkTheme = useThemeDetector();

  console.log('isDarkTheme : ', isDarkTheme);

  /**
   * 로그인 되지 않은 사용자가 로그인 해야만 보이는 하면에 강제로 접근하려고 할 경우, 로그인 창으로 리다이렉트
   *
   * @author 오지민 2023.01.22
   */
  useEffect(() => {
    if (!isTokenValid(authToken)) {
      navigate('auth/signin');
    }
  }, []);

  return (
    <>
      <ThemeProvider theme={isDarkTheme ? muidarkTheme : muilightTheme}>
        <Cotainer>
          <BaseMenuDrawer darktheme={isDarkTheme} />
          {!isEditorPath ? <BaseNavBar userInfoLinker darktheme={isDarkTheme} /> : null}

          <Body>
            <Outlet />
          </Body>
        </Cotainer>
        <ModalPlacer />
      </ThemeProvider>
    </>
  );
}

export const Cotainer = styled.div`
  height: 100vh;
  /* background: #f2f2f2; */
  transition: 0.5s;
  overflow: hidden;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'aside nav'
    'aside body';
`;

export const Body = styled.div`
  grid-area: body;
  width: 100%;
  height: 100%;
  overflow: auto;
`;
