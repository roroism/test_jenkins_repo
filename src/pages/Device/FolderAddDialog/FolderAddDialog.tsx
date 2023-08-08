import React, { useState } from 'react';
import * as Modal from '@app/src/components/Modal.style';
import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import { ModalProps } from '@app/src/store/model';
import { addGroup } from '@app/src/apis/group';
import { useModal } from '@app/src/hooks/useModal';
import { Alert } from '@app/src/components/Alert';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type FolderAddDialogProps = {} & ModalProps;

export function FolderAddDialog(props: FolderAddDialogProps) {
  const { closeSelf } = props;

  const modalCtrl = useModal();
  const queryClient = useQueryClient();
  const [folderName, setFolderName] = useState('');

  const onFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.includes(' ')) {
      modalCtrl.open(<Alert text='공백은 사용할 수 없습니다.' />);
      setFolderName(folderName);
      return;
    }
    setFolderName(e.target.value);
  };

  const mutateAddGroup = useMutation({
    mutationFn: () => addGroup({ name: folderName }),
    onSuccess: () => queryClient.invalidateQueries(['group']),
    onError: () => modalCtrl.open(<Alert text='폴더 추가에 실패하였습니다.' />),
    onSettled: () => closeSelf(),
  });

  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body>
        <Modal.Title>폴더추가</Modal.Title>
        <Modal.Content>
          <Layout.Box>
            <Form.Label>폴더명</Form.Label>
            <Form.Input value={folderName} onChange={onFolderNameChange} />
          </Layout.Box>
        </Modal.Content>
        <Modal.Actions>
          <Modal.SaveButton onClick={() => mutateAddGroup.mutate()}>저장</Modal.SaveButton>
          <Modal.CloseButton onClick={closeSelf}>닫기</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
