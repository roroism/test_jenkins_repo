import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import * as Modal from '@app/src/components/Modal.style';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { ModalProps } from '@app/src/store/model';
import React, { useState } from 'react';

type DeviceSleepModeDialogProps = {
  defaultOnTime: string;
  defaultOffTime: string;
  onChange: (offTime: string, onTime: string) => void;
} & ModalProps;

export function DeviceSleepModeDialog(props: DeviceSleepModeDialogProps) {
  const { closeSelf, onChange, defaultOffTime, defaultOnTime } = props;

  const { t } = useTranslation();
  const [offTime, setOffTime] = useState(defaultOffTime || '08:00');
  const [onTime, setOnTime] = useState(defaultOnTime || '19:00');

  const onSaveClick = () => {
    onChange(offTime, onTime);
    closeSelf();
  };

  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body>
        <Modal.Title>{t('app-device.detail.tab.features.sleep')}</Modal.Title>
        <Modal.Content>
          <Layout.Box mb='20px'>
            <Form.Label htmlFor='off-time'>{t('offTime')}</Form.Label>
            <Form.Input
              id='on-time'
              type='time'
              defaultValue={defaultOnTime || '19:00'}
              onChange={(e) => setOnTime(e.target.value)}
            />
          </Layout.Box>
          <Layout.Box>
            <Form.Label htmlFor='on-time'>{t('onTime')}</Form.Label>
            <Form.Input
              id='off-time'
              type='time'
              defaultValue={defaultOffTime || '08:00'}
              onChange={(e) => setOffTime(e.target.value)}
            />
          </Layout.Box>
        </Modal.Content>
        <Modal.Actions>
          <Modal.SaveButton onClick={onSaveClick}>{t('app-common.apply')}</Modal.SaveButton>
          <Modal.CloseButton onClick={closeSelf}>{t('app-common.close')}</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
