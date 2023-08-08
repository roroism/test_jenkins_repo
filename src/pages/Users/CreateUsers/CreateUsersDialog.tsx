import { Asset } from '@app/src/apis/assets';

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
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect, useMemo, useState } from 'react';
import * as S from './CreateUsersDialog.style';
import { useAssets } from '@app/src/apis/assets/useAssets';
import { APIListParams } from '@app/src/apis';
import * as Page from '@app/src/components/Page.style';
import { config } from '@app/src/config';
import { useSelector } from 'react-redux';
import { selectToken } from '@app/src/store/slices/authSlice';
import { css } from '@emotion/react';
import { Http2ServerResponse } from 'http2';

type CreateUsersDialogProps = ModalProps &
  (
    | { mode: 'ADD' }
    // | { mode: 'EDIT'; baseCategory: UsersAPIResponse }
    | { mode: 'EDIT'; baseCategory: any }
  );

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 40,
  order: 'DESC',
  sort: '-updateDate',
  filter: [
    // { key: 'isSystem', operator: '=', value: 'true' },
    // { key: 'isPrivate', operator: '=', value: 'false' },
    // { key: 'owner', operator: '=', value: 'mine' },
  ],
  q: '',
  filterMode: 'AND',
};

const createUsers = (): any => {
  return {
    id: '',
    username: '',
    email: '',
    password: '',
  };
};

interface userManagement {
  username: string;
  displayName: string;
  email: string;
  storage: string;
  deviceResisterLimit: string;
  password: string;
  passwordConfirm: string;
}

