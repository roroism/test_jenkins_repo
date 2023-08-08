import { passwordResetEmailRequest } from '@app/src/apis/auth';
import { Alert } from '@app/src/components/Alert';
import { BaseNavBar } from '@app/src/components/BaseNavBar';
import { Info } from '@app/src/components/Info';
import * as Layout from '@app/src/components/Layout.style';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import CublickLoginLogo from '@app/resources/cublickLoginLogo.svg';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './ForgotPassword.style';

export function ForgotPassword() {
  const modalCtrl = useModal();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [emailInfo, setEmailInfo] = useState('');

  const passwordResetEmailRequestApi = useMutation({
    mutationFn: () => passwordResetEmailRequest({ email: emailInfo }),
    onSuccess: () => {
      modalCtrl.open(<Info id='app-auth.forgotpassword.email_complete' onClose={linkToSigIn} />);
    },
    onError: (error: AxiosError<any>) => {
      const idMapper = {
        invalid_email: 'app-common.alert_invalid_email',
        available_email: 'app-common.alert_available_email',
        wrong_email: 'app-common.alert_wrong_email',
        unavailable: 'app-common.alert_unavailable',
      };
      const id = idMapper[error.response.data.message];
      modalCtrl.open(<Alert id={id} />);
    },
  });

  const linkToSigIn = () => {
    navigate('/auth/signin');
  };

  const isButtonDisable = !emailInfo.includes('@');
  return (
    <S.Container>
      <S.Content>
        <Layout.Box mt='5px' textAlign='center'>
          <S.BrandButton onClick={linkToSigIn}>
            <img className='brand-logo' src={CublickLoginLogo} />
          </S.BrandButton>
        </Layout.Box>
        <BaseNavBar languageChanger />
        <S.Form>
          <S.Title>{t('app-auth.password-reset')}</S.Title>
          <Layout.Box mb='20px'>
            <S.Input
              type='text'
              onChange={(e) => setEmailInfo(e.target.value)}
              placeholder={t('app-common.alert_write_email')}
              autoFocus
            />
          </Layout.Box>
          <S.SendButton
            onClick={() => passwordResetEmailRequestApi.mutate()}
            disabled={isButtonDisable}
          >
            {t('app-auth.forgotpassword-resend')}
          </S.SendButton>
        </S.Form>
        <Layout.Box textAlign='center' margin='10px 0px'>
          <S.ToLogInButton onClick={linkToSigIn}>{t('app-auth.login-page')}</S.ToLogInButton>
        </Layout.Box>
      </S.Content>
    </S.Container>
  );
}
