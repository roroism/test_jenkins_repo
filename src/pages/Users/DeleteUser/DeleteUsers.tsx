import { Asset } from '@app/src/apis/assets';
import {
  addUser,
  deleteUser,
  user,
  usersAPIResponse,
  editUser,
  userEdit,
  changePassword,
} from '@app/src/apis/users'; // userEdit = type; editUser = func
import { Alert } from '@app/src/components/Alert';
import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import * as Modal from '@app/src/components/Modal.style';
import { AssetSelection } from '@app/src/components/Selection/AssetSelection';
import { Selection } from '@app/src/components/Selection';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { useTypeSafeReducer } from '@app/src/hooks/useTypeSafeReducer';
import { ModalProps } from '@app/src/store/model';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import * as S from './DeleteUsers.style';
import { useAssets } from '@app/src/apis/assets/useAssets';
import { APIListParams } from '@app/src/apis';
import * as Page from '@app/src/components/Page.style';
import { config } from '@app/src/config';
import { useSelector } from 'react-redux';
import { selectToken } from '@app/src/store/slices/authSlice';
import { WarningContent } from './DeleteUsers.style';
import { useDispatch } from 'react-redux';
import { authActions } from '@app/src/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

type UsersDialogProps = ModalProps &
  (
    | { mode: 'ADD' }
    | { mode: 'EDIT'; baseUser: user }
    | { mode: 'DELETE'; baseUser: { id: string; displayName: string; status?: string } }
    | {
        mode: 'DELETE SELF';
        baseUser: { id: string; displayName: string; status?: string };
        setSucessfullProxyAction: any;
      }
  );

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 40,
  order: 'DESC',
  sort: '-updateDate',
  filter: [
    { key: 'isSystem', operator: '=', value: 'true' },
    { key: 'isPrivate', operator: '=', value: 'false' },
    { key: 'owner', operator: '=', value: 'mine' },
  ],
  q: '',
  filterMode: 'AND',
};

const createUser = (): user => {
  return {
    id: '',
    username: '',
    displayName: '',
    email: '',
    password: '',
    status: '',
    passwordConfirm: '',
    totalStorage: 0,
    defLanguage: '',
    userRight: '',
    subscribePromotion: false,
    totalDevice: '',
    payLevel: '',
    expiredDate: '',
  };
};

export function UserDeletionDialog(props: UsersDialogProps) {
  const { mode, closeSelf } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const modalCtrl = useModal();
  const queryClient = useQueryClient();
  const [params, apiActions, api] = useAssets(defaultAPIListParams);
  const authToken = useSelector(selectToken());

  const defaultUser = useMemo(() => {
    if (mode === 'ADD') return createUser();
    if (mode === 'EDIT')
      return {
        id: props.baseUser.id,
        username: props.baseUser.username,
        displayName: props.baseUser.displayName,
        email: props.baseUser.email,
        password: props.baseUser.password || '',
        passwordConfirm: '',
        totalStorage: props.baseUser.totalStorage,
        defLanguage: props.baseUser.defLanguage,
        userRight: props.baseUser.userRight,
        subscribePromotion: props.baseUser.subscribePromotion,
        totalDevice: props.baseUser.totalDevice,
        payLevel: props.baseUser.payLevel,
        expiredDate: props.baseUser.expiredDate,
      };
    if (mode === 'DELETE' || mode === 'DELETE SELF')
      return {
        id: props.baseUser.id,
        displayName: props.baseUser.displayName,
        status: props.baseUser.status,
      };
  }, []);

  const [user, userActions] = useTypeSafeReducer(defaultUser, {
    set: (_, user: user) => user,
  });
  console.log(user?.id);
  const mutateDeleteUser = useMutation({
    mutationFn: () => deleteUser(user.id),
    onSuccess: () => {
      console.log('done');
      if (mode === 'DELETE SELF') {
        console.log('deactivating myself');
        props.setSucessfullProxyAction(true);
        navigate('/auth/signin');
        dispatch(authActions.signOut());
      }
      queryClient.invalidateQueries(['users']);
      closeSelf();
    },
    onError: () => modalCtrl.open(<Alert text='Unable to deactivate the account' />),
  });
  /*
  const openAssetAddDialog = () => {
    modalCtrl.open(<Selection availables={['IMAGE']} onSelect={userActionsActions.onAssetSelect} />);
  };
*/

  const isMutating = mutateDeleteUser.isLoading;

  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body>
        <Modal.Title>{user?.status === 'DELETED' ? `Delete` : 'Deactivate'} User</Modal.Title>
        <Modal.Content>
          <S.WarningContent>
            Are you sure you want to {user?.status === 'DELETED' ? `delete` : 'deactivate'}{' '}
            {user?.displayName}?
          </S.WarningContent>
        </Modal.Content>
        <Modal.Actions>
          <Modal.DeleteButton onClick={() => mutateDeleteUser.mutate()} disabled={isMutating}>
            Delete
          </Modal.DeleteButton>

          <Modal.CloseButton disabled={isMutating} onClick={closeSelf}>
            Close
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
