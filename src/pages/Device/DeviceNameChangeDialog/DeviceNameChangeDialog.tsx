import React, { useState } from 'react';
import * as Modal from '@app/src/components/Modal.style';
import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import { ModalProps } from '@app/src/store/model';
import { editDevice } from '@app/src/apis/device';
import { useModal } from '@app/src/hooks/useModal';
import { Alert } from '@app/src/components/Alert';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type DeviceNameChangeDialogProps = {
  deviceId: string;
  closeDialog?: Function;
} & ModalProps;

export function DeviceNameChangeDialog(props: DeviceNameChangeDialogProps) {
  const { closeSelf, deviceId } = props;

  const modalCtrl = useModal();
  const queryClient = useQueryClient();
  const [deviceName, setDeviceName] = useState('');

  const onDeviceChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.includes(' ')) {
      modalCtrl.open(<Alert text='공백은 사용할 수 없습니다.' />);
      setDeviceName(deviceName);
      return;
    }
    setDeviceName(e.target.value);
  };

  const mutateChangeDevice = useMutation({
    mutationFn: () => editDevice(deviceName, deviceId),
    onSuccess: () => queryClient.invalidateQueries(['device']),
    onSettled: () => closeSelf(),
  });

  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body>
        <Modal.Title>기기명 변경</Modal.Title>
        <Modal.Content>
          <Layout.Box>
            <Form.Label>기기명</Form.Label>
            <Form.Input value={deviceName} onChange={onDeviceChangeName} />
          </Layout.Box>
        </Modal.Content>
        <Modal.Actions>
          <Modal.SaveButton onClick={() => mutateChangeDevice.mutate()}>저장</Modal.SaveButton>
          <Modal.CloseButton onClick={closeSelf}>닫기</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
