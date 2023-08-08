import CublickLoginLogo from '@app/resources/cublickLoginLogo.svg';
import { fetchSignIn } from '@app/src/apis/auth';
import { BaseNavBar } from '@app/src/components/BaseNavBar';
import * as Layout from '@app/src/components/Layout.style';
import { config } from '@app/src/config';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { authActions } from '@app/src/store/slices/authSlice';
import CircularProgress from '@mui/material/CircularProgress';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as S from './SignIn.style';
import { LanguageContext } from '@app/src/LanguageProvider';

/**
 * @description 로그인 시 ID , PASSWORD를 입력하는 UI 컴포넌트
 */
export function SignIn() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const modalCtrl = useModal();
  const navigate = useNavigate();
  const [credential, setCredential] = useState({ username: '', password: '' });
  const { changeLanguage, languageName } = useContext(LanguageContext);

  const mutateLogin = useMutation({
    mutationFn: () => fetchSignIn(credential),
    onSuccess: (data) => {
      const { token, ...other } = data.data;
      const userData = {
        name: other.displayName,
        email: other.email,
        userRight: other.userRight,
        avatarUrl: `${config.EXTERNAL.CUBLICK._ROOT}${other.avatarUrl}`,
        lang: other.defLanguage,
        id: other.id,
        // username: other.username,
        // payLevel: other.payLevel
      };
      changeLanguage(other.defLanguage);
      dispatch(authActions.signInSuccess({ token, userData }));
      navigate('/');
    },
  });

  const onCredentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredential((prev) => ({ ...prev, [name]: value }));
  };

  const onSignIn = (e: React.SyntheticEvent) => {
    e.preventDefault();
    mutateLogin.mutate();
  };

  const onEnterSubmit = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') onSignIn(e);
  };

  useEffect(() => {
    dispatch(authActions.signOut());
    modalCtrl.closeAll();
  }, []);

  const status = (mutateLogin.error as AxiosError)?.response?.status;
  let errMsgId = 'app-auth.signin-form.msg-error.server';
  if (!status) errMsgId = '';
  if (status === 404) errMsgId = 'app-auth.err-msg.id5';
  if (status === 422) errMsgId = 'app-auth.err-msg.pw4';

  const isButtonDisabled =
    !(credential.username.length >= 4 && credential.password.length >= 4) || mutateLogin.isLoading;

  return (
    <S.Container>
      <S.Content>
        <Layout.Box textAlign='center'>
          <S.BrandButton>
            <img className='brand-logo' src={CublickLoginLogo} />
          </S.BrandButton>
        </Layout.Box>
        <BaseNavBar languageChanger />
        <S.Form mb='20px' as='form' onSubmit={onSignIn} onKeyDown={onEnterSubmit}>
          <S.Title>{t('app-auth.signin')}</S.Title>
          <Layout.Box mb='14px'>
            <S.Input
              name='username'
              type='text'
              onChange={onCredentialChange}
              placeholder={t('app-auth.enterusername')}
              disabled={mutateLogin.isLoading}
              error={status === 404}
              autoFocus
            />
          </Layout.Box>
          <Layout.Box mb='20px'>
            <S.Input
              name='password'
              type='password'
              onChange={onCredentialChange}
              placeholder={t('app-auth.writepass')}
              disabled={mutateLogin.isLoading}
              error={status === 422}
            />
          </Layout.Box>
          {!!errMsgId ? <S.Error>{t(errMsgId)}</S.Error> : null}
          <S.SignInButton type='submit' disabled={isButtonDisabled}>
            {mutateLogin.isLoading ? <CircularProgress size={15} /> : t('app-auth.signin')}
          </S.SignInButton>
        </S.Form>

        <S.FootBox>
          <S.Link to='/auth/forgot'>{t('app-auth.findpassword')}</S.Link>
          <S.Separator>|</S.Separator>
          <S.Link to='/auth/signup'>{t('app-auth.register')}</S.Link>
        </S.FootBox>
      </S.Content>
    </S.Container>
  );
}
