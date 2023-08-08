import { useTranslation } from '@app/src/hooks/useTranslation';
import { ModalProps } from '@app/src/store/model';
import React, { useCallback, useRef } from 'react';
import * as Modal from '@app/src/components/Modal.style';
import * as S from './Alarm.style';

interface AlarmProps extends ModalProps {
  id?: string;
  text?: string;
  disableAutoClose?: boolean;
  extraText?: string;
  onClose?: () => void;
  closeAnimation?: boolean;
}

/**
* @description material-ui의 alarm message box 컴포넌트
* @param { AlarmProps } props
*/
export function Alarm(props: AlarmProps) {
  const { closeSelf, id, text, extraText, onClose, disableAutoClose, closeAnimation = true } = props;
  const { t } = useTranslation();
  const modalBodyRef = useRef(null);
  const modalBackgroundRef = useRef(null);

  const closeWithAnimation = useCallback(() => {
    modalBodyRef.current.classList.add('close');
    modalBackgroundRef.current.classList.add('close');

    setTimeout(() => {
      onClose?.();
      !disableAutoClose && closeSelf?.();
    }, 400);
  }, []);

  const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === 'Escape') close();
    if (e.key === 'Space') close();
    if (e.key === 'Enter') close();
  };

  const close = () => {
    if (closeAnimation) {
      closeWithAnimation();

    } else {
      onClose?.();
      !disableAutoClose && closeSelf?.();
    }
  };

  return (
    <Modal.Container tabIndex={0} onKeyUp={onKeyUp}>
      <Modal.Background ref={modalBackgroundRef} onClick={close} />
      <Modal.Body ref={modalBodyRef}>
        <S.Title>{t('app-common-success')}</S.Title>
        <Modal.Content>
          <S.Paragraph>
            {id ? t(id) : text}
            {extraText && (
              <>
                <br /><br />
                {extraText}
              </>
            )}
          </S.Paragraph>
        </Modal.Content>
        <Modal.Actions>
          <S.CloseButton autoFocus onClick={close}>
            {t('app-common.close')}
          </S.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}