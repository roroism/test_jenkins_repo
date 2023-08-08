import { Alert } from '@app/src/components/Alert';
import * as Form from '@app/src/components/Form.style';
import * as Modal from '@app/src/components/Modal.style';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { ModalProps } from '@app/src/store/model';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './EmailCheckDialog.style';

type CompleteProps = {
  targetEmail: string;
} & ModalProps;

export const EmailCheckDialog = (props: CompleteProps) => {
  const { targetEmail: defaultEmail, closeSelf } = props;
  const { t } = useTranslation();
  const modalCtrl = useModal();
  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null);

  const gotoAuth = () => {
    const email = emailInputRef.current.value;
    if (email.length === 0) {
      modalCtrl.open(<Alert id='app-common.alert_write_email' />);
      return;
    }
    if (defaultEmail !== email) {
      modalCtrl.open(<Alert id='app-common.alert_wrong_email' />);
      return;
    }
    closeSelf();
    navigate('/auth/signin');
  };

  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body>
        <Modal.Title>{t('app-auth-email-check')}</Modal.Title>
        <Modal.Content>
          <S.Text>{t('app-auth-go-auth-message')}</S.Text>
          <Form.Input type='text' placeholder={defaultEmail} ref={emailInputRef} />
        </Modal.Content>
        <Modal.Actions>
          <S.ToLogInButton onClick={gotoAuth}>{t('app-auth.login-page')}</S.ToLogInButton>
          <Modal.CloseButton onClick={closeSelf}>{t('app-common.close')}</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
};
