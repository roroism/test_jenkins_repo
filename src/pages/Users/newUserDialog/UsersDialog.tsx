import { Asset } from '@app/src/apis/assets';
import dayjs from 'dayjs';
import {
  addUser,
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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as S from './UsersDialog.style';
import { useAssets } from '@app/src/apis/assets/useAssets';
import { APIListParams } from '@app/src/apis';
import * as Page from '@app/src/components/Page.style';
import { config } from '@app/src/config';
import { useSelector } from 'react-redux';
import { selectToken } from '@app/src/store/slices/authSlice';
import { UserDeletionDialog } from '../DeleteUser';
import { copyToClipboard } from '../../../utils';
import { Checkbox } from '@mui/material';

type UsersDialogProps = ModalProps & ({ closeAnimation?: boolean }) &
  (
    | { mode: 'ADD' }
    | { mode: 'EDIT'; baseUser: user }
    | { mode: 'PROFILE'; baseUser: user }
    | { mode: 'COPY'; baseUser: user }
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
  let today = new Date();
  today.setFullYear(today.getFullYear() + 1);
  return {
    id: '',
    username: '',
    displayName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    totalStorage: 0,
    defLanguage: 'ko',
    status: '',
    userRight: 'END_USER',
    subscribePromotion: false,
    totalDevice: '1',
    payLevel: 'FREE',
    payPeriod: 'MONTHLY',
    expiredDate: today.toDateString(),
  };
};

export function UsersDialog(props: UsersDialogProps) {
  const { mode, closeSelf, closeAnimation = true } = props;

  const { t } = useTranslation();
  const modalBodyRef = useRef(null);
  const modalBackgroundRef = useRef(null);
  const modalCtrl = useModal();
  const queryClient = useQueryClient();
  const [params, apiActions, api] = useAssets(defaultAPIListParams);
  const authToken = useSelector(selectToken());

  const openUserDeleteDialog = (user: user) => {
    console.log(user.id, user.username, user.displayName, user.email);
    modalCtrl.open(<UserDeletionDialog mode='DELETE' baseUser={user} />);
  };

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
        status: props.baseUser.status,
        defLanguage: props.baseUser.defLanguage,
        userRight: props.baseUser.userRight,
        subscribePromotion: props.baseUser.subscribePromotion,
        totalDevice: props.baseUser.totalDevice,
        payLevel: props.baseUser.payLevel,
        expiredDate: props.baseUser.expiredDate,
      };
    if (mode === 'PROFILE')
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
    if (mode === 'COPY')
      return {
        id: props.baseUser.id,
        username: props.baseUser.username,
        displayName: props.baseUser.displayName,
        email: props.baseUser.email,
        password: props.baseUser.password,
        passwordConfirm: props.baseUser.passwordConfirm,
        totalStorage: props.baseUser.totalStorage,
        defLanguage: props.baseUser.defLanguage,
        userRight: props.baseUser.userRight,
        subscribePromotion: props.baseUser.subscribePromotion,
        totalDevice: props.baseUser.totalDevice,
        payLevel: props.baseUser.payLevel,
        expiredDate: props.baseUser.expiredDate,
      };
  }, []);

  const [usedFields, setUsedFields] = useState({
    isplayName: false,
    username: false,
    mail: false,
    password: false,
    passwordConfirm: false,
    totalStorage: false,
    defLanguage: false,
    userRight: false,
    subscribePromotion: false,
    totalDevice: false,
    payLevel: false,
    expiredDate: false,
    PayPeriod: false,
  });

  const [user, userActions] = useTypeSafeReducer(defaultUser, {
    set: (_, user: user) => user,
    onUserDisplayNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.displayName = e.target.value;
    },
    onUserUsernameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.username = e.target.value;
    },
    onUserEmailChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.email = e.target.value;
    },
    onUserPasswordChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.password = e.target.value;
      console.log(state.password.length);
    },
    onUserPasswordConfirmChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.passwordConfirm = e.target.value;
    },
    onUserTotalStorageChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.totalStorage = Number(e.target.value);
    },
    onUserdefLanguageChange: (state, e: any) => {
      state.defLanguage = e.target.value;
    },
    onUseruserRightChange: (state, e: any) => {
      state.userRight = e.target.value;
    },
    onUsersubscribePromotionChange: (state, e: any) => {
      state.subscribePromotion = Boolean(e.target.value);
    },
    onUsertotalDeviceChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.totalDevice = e.target.value;
    },
    onUserpayLevelChange: (state, e: any) => {
      state.payLevel = e.target.value;
    },
    onUserexpiredDateChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.expiredDate = e.target.value;
    },
    onUserPayPeriodChange: (state, e: any) => {
      state.payPeriod = e.target.value;
    },
  });

  const mutateCreateUser = useMutation({
    mutationFn: () => addUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      closeSelf();
    },
    onError: (e) => modalCtrl.open(<Alert text='user was not created' />),
  });

  const mutateEditUser = useMutation({
    mutationFn: () => editUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      closeSelf();
    },
    onError: () => modalCtrl.open(<Alert text='User was not edited' />),
  });

  const changePasswordMutate = useMutation({
    mutationFn: () => changePassword(user),
    onSuccess: () => {
      closeSelf();
    },
    onError: () => modalCtrl.open(<Alert text="User's password was not edited" />),
  });
  /*
  const openAssetAddDialog = () => {
    modalCtrl.open(<Selection availables={['IMAGE']} onSelect={userActionsActions.onAssetSelect} />);
  };
*/

  const submitEdit = () => {
    mutateEditUser.mutate();
    changePasswordMutate.mutate();
  };
  const isUsernameValid = user.username.length !== 0;
  const isDisplayNameValid = user.displayName.length !== 0;
  const isEmailValid = user.email.length !== 0;
  const isPasswordPresent = user.password.length > 0;
  const isPasswordValid = user.password.length > 4;
  const passwordsMatch = user.password === user.passwordConfirm;

  const isMutating = mutateCreateUser.isLoading || mutateEditUser.isLoading;
  const istotalStorageValid = user.totalStorage >= 0;
  const isdefLanguageValid = user.defLanguage.length !== 0;
  const isuserRightValid = user.userRight.length !== 0;
  const issubscribePromotionValid = typeof user.subscribePromotion === 'boolean';
  const istotalDeviceValid = user.totalDevice;
  const ispayLevelValid = user.payLevel.length !== 0;
  const isexpiredDateValid = user.expiredDate.length !== 0;

  const isButtonDisabled =
    isMutating ||
    !isUsernameValid ||
    !isDisplayNameValid ||
    !isEmailValid ||
    !istotalStorageValid ||
    !isdefLanguageValid! ||
    !isuserRightValid ||
    !istotalDeviceValid ||
    !ispayLevelValid ||
    !isexpiredDateValid ||
    (mode === 'EDIT' && isPasswordPresent && !(isPasswordValid && passwordsMatch)) ||
    (mode === 'ADD' && !(isPasswordPresent && isPasswordValid && passwordsMatch));

  console.log(
    isMutating,
    !isUsernameValid,
    !isDisplayNameValid,
    !isEmailValid,
    !istotalStorageValid,
    !isdefLanguageValid!,
    !isuserRightValid,
    !istotalDeviceValid,
    !ispayLevelValid,
    !isexpiredDateValid,
    !passwordsMatch
  );

  const closeWithAnimation = useCallback(() => {
    modalBodyRef.current.classList.add('close');
    modalBackgroundRef.current.classList.add('close');
    setTimeout(() => {
      closeSelf();
    }, 400);
  }, []);

  const onClose = () => {
    if (closeAnimation) {
      closeWithAnimation();
    } else {
      closeSelf();
    }
  };

  return (
    <Modal.Container>
      <Modal.Background ref={modalBackgroundRef} onClick={onClose} />
      <Modal.Body ref={modalBodyRef} width='75%'>
        <Modal.Title>Edit user</Modal.Title>
        <S.Content>
          {/* Basic Settings */}
          <Layout.Box>
            <Layout.SubTitle>{t('app-common.basic-setting')}</Layout.SubTitle>
            <Layout.Box mb='20px'>
              <Form.Label htmlFor='username'>Username (10자 미만)</Form.Label>
              {!isUsernameValid ? (
                <Form.ErrMsg>Username must be a lower-case alpha-numerical.</Form.ErrMsg>
              ) : null}

              <Form.Input
                id='username'
                type='text'
                value={user.username}
                onChange={(e) => userActions.onUserUsernameChange(e)}
                minLength={1}
                maxLength={30}
                autoComplete='off'
                autoCorrect='off'
              />
            </Layout.Box>

            <Layout.Box mb='20px'>
              <Form.Label htmlFor='displayName'>User's display name</Form.Label>
              {!isUsernameValid ? <Form.ErrMsg>Display name cannot be empty.</Form.ErrMsg> : null}
              <Form.Input
                id='displayName'
                type='text'
                minLength={1}
                maxLength={30}
                value={user.displayName}
                onChange={(e) => userActions.onUserDisplayNameChange(e)}
                autoComplete='off'
                autoCorrect='off'
              />
            </Layout.Box>

            <Layout.Box mb='20px'>
              <Form.Label htmlFor='email'>User's email</Form.Label>
              {!isEmailValid ? <Form.ErrMsg>Email cannot be empty</Form.ErrMsg> : null}
              <Form.Input
                id='email'
                type='email'
                minLength={1}
                maxLength={30}
                value={user.email}
                onChange={(e) => userActions.onUserEmailChange(e)}
                autoComplete='off'
                autoCorrect='off'
              />
            </Layout.Box>

            <Layout.Box mb='20px'>
              <Form.Label htmlFor='expiredDate'>Account Expiry Date</Form.Label>
              {!isexpiredDateValid ? (
                <Form.ErrMsg>Account expiration date cannot be empty</Form.ErrMsg>
              ) : null}
              <Form.Input
                id='expiredDate'
                type='datetime-local'
                minLength={1}
                maxLength={30}
                value={dayjs(user.expiredDate).format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => userActions.onUserexpiredDateChange(e)}
                autoComplete='off'
                autoCorrect='off'
              />
            </Layout.Box>

            <Layout.Box mb='20px'>
              <Form.Label htmlFor='defLanguage'>User's language</Form.Label>

              <Form.Select
                id='defLanguage'
                onChange={(e) => userActions.onUserdefLanguageChange(e)}
                value={user.defLanguage}
              >
                <Form.Option value={'ko'}>Korean</Form.Option>
                <Form.Option value={'en'}>English</Form.Option>
              </Form.Select>
              {!isdefLanguageValid ? <Form.ErrMsg>Language cannot be empty</Form.ErrMsg> : null}
            </Layout.Box>
            <Layout.Box mb='20px'>
              <Form.Label htmlFor='userRight'>User's rights</Form.Label>

              <Form.Select
                id='userRight'
                onChange={(e) => userActions.onUseruserRightChange(e)}
                value={user.userRight}
              >
                <Form.Option value={'END_USER'}>END_USER</Form.Option>
                <Form.Option value={'ADMIN'}>ADMIN</Form.Option>
                <Form.Option value={'ANONYMOUS'}>ANONYMOUS</Form.Option>
              </Form.Select>
              {!isuserRightValid ? <Form.ErrMsg>userRight cannot be empty</Form.ErrMsg> : null}
            </Layout.Box>
          </Layout.Box>
          {/* Title Properties */}
          <Layout.Box>
            <Layout.SubTitle>Payment Settings</Layout.SubTitle>
            <Layout.Box mb='20px'>
              <Form.Label htmlFor='payLevel'>User's payLevel</Form.Label>
              {!ispayLevelValid ? <Form.ErrMsg>payLevel cannot be empty</Form.ErrMsg> : null}
              <Form.Select
                id='payLevel'
                onChange={(e) => userActions.onUserpayLevelChange(e)}
                value={user.payLevel}
              >
                <Form.Option value={'FREE'}>FREE</Form.Option>
                <Form.Option value={'COPPER'}>COPPER</Form.Option>
                <Form.Option value={'SILVER'}>SILVER</Form.Option>
                <Form.Option value={'GOLD'}>GOLD</Form.Option>
                <Form.Option value={'DIAMOND'}>DIAMOND</Form.Option>
              </Form.Select>
            </Layout.Box>
            <Layout.Box mb='20px'>
              <Form.Label htmlFor='payPeriod'>User's payment plan</Form.Label>

              <Form.Select
                id='payPeriod'
                onChange={(e) => userActions.onUserPayPeriodChange(e)}
                value={user.payPeriod}
              >
                <Form.Option value={'MONTHLY'}>Monthly</Form.Option>
                <Form.Option value={'YEARLY'}>Yearly</Form.Option>
              </Form.Select>
              {!isdefLanguageValid ? <Form.ErrMsg>Payment plan cannot be empty</Form.ErrMsg> : null}
            </Layout.Box>
            <Layout.Box mb='20px'>
              <Form.Label htmlFor='totalStorage'>User's total storage</Form.Label>
              {!istotalStorageValid ? <Form.ErrMsg>totalStorage cannot be zero</Form.ErrMsg> : null}
              <Form.Input
                id='totalStorage'
                type='number'
                min={0}
                value={user.totalStorage}
                onChange={(e) => userActions.onUserTotalStorageChange(e)}
                autoComplete='off'
                autoCorrect='off'
              />
            </Layout.Box>
            <Form.Label htmlFor='totalDevice'>User's totalDevice</Form.Label>
            {!istotalDeviceValid ? <Form.ErrMsg>totalDevice cannot be empty</Form.ErrMsg> : null}
            <Form.Input
              id='totalDevice'
              type='number'
              minLength={1}
              maxLength={30}
              value={user.totalDevice}
              onChange={(e) => userActions.onUsertotalDeviceChange(e)}
              autoComplete='off'
              autoCorrect='off'
            />
          </Layout.Box>
          {/* Password Settings */}
          <Layout.Box>
            <Layout.SubTitle>Password Settings</Layout.SubTitle>
            <Layout.Box mb='20px'>
              <Form.Label htmlFor='newPassword'>New password</Form.Label>
              {mode === 'ADD' || isPasswordPresent
                ? !isPasswordValid && (
                  <Form.ErrMsg>Password must be longer than 4 characters</Form.ErrMsg>
                )
                : null}
              <Form.Input
                id='newPassword'
                type='password'
                minLength={1}
                maxLength={30}
                value={user?.password}
                onChange={(e) => userActions.onUserPasswordChange(e)}
                autoComplete='new-password'
                autoCorrect='off'
              />
            </Layout.Box>
            {user.password.length > 0 && (
              <Layout.Box mb='20px'>
                <Form.Label htmlFor='passwordConfirm'>Confirm password</Form.Label>
                <Form.Input
                  id='passwordConfirm'
                  type='password'
                  minLength={1}
                  maxLength={30}
                  value={user?.passwordConfirm}
                  onChange={(e) => userActions.onUserPasswordConfirmChange(e)}
                  autoComplete='off'
                  autoCorrect='off'
                />
                {!passwordsMatch ? <Form.ErrMsg>Passwords dont match</Form.ErrMsg> : null}
              </Layout.Box>
            )}
          </Layout.Box>
        </S.Content>
        <Modal.Actions>
          {mode === 'ADD' ? (
            <Modal.SaveButton onClick={() => mutateCreateUser.mutate()} disabled={isButtonDisabled}>
              Save
            </Modal.SaveButton>
          ) : null}
          {mode === 'EDIT' ? (
            <Modal.SaveButton onClick={() => mutateEditUser.mutate()} disabled={isButtonDisabled}>
              Edit
            </Modal.SaveButton>
          ) : null}
          <Modal.CloseButton disabled={isMutating} onClick={onClose}>
            Close
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
