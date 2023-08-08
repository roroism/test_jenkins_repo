import { useMuiSafeMenu } from '@app/src/hooks/useMuiSafeMenu';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { LanguageContext } from '@app/src/LanguageProvider';
import { selectUserData, selectUserDataByKey } from '@app/src/store/slices/authSlice';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LanguageIcon from '@mui/icons-material/Language';
import Menu from '@mui/material/Menu';
import React, { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import * as S from './BaseNavBar.style';
import * as Layout from '@app/src/components/Layout.style';
import imageNotSupported from '@app/public/media/image-not-supported.svg';
import TranslateIcon from '@mui/icons-material/Translate';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import * as Page from '@app/src/components/Page.style';
import { useModal } from '@app/src/hooks/useModal';
import { UsersEditDialog } from './userEdit';
import { useMutation } from '@tanstack/react-query';
import { editUser, editUserLanguage } from '@app/src/apis/users';
import { useDispatch } from 'react-redux';
import { authActions } from '@app/src/store/slices/authSlice';
import { browserActions } from '@app/src/store/slices/browserSlice';
import languageList from '@app/src/constants/languages';

interface BaseNavBarProps {
  languageChanger?: boolean;
  userInfoLinker?: boolean;
  darktheme?: boolean;
  setDarktheme?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BaseNavBar(props: BaseNavBarProps) {
  const { languageChanger, userInfoLinker, darktheme, setDarktheme } = props;

  const { t } = useTranslation();
  const { changeLanguage, languageName } = useContext(LanguageContext);
  const userName = useSelector(selectUserDataByKey('name'));
  const userData = useSelector(selectUserData());
  const userLang = useMemo(() => {
    const { title } = languageList.find((language) => language.value === userData.lang);
    return title;
  }, [userData]);
  const userMenu = useMuiSafeMenu();
  const languageMenu = useMuiSafeMenu();
  console.log('userData : ', userData);
  const modalCtrl = useModal();
  const dispatch = useDispatch();

  const mutateEditUser = useMutation({
    mutationFn: editUserLanguage,
    onSuccess: (res, { defLanguage }) => {
      dispatch(authActions.profileEditSucess({ ...userData, lang: defLanguage }));
    },
    // onError: () => modalCtrl.open(<Alert text='User was not edited' />),
  });

  type user = {
    id: string;
    avatarUrl: string;
    email: string;
    userRight: string;
    defLanguage: string;
    displayName: string;
    password: string;
    passwordConfirm: string;
  };
  const user: user = {
    id: userData.id,
    avatarUrl: userData.avatarUrl,
    email: userData.email,
    userRight: userData.userRight,
    defLanguage: userData.lang,
    displayName: userData.name,
    password: '',
    passwordConfirm: '',
  };

  const onErrorImg = (e) => {
    e.target.src = imageNotSupported;
  };
  const openUserEditDialog = (user: user) => {
    modalCtrl.open(<UsersEditDialog mode='EDIT' baseUser={user} />);
  };

  const handleChangeLanguageClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    lang: 'ko' | 'en' | 'de' | 'ja'
  ) => {
    mutateEditUser.mutate({ defLanguage: lang, id: userData.id });
    changeLanguage(lang);
  };

  return (
    <S.Nav accessHomepage={!!userData.id}>
      {!!userData.id ? (
        <Layout.Box>
          <S.MuiDarkmodeSwitch
            sx={{ m: 1 }}
            checked={darktheme}
            onChange={(e) => {
              // setDarktheme(e.target.checked ? true : false);
              dispatch(
                browserActions.addDarkThemeData({ isDarkTheme: e.target.checked ? true : false })
              );
            }}
          />
        </Layout.Box>
      ) : null}

      {languageChanger ? (
        <>
          <S.Button
            {...languageMenu.triggerProps}
            // sx={{ border: '1px solid hsl(0, 0%, 75%)', borderRadius: '5px' }}
            startIcon={<LanguageIcon />}
          >
            <S.ButtonText>{languageName}</S.ButtonText>
          </S.Button>
          <S.Menu {...languageMenu.popperProps}>
            {languageList.map((language) => (
              <S.MenuItem key={language.title}>
                <S.LanguageButton
                  type='button'
                  onClick={(e) => handleChangeLanguageClick(e, language.value)}
                >
                  <img src={language.imgSrc} />
                  <span>{language.title}</span>
                </S.LanguageButton>
              </S.MenuItem>
            ))}
          </S.Menu>
        </>
      ) : null}

      {userInfoLinker ? (
        <>
          <S.Button {...userMenu.triggerProps} startIcon={<AccountCircleIcon />}></S.Button>
          <S.CustomStyledMenu {...userMenu.popperProps}>
            <Layout.Box padding='12px 0 0'>
              <Layout.Box display='flex' padding='5px 17px 22px'>
                <Layout.Box w='65px' display='flex' justifyContent='center' flexDirection='column'>
                  <S.AvatarImg src={userData.avatarUrl} onError={onErrorImg} />
                </Layout.Box>
                <Layout.Box pl='23px' w='190px'>
                  <S.Ul>
                    <S.Li>
                      <span>{userData.name}</span>
                    </S.Li>
                    <S.Li>
                      <span>{userData.email}</span>
                    </S.Li>
                    <S.Li>
                      <Layout.Box>
                        {userData.userRight === 'ADMIN' ? (
                          <SupervisorAccountIcon
                            sx={{ fontSize: '16px', verticalAlign: '-3px', marginRight: '5px' }}
                          />
                        ) : (
                          <PersonIcon
                            sx={{ fontSize: '16px', verticalAlign: '-3px', marginRight: '5px' }}
                          />
                        )}
                        <span>{userData.userRight}</span>
                      </Layout.Box>
                    </S.Li>
                    <S.Li>
                      <Layout.Box>
                        <TranslateIcon
                          sx={{ fontSize: '16px', verticalAlign: '-3px', marginRight: '5px' }}
                        />
                        <span>{userLang}</span>
                      </Layout.Box>
                    </S.Li>
                  </S.Ul>

                  {/* <p>{userData.id}</p> */}
                </Layout.Box>
              </Layout.Box>
              <Layout.Box backgroundColor='#eee' padding='0 17px' borderTop='1px solid #ddd'>
                <Layout.Box display='flex' justifyContent='space-between'>
                  <S.MenuItemLLink>
                    <S.Button className='bottom-menu-item' onClick={() => openUserEditDialog(user)}>
                      <S.ButtonText>Profile</S.ButtonText>
                    </S.Button>
                  </S.MenuItemLLink>
                  <S.MenuItemLLink>
                    <S.Link className='bottom-menu-item logout' to='/auth/signin'>
                      {t('app-common.logOut')}
                    </S.Link>
                  </S.MenuItemLLink>
                  {/* <S.MenuItemLLink>
              <S.Link to='/homeUserInfo'>{t('app-common.user_Information')}</S.Link>
            </S.MenuItemLLink> */}
                  {/* 주문목록 탭 */}
                  {/* <S.MenuItemLLink>
              <S.Link to="/my-platforms">{t('app-common-orderlist')}</S.Link>
            </S.MenuItemLLink> */}
                </Layout.Box>
              </Layout.Box>
            </Layout.Box>
          </S.CustomStyledMenu>
        </>
      ) : null}
    </S.Nav>
  );
}