export function CreateUsersDialog(props: CreateUsersDialogProps) {
  const { mode, closeSelf } = props;

  const { t } = useTranslation();
  const modalCtrl = useModal();
  const queryClient = useQueryClient();

  const defaultUsers = useMemo(() => {
    if (mode === 'ADD') return createUsers();
    if (mode === 'EDIT')
      return {
        // id: props.baseCategory.id,
        // name: props.baseCategory.name,
        // speed: props.baseCategory.speed,
        // iconId: props.baseCategory.iconId,
        // iconName: props.baseCategory.iconName,
      };
  }, []);

  const [user, userActions] = useTypeSafeReducer(defaultUsers, {
    set: (_, user: userManagement) => user,
    onUserIdChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.id = e.target.value;
    },
    onUserNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.username = e.target.value;
    },
    onDisplayNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.displayName = e.target.value;
    },
    onEmailChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.email = e.target.value;
    },
    onUserdefLanguageChange: (state, e: any) => {
      state.defLanguage = e.target.value;
    },
    onStorageChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.storage = e.target.value;
    },
    onDeviceResisterLimit: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.deviceResisterLimit = e.target.value;
    },
    onUseruserRightChange: (state, e: any) => {
      state.userRight = e.target.value;
    },
    onPassword: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.password = e.target.value;
    },
    onPasswordConfirm: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.passwordConfirm = e.target.value;
    },
  });

  const mutateCreateUser = useMutation({
    mutationFn: () => addUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      closeSelf();
    },
    onError: (e: any) =>
      modalCtrl.open(<Alert text={`유저 추가에 실패했습니다.\n ${e.response.data.desc}`} />),
  });

  // const mutateEditCategory = useMutation({
  //   mutationFn: () => editCategory(category),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['categories']);
  //     closeSelf();
  //   },
  //   onError: () => modalCtrl.open(<Alert text='카테고리 수정에 실패하였습니다.' />),
  // });
  const isUsernameValid = user?.username?.length > 4;
  const isDisplayNameValid = user?.displayName?.length > 4;
  const isEmailValid = user.email.length !== 0;
  const isPasswordValid = user.password.length > 4;
  const passwordsMatch = user.password === user.passwordConfirm;
  const isMutating = mutateCreateUser.isLoading;
  const isdefLanguageValid = user?.defLanguage?.length !== 0;
  const isuserRightValid = user?.userRight?.length !== 0;

  const isButtonDisabled =
    isMutating ||
    !isDisplayNameValid ||
    !isEmailValid ||
    !passwordsMatch ||
    !isPasswordValid ||
    !isuserRightValid;

  console.log(isMutating, !isDisplayNameValid, !isEmailValid, !passwordsMatch, !isPasswordValid);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('user info : ', user);
    mutateCreateUser.mutate();
  };

  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body>
        <Modal.Title>
          {mode === 'ADD' ? 'Create User' : null}
          {mode === 'EDIT' ? 'Edit User' : null}
        </Modal.Title>
        <Modal.Content>
          <Layout.Box>
            <form onSubmit={handleSubmit}>
              <Layout.Box>
                <Form.Label
                  htmlFor='username'
                  css={css`
                    margin-top: 16px;
                  `}
                >
                  Username
                </Form.Label>
                <S.InputWrapper>
                  <S.StyledInput
                    id='username'
                    minLength={4}
                    value={user?.username}
                    onChange={userActions.onUserNameChange}
                  />
                </S.InputWrapper>
              </Layout.Box>
              {!isUsernameValid ? (
                <Form.ErrMsg>Username must be at least 5 characters long</Form.ErrMsg>
              ) : null}
              <Layout.Box>
                <Form.Label
                  htmlFor='user-username'
                  css={css`
                    margin-top: 16px;
                  `}
                >
                  Display Name
                </Form.Label>
                <S.InputWrapper>
                  <S.StyledInput
                    minLength={4}
                    value={user?.displayName}
                    onChange={userActions.onDisplayNameChange}
                  />
                </S.InputWrapper>

                {!isDisplayNameValid ? (
                  <Form.ErrMsg>Displayed name must be at least 5 characters long</Form.ErrMsg>
                ) : null}
              </Layout.Box>
              <Layout.Box>
                <Form.Label
                  htmlFor='user-email'
                  css={css`
                    margin-top: 16px;
                  `}
                >
                  E-mail
                </Form.Label>
                <S.InputWrapper>
                  <S.StyledInput
                    value={user?.email}
                    onChange={userActions.onEmailChange}
                    type='email'
                  />
                </S.InputWrapper>
              </Layout.Box>
              <Layout.Box mb='15px'>
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
              <Layout.Box>
                <Form.Label
                  htmlFor='user-storage'
                  css={css`
                    margin-top: 16px;
                  `}
                >
                  User Storage
                </Form.Label>
                <S.InputWrapper>
                  <S.StyledInput
                    value={user?.storage}
                    onChange={userActions.onStorageChange}
                    type='number'
                    min='0'
                  />
                  {/* <S.SelectButton onClick={handleSelectUsersClick}>Select Users</S.SelectButton> */}
                </S.InputWrapper>
              </Layout.Box>
              <Layout.Box>
                <Form.Label
                  htmlFor='user-device-register-limit'
                  css={css`
                    margin-top: 16px;
                  `}
                >
                  Device register limit
                </Form.Label>
                <S.InputWrapper>
                  <S.StyledInput
                    value={user?.deviceRegisterLimit}
                    onChange={userActions.onDeviceResisterLimit}
                    type='number'
                    min='0'
                  />
                  {/* <S.SelectButton>Select Manager</S.SelectButton> */}
                </S.InputWrapper>
              </Layout.Box>
              <Layout.Box>
                <Form.Label htmlFor='userRight'>User's rights</Form.Label>

                <Form.Select
                  id='userRight'
                  onChange={(e) => userActions.onUseruserRightChange(e)}
                  value={user.defLanguage}
                >
                  <Form.Option value={'END_USER'}>END_USER</Form.Option>
                  <Form.Option value={'ADMIN'}>ADMIN</Form.Option>
                  <Form.Option value={'ANONYMOUS'}>ANONYMOUS</Form.Option>
                </Form.Select>
              </Layout.Box>
              {!isEmailValid ? <Form.ErrMsg>Please, choose user's rights</Form.ErrMsg> : null}
              <Layout.Box>
                <Form.Label
                  htmlFor='user-password'
                  css={css`
                    margin-top: 16px;
                  `}
                >
                  Password
                </Form.Label>
                <S.InputWrapper>
                  <S.StyledInput
                    minLength={4}
                    value={user?.password}
                    onChange={userActions.onPassword}
                    type='password'
                  />
                  {/* <S.SelectButton>Select Category</S.SelectButton> */}
                </S.InputWrapper>
                {!isPasswordValid && (
                  <Form.ErrMsg>Password must be longer than 4 characters</Form.ErrMsg>
                )}
              </Layout.Box>
              <Layout.Box>
                <Form.Label
                  htmlFor='user-password-confirm'
                  css={css`
                    margin-top: 16px;
                  `}
                >
                  Confirm Password
                </Form.Label>
                <S.InputWrapper>
                  <S.StyledInput
                    minLength={4}
                    value={user.passwordConfirm}
                    onChange={userActions.onPasswordConfirm}
                    type='password'
                  ></S.StyledInput>

                  {/* <S.SelectButton>Select Category</S.SelectButton> */}
                </S.InputWrapper>

                {!passwordsMatch ? <Form.ErrMsg>Passwords dont match</Form.ErrMsg> : null}
              </Layout.Box>
              <Modal.Actions
                css={css`
                  justify-content: center;
                  margin-top: 16px;
                `}
              >
                {mode === 'ADD' ? (
                  <Modal.SaveButton
                    //  onClick={() => mutateCreateCateg ory.mutate()}
                    //  disabled={isButtonDisabled}
                    type='submit'
                    disabled={isButtonDisabled}
                  >
                    Create
                  </Modal.SaveButton>
                ) : null}
                <Modal.CloseButton
                  //  disabled={isMutating}
                  onClick={closeSelf}
                  type='button'
                >
                  Close
                </Modal.CloseButton>
              </Modal.Actions>
            </form>
          </Layout.Box>
        </Modal.Content>
      </Modal.Body>
    </Modal.Container>
  );
}
