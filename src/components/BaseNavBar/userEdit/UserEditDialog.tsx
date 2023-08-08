import { Asset } from '@app/src/apis/assets';
import { editUser, changePassword, usersAPIResponse } from '@app/src/apis/users'; // userEdit = type; editUser = func
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
import React, { useContext, useEffect, useMemo, useState } from 'react';
import * as S from './UserEditDialog.style';
import { useAssets } from '@app/src/apis/assets/useAssets';
import { APIListParams } from '@app/src/apis';
import * as Page from '@app/src/components/Page.style';
import { config } from '@app/src/config';
import { useSelector } from 'react-redux';
import { selectToken } from '@app/src/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { authActions } from '@app/src/store/slices/authSlice';
import { UserDeletionDialog } from '@app/src/pages/Users/DeleteUser';
import { translateId, translateIdPrefix } from './translateValues';
import languageList from '@app/src/constants/languages';
import { LanguageContext } from '@app/src/LanguageProvider';

type UsersDialogProps = ModalProps &
  ({ mode: 'ADD' } | { mode: 'EDIT'; baseUser: user } | { mode: 'COPY'; baseUser: user });

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
interface userManagement {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  defLanguage: string;
  password: string;
  passwordConfirm: string;
}

type user = {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  userRight: string;
  defLanguage: string;
  password: string;
  passwordConfirm: string;
};

