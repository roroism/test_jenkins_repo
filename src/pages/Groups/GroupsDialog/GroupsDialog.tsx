import { Asset } from '@app/src/apis/assets';
import {
  AddSocietyRequestBody,
  AddUser,
  Level,
  SocietyManagementAPIResponse,
  addSociety,
  categoryId,
} from '@app/src/apis/societyManagement';
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
import * as S from './GroupsDialog.style';
import { useAssets } from '@app/src/apis/assets/useAssets';
import { APIListParams } from '@app/src/apis';
import * as Page from '@app/src/components/Page.style';
import { config } from '@app/src/config';
import { useSelector } from 'react-redux';
import { selectToken, selectUserData } from '@app/src/store/slices/authSlice';
import { css } from '@emotion/react';
import UserTransferList from './UserTransferList';
import type { CategoryAPIResponse } from '@app/src/apis/category';
import { PermissionsLookup } from '../Groups';
import { CategoryDialog } from '../../Category/CategoryDialog';
import { Alarm } from '@app/src/components/AlarmModal';
import { userEdit } from '@app/src/apis/users/usersAPI.models';
import CategoryTransferList from './CategoryTransferList';

type GroupDialogProps = ModalProps & { closeAnimation?: boolean } & (
    | { mode: 'ADD' }
    | { mode: 'EDIT'; baseGroup: SocietyManagementAPIResponse }
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

type AddSocietyReducerType = {
  name: string;
  userData: userEdit[];
  managers: userEdit[];
  categoryIds: any;
};

const createSociety = (): AddSocietyReducerType => {
  return {
    name: '',
    userData: [],
    managers: [],
    categoryIds: [],
  };
};

export function GroupsDialog(props: GroupDialogProps) {
  const { mode, closeSelf, closeAnimation = true } = props;

  const { t } = useTranslation();
  const modalCtrl = useModal();
  const [selectedCategory, setSelectedCategory] = useState<CategoryAPIResponse>(null);
  const queryClient = useQueryClient();
  const userData = useSelector(selectUserData());
  const modalBodyRef = useRef(null);
  const modalBackgroundRef = useRef(null);

  const defaultAddSociety = useMemo(() => {
    if (mode === 'ADD') return createSociety();
  }, []);

  const defaultEditSociety = useMemo(() => {
    if (mode === 'EDIT')
      return {
        // 수정 필요.
        name: props.baseGroup.name,
        // userData: props.baseGroup.userData,
        // categoryIds: props.baseGroup.categoryIds,
      };
  }, []);

  const [society, societyActions] = useTypeSafeReducer(defaultAddSociety, {
    set: (_, society: AddSocietyReducerType) => society,
    onGroupNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name = e.target.value;
    },
    setSelectedUsers: (state, value: userEdit[]) => {
      // const newSpeed = Number(e.target.value);
      // if (newSpeed < 0) return { ...state, speed: 0 };
      // if (newSpeed > 100) return { ...state, speed: 100 };
      // state.users = newSpeed;
      // state.users = e.target.value
      // console.log('setSelectedUsers : ', value);
      state.userData = value;
    },
    onManagerSelect: (state, value: userEdit[]) => {
      // state.iconId = asset.id;
      // state.iconName = asset.name;
      state.managers = value;
    },
    setCategorySelect: (state, value: any) => {
      console.log('onCategorySelect : ', value);
      state.categoryIds = value;
    },
    // onManagerSelect: (state, asset: Asset) => {
    //   // state.iconId = asset.id;
    //   // state.iconName = asset.name;
    //   // state.managers = e.
    // },
    // onCategorySelect: (state, asset: Asset) => {
    //   // state.iconId = asset.id;
    //   // state.iconName = asset.name;
    // },
  });

  console.log('society : ', society);

  const mutateAddSociety = useMutation({
    mutationFn: (body: AddSocietyRequestBody) => addSociety(body),
    onSuccess: () => {
      queryClient.invalidateQueries(['societyList']);
      modalCtrl.open(<Alarm text='그룹을 생성했습니다.' onClose={closeSelf} />);
      // closeSelf();
    },
  });

  // const mutateCreateGroup = useMutation({
  //   mutationFn: () => addGroupManagement(group),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['groupmanagement']);
  //     modalCtrl.open(<Alarm text='그룹을 생성했습니다.' onClose={closeSelf} />)
  //     // closeSelf();
  //   },
  //   onError: () => modalCtrl.open(<Alert text='그룹 추가에 실패했습니다.' />),
  // });

  // const mutateEditGroup = useMutation({
  //   mutationFn: () => editGroupManagement(group),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['groupmanagement']);
  //     modalCtrl.open(<Alarm text='그룹을 생성했습니다.' onClose={closeSelf} />)
  //     // closeSelf();
  //   },
  //   onError: () => modalCtrl.open(<Alert text='그룹 수정에 실패하였습니다.' />),
  // });

  // const [noImage, setNoImage] = useState<boolean>(false);

  // useEffect(() => {
  //   setNoImage(false);
  // }, [category.iconName]);

  // const openAssetAddDialog = () => {
  //   modalCtrl.open(<Selection availables={['IMAGE']} onSelect={categoryActions.onAssetSelect} />);
  // };

  // const isCategoryNameValid = category.name.length !== 0;
  // const isCategorySpeedValid = category.speed !== 0;
  // const isIconValid = category.iconId.length !== 0;
  // const isMutating = mutateCreateCategory.isLoading || mutateEditCategory.isLoading;
  // const isButtonDisabled =
  //   isMutating || !isCategoryNameValid || !isCategorySpeedValid || !isIconValid;

  // const [selectedUsers, setSelectedUsers] = useState<{ name: string; id: string }[] | []>([]);

  const isSelectedUsersValid = society.userData.length > 0;
  const isSelectedManagersValid = society.managers.length > 0;
  // 수정 필요
  const isGroupNameValid = society?.name?.length > 1;

  const isButtonDisabled = !isSelectedUsersValid || !isSelectedManagersValid || !isGroupNameValid;

  const handleCreateButtonClick = () => {
    const userDataWithManagers = society.userData.map((user) => {
      const appointedManager = society.managers.find((manager) => manager?.id === user?.id);
      if (appointedManager) return { userId: user?.id, level: Level.MANAGER };
      else return { userId: user?.id, level: Level.USER };
    });
    const addCategories = society.categoryIds.map((category) => ({
      categoryId: category.id,
      categoryName: category?.name,
    }));
    console.log('그룹 생성 버튼 클릭 : ', {
      name: society.name,
      userData: userDataWithManagers,
      categoryIds: addCategories,
    });
    mutateAddSociety.mutate({
      name: society.name,
      userData: userDataWithManagers,
      categoryIds: addCategories,
    });
  };
  const handleEditButtonClick = () => {
    console.log('그룹 수정 버튼 클릭');
    // mutateEditGroup.mutate();
  };

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
      <Modal.Body ref={modalBodyRef} width='48vw'>
        <Modal.Title>
          {mode === 'ADD' ? '그룹 추가' : null}
          {mode === 'EDIT' ? '그룹 수정' : null}
        </Modal.Title>
        <Modal.Content>
          <Layout.Box>
            <form>
              <Form.Label htmlFor='group-name'>Group Name</Form.Label>
              <S.InputWrapper>
                <S.StyledInput
                  value={society.name}
                  onChange={societyActions.onGroupNameChange}
                ></S.StyledInput>
              </S.InputWrapper>
              {!isGroupNameValid && (
                <Form.ErrMsg>그룹 이름은 두 글자 이상이여야 합니다.</Form.ErrMsg>
              )}

              <Form.Label
                htmlFor='group-users'
                css={css`
                  margin-top: 16px;
                  margin-bottom: 16px;
                `}
              >
                Users
              </Form.Label>
              <Layout.Box>
                {/* 권한에 따라 EditManager 유 무 다름 */}
                <UserTransferList
                  editLeftItems={{
                    leftItems: society.userData,
                    setLeftItems: societyActions.setSelectedUsers,
                  }}
                  editManager={
                    PermissionsLookup[userData.userRight] >= PermissionsLookup.SUPER_ADMIN && {
                      selectedManagers: society.managers,
                      setSelectedManagers: societyActions.onManagerSelect,
                    }
                  }
                />
                {!isSelectedUsersValid && (
                  <Form.ErrMsg>유저는 한 명 이상 이여야 합니다.</Form.ErrMsg>
                )}
                {!isSelectedManagersValid && (
                  <Form.ErrMsg>매니저를 반드시 선택해야 합니다.</Form.ErrMsg>
                )}
              </Layout.Box>
              <Form.Label
                htmlFor='group-category'
                css={css`
                  margin-top: 16px;
                `}
              >
                Category
              </Form.Label>
              <Layout.Box>
                {/* 권한에 따라 EditManager 유 무 다름 */}
                <CategoryTransferList
                  editLeftItems={{
                    leftItems: society.categoryIds,
                    setLeftItems: societyActions.setCategorySelect,
                  }}
                />
              </Layout.Box>
              {/* <S.SelectButton onClick={openCategoryAddDialog}>Add Category</S.SelectButton> */}
              {/* <S.InputWrapper>
                <S.StyledInput></S.StyledInput>
              </S.InputWrapper> */}
              <div>
                <ul></ul>
              </div>
              <Modal.Actions
                css={css`
                  justify-content: center;
                  margin-top: 16px;
                `}
              >
                {mode === 'ADD' ? (
                  <Modal.SaveButton
                    //  onClick={() => mutateCreateCategory.mutate()}
                    onClick={handleCreateButtonClick}
                    disabled={isButtonDisabled}
                  >
                    Create
                  </Modal.SaveButton>
                ) : null}
                {mode === 'EDIT' ? (
                  <Modal.SaveButton
                    // onClick={() => mutateEditCategory.mutate()}
                    onClick={handleEditButtonClick}
                    disabled={isButtonDisabled}
                  >
                    Modify
                  </Modal.SaveButton>
                ) : null}
                <Modal.CloseButton
                  //  disabled={isMutating}
                  onClick={onClose}
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
