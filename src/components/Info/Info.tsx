import * as Modal from '@app/src/components/Modal.style';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { ModalProps } from '@app/src/store/model';
import React from 'react';
import * as S from './Info.style';

type InfoProps = {
  id?: string;
  text?: string;
  onClose?: () => void;
} & ModalProps;

/**
 * @description material-ui 의 confim message box 컴포넌트
 */
export function Info(props: InfoProps) {
  const { closeSelf, id, text, onClose } = props;
  const { t } = useTranslation();

  const onCloseClick = () => {
    onClose?.();
    closeSelf();
  };

  return (
    <Modal.Container tabIndex={0}>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body>
        <Modal.Title>{t('app-common.confirm')}</Modal.Title>
        <Modal.Content>
          <S.P>{id ? t(id) : text}</S.P>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton onClick={onCloseClick} autoFocus>
            {t('app-common.close')}
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
