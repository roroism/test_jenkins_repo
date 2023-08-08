import React, { useState } from 'react';
import * as Modal from '@app/src/components/Modal.style';
import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import { ModalProps } from '@app/src/store/model';
import { addGroup, editGroup } from '@app/src/apis/group';
import { useModal } from '@app/src/hooks/useModal';
import { Alert } from '@app/src/components/Alert';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type FolderNameChangeDialogProps = {
  groupId: string;
  closeDialog?: Function;
} & ModalProps;

export function FolderNameChangeDialog(props: FolderNameChangeDialogProps) {
  const { closeSelf, groupId } = props;

  const modalCtrl = useModal();
  const queryClient = useQueryClient();
  const [folderName, setFolderName] = useState('');

  const onFolderChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.includes(' ')) {
      modalCtrl.open(<Alert text='공백은 사용할 수 없습니다.' />);
      setFolderName(folderName);
      return;
    }
    setFolderName(e.target.value);
  };

  const mutateChangeGroup = useMutation({
    mutationFn: () => editGroup(folderName, groupId),
    onSuccess: () => queryClient.invalidateQueries(['group']),
    onSettled: () => closeSelf(),
  });

  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body>
        <Modal.Title>폴더명 변경</Modal.Title>
        <Modal.Content>
          <Layout.Box>
            <Form.Label>폴더명</Form.Label>
            <Form.Input value={folderName} onChange={onFolderChangeName} />
          </Layout.Box>
        </Modal.Content>
        <Modal.Actions>
          <Modal.SaveButton onClick={() => mutateChangeGroup.mutate()}>저장</Modal.SaveButton>
          <Modal.CloseButton onClick={closeSelf}>닫기</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