export function UsersEditDialog(props: UsersDialogProps) {
  const { mode, closeSelf } = props;
  const [sucessfullProxyAction, setSucessfullProxyAction] = useState(false);
  const dispatch = useDispatch();
  const { languageCode, changeLanguage } = useContext(LanguageContext);

  const { t, tForNested } = useTranslation();
  const modalCtrl = useModal();
  const queryClient = useQueryClient();
  const [params, apiActions, api] = useAssets(defaultAPIListParams);
  const authToken = useSelector(selectToken());

  const translatedText = useMemo(() => {
    console.log(languageCode, tForNested(translateIdPrefix, translateId));
    return tForNested(translateIdPrefix, translateId);
  }, [languageCode]);

  useEffect(() => {
    if (sucessfullProxyAction) closeSelf();
  }, [sucessfullProxyAction]);

  const openUserDeleteDialog = (user: { id: string; displayName: string }) => {
    console.log(user);
    modalCtrl.open(
      <UserDeletionDialog
        setSucessfullProxyAction={setSucessfullProxyAction}
        mode='DELETE SELF'
        baseUser={{ ...user, status: 'ACTIVATED' }}
      />
    );
  };

  const defaultUser = useMemo(() => {
    if (mode === 'EDIT')
      return {
        id: props.baseUser.id,
        displayName: props.baseUser.displayName,
        email: props.baseUser.email,
        password: props.baseUser.password || '',
        passwordConfirm: '',
        defLanguage: props.baseUser.defLanguage,
      };
    if (mode === 'COPY')
      return {
        id: props.baseUser.id,
        displayName: props.baseUser.displayName,
        email: props.baseUser.email,
        avatarUrl: props.baseUser.avatarUrl,
        userRight: props.baseUser.userRight,
        password: props.baseUser.password,
        passwordConfirm: props.baseUser.passwordConfirm,
        defLanguage: props.baseUser.defLanguage,
      };
  }, []);

  const [user, userActions] = useTypeSafeReducer(defaultUser, {
    set: (_, user: user) => user,
    onUserDisplayNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.displayName = e.target.value;
    },
    onUserEmailChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.email = e.target.value;
    },
    onUserPasswordChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.password = e.target.value;
    },
    onUserPasswordConfirmChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.passwordConfirm = e.target.value;
    },
    onUserdefLanguageChange: (state, e: any) => {
      state.defLanguage = e.target.value;
    },
  });
  console.log(user);
  const mutateEditUser = useMutation({
    mutationFn: () => editUser(user),
    onSuccess: (data) => {
      dispatch(
        authActions.profileEditSucess({
          id: data.id,
          lang: user.defLanguage,
          name: user.displayName,
          email: user.email,
        })
      );
      closeSelf();
    },
    onError: () => modalCtrl.open(<Alert text={translatedText.saveResult?.user.error} />),
  });

  const changePasswordMutate = useMutation({
    mutationFn: () => changePassword(user),
    onSuccess: () => {
      closeSelf();
    },
    onError: () => modalCtrl.open(<Alert text={translatedText.saveResult?.password.error} />),
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
  const isDisplayNameValid = user.displayName.length >= 4;
  const isEmailValid = user.email.length !== 0;
  const isPasswordValid = user.password.length === 0 || user.password.length >= 4;
  const passwordsMatch = user.password === user.passwordConfirm;

  const isMutating = mutateEditUser.isLoading;
  const isdefLanguageValid = user.defLanguage.length !== 0;

  const isButtonDisabled =
    isMutating ||
    !isDisplayNameValid ||
    !isEmailValid ||
    !isdefLanguageValid! ||
    !passwordsMatch ||
    !isPasswordValid;
  console.log(
    isMutating,
    !isDisplayNameValid,
    !isEmailValid,
    !isdefLanguageValid!,
    !passwordsMatch,
    !isPasswordValid
  );
  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body>
        <Modal.Title>
          {mode === 'ADD' ? 'Add user' : null}
          {mode === 'EDIT' ? translatedText.title : null}
          {mode === 'COPY' ? 'Copy user' : null}
        </Modal.Title>
        <Modal.Content>
          <Layout.Box mb='15px'>
            <Layout.SubTitle>{translatedText.userInfo?.title}</Layout.SubTitle>
            {/* name */}
            <Form.Label htmlFor='displayName'>{translatedText.userInfo?.id.title}</Form.Label>

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
            {!isDisplayNameValid ? (
              <Form.ErrMsg>{translatedText.userInfo?.id.error}</Form.ErrMsg>
            ) : null}
            {/* email */}
            <Form.Label htmlFor='email'>{translatedText.userInfo?.email.title}</Form.Label>

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
            {!isEmailValid ? (
              <Form.ErrMsg>{translatedText.userInfo?.email.error}</Form.ErrMsg>
            ) : null}
            {/* language */}
            <Form.Label htmlFor='defLanguage'>{translatedText.userInfo?.language.title}</Form.Label>

            <Form.Select
              id='defLanguage'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                changeLanguage(e.target.value);
                userActions.onUserdefLanguageChange(e);
              }}
              value={user.defLanguage}
            >
              {languageList.map((language) => (
                <Form.Option key={language.title} value={language.value}>
                  {language.title}
                </Form.Option>
              ))}
            </Form.Select>
            {!isEmailValid ? (
              <Form.ErrMsg>{translatedText.userInfo?.language.error}</Form.ErrMsg>
            ) : null}
          </Layout.Box>
          {/*
          <Layout.Box mb='15px'>
            <Form.Label htmlFor='subscribePromotion'>User's subscribePromotion</Form.Label>
            <Form.Select
              id='subscribePromotion'
              value={user.subscribePromotion}
              onChange={(e) => userActions.onUsersubscribePromotionChange(e)}
            >
              <Form.Option value={0} selected={!user.subscribePromotion ? true : false}>
                Promote
              </Form.Option>
              <Form.Option value={1} selected={user.subscribePromotion ? true : false}>
                Not Promote
              </Form.Option>
            </Form.Select>
  
            {!isEmailValid ? <Form.ErrMsg>Email cannot be empty</Form.ErrMsg> : null}
          </Layout.Box>
          */}
          <Layout.Box mb='15px'>
            <Layout.SubTitle>{translatedText.changePassword?.title}</Layout.SubTitle>
            <Form.Label htmlFor='newPassword'>
              {translatedText.changePassword?.newPassword.title}
            </Form.Label>

            <Form.Input
              id='newPassword'
              type='password'
              minLength={1}
              maxLength={30}
              value={user?.password}
              onChange={(e) => {
                changeLanguage(e.target.value);
                userActions.onUserPasswordChange(e);
              }}
              autoComplete='new-password'
              autoCorrect='off'
            />
            {!isPasswordValid ? (
              <Form.ErrMsg>{translatedText.changePassword.newPassword.error}</Form.ErrMsg>
            ) : null}
            <Form.Label htmlFor='passwordConfirm'>
              {translatedText.changePassword?.confirmNewPassword.title}
            </Form.Label>
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
            {!passwordsMatch ? (
              <Form.ErrMsg>{translatedText.changePassword.confirmNewPassword.error}</Form.ErrMsg>
            ) : null}
          </Layout.Box>
          <Layout.Box>
            <Layout.SubTitle>{translatedText.deactivateUser.title}</Layout.SubTitle>
            <Modal.DeleteButton
              onClick={() => openUserDeleteDialog({ id: user.id, displayName: user.displayName })}
            >
              {translatedText.deactivateUser.button}
            </Modal.DeleteButton>
          </Layout.Box>
        </Modal.Content>
        <Modal.Actions>
          {mode === 'EDIT' ? (
            <Modal.SaveButton onClick={() => mutateEditUser.mutate()} disabled={isButtonDisabled}>
              {t('app-common.save')}
            </Modal.SaveButton>
          ) : null}
          <Modal.CloseButton disabled={isMutating} onClick={closeSelf}>
            {t('app-common.close')}
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
