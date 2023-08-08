import * as Modal from '@app/src/components/Modal.style';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { ModalProps } from '@app/src/store/model';
import React, { useCallback, useRef } from 'react';
import * as S from './Confirm.style';

type ConfirmProps = {
  id?: string;
  text?: string;
  disableAutoClose?: boolean;
  onConfirmed?: () => void;
  onCanceled?: () => void;
  closeAnimation?: boolean;
} & ModalProps;

/**
 * @description material-ui 의 confim message box 컴포넌트
 */
export function Confirm(props: ConfirmProps) {
  const { closeSelf, id, text, onConfirmed, onCanceled, disableAutoClose, closeAnimation = true } = props;
  const { t } = useTranslation();
  const modalBodyRef = useRef(null);
  const modalBackgroundRef = useRef(null);

  const closeWithAnimation = useCallback(() => {
    modalBodyRef.current.classList.add('close');
    modalBackgroundRef.current.classList.add('close');

    setTimeout(() => {
      !disableAutoClose && closeSelf?.();
    }, 400);
  }, []);

  const onConfirmClick = useCallback(() => {
    if (closeAnimation) {
      onConfirmed?.();
      closeWithAnimation();
    } else {
      onConfirmed?.();
      !disableAutoClose && closeSelf();
    }
  }, [closeAnimation]);

  const onCancelClick = useCallback(() => {
    if (closeAnimation) {
      onCanceled?.();
      closeWithAnimation();
    } else {
      onCanceled?.();
      !disableAutoClose && closeSelf();
    }
  }, [closeAnimation]);

  return (
    <Modal.Container>
      <Modal.Background ref={modalBackgroundRef} onClick={onCancelClick} />
      <Modal.Body ref={modalBodyRef}>
        <Modal.Title>{t('app-common.confirm')}</Modal.Title>
        <Modal.Content>
          <S.Paragraph>{id ? t(id) : text}</S.Paragraph>
        </Modal.Content>
        <Modal.Actions>
          <Modal.SaveButton onClick={onConfirmClick} autoFocus>
            {t('app-showmessagebox.yes')}
          </Modal.SaveButton>
          <Modal.CloseButton onClick={onCancelClick}>
            {t('app-showmessagebox.no')}
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
