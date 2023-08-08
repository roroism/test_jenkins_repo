import { BaseNavBar } from '@app/src/components/BaseNavBar';
import * as Layout from '@app/src/components/Layout.style';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { Checkbox, Typography } from '@mui/material';
import CublickLoginLogo from '@app/resources/cublickLoginLogo.svg';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './Terms.style';

export function Terms() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [nextOnchange1, setNextOnchange1] = useState(false);
  const [nextOnchange2, setNextOnchange2] = useState(false);

  const onChangeUsePresentation1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNextOnchange1(e.target.checked);
  };

  const onChangeUsePresentation2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNextOnchange2(e.target.checked);
  };

  const linkToSignIn = () => {
    navigate('/auth/signin');
  };

  const linkToSignUpForm = () => {
    navigate('/auth/signup/form');
  };

  return (
    <S.Container>
      <S.Content>
        <Layout.Box mt='20px' textAlign='center'>
          <S.BrandButton onClick={linkToSignIn}>
            <img className='brand-logo' src={CublickLoginLogo} />
          </S.BrandButton>
        </Layout.Box>
        <BaseNavBar languageChanger />
        <S.Form>
          <Layout.Box mb='20px'>
            <S.BoxTitle>{t('app-register.agree-title')}</S.BoxTitle>
            <S.Paper elevation={3}>
              {t('app-termsofsevice-1-1')},{t('app-termsofsevice-1-2')},{t('app-termsofsevice-2-1')}
            </S.Paper>
            <S.FormControlLabel
              label={<Typography fontSize={14}>{t('app-register.agree')}</Typography>}
              control={<Checkbox color='secondary' onChange={onChangeUsePresentation1} />}
            />
          </Layout.Box>
          <Layout.Box mb='20px'>
            <S.BoxTitle>{t('app-register.agree-title2')}</S.BoxTitle>
            <S.Paper elevation={3}>{t('app-termsofsevice-4')}</S.Paper>
            <S.FormControlLabel
              label={<Typography fontSize={14}>{t('app-register.agree2')}</Typography>}
              control={<Checkbox color='secondary' onChange={onChangeUsePresentation2} />}
            />
          </Layout.Box>
          <S.ToNextButton disabled={!(nextOnchange1 && nextOnchange2)} onClick={linkToSignUpForm}>
            {t('app-common.confirm')}
          </S.ToNextButton>
        </S.Form>
        <Layout.Box margin='20px 0px' textAlign='center'>
          <S.ToLogInButton onClick={linkToSignIn}>{t('app-auth.login-page')}</S.ToLogInButton>
        </Layout.Box>
      </S.Content>
    </S.Container>
  );
}
