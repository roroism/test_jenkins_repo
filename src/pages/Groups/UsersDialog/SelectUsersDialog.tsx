import { Asset } from '@app/src/apis/assets';
import { addGroupManagement, GroupManagement, GroupManagementAPIResponse, editGroupManagement } from '@app/src/apis/groupManagement';
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
import * as S from './SelectUsersDialog.style';
import { useAssets } from '@app/src/apis/assets/useAssets';
import { APIListParams } from '@app/src/apis';
import * as Page2 from '@app/src/components/Page2.style';
import * as DataTable from '@app/src/components/DataTable.style';
import { Checkbox, FormControlLabel } from '@mui/material';
import { config } from '@app/src/config';
import { useSelector } from 'react-redux';
import { selectToken } from '@app/src/store/slices/authSlice';

export const testUsersDummyData = [
  {
    id: 'dummyUser1',
    name: 'name1'
  },
  {
    id: 'dummyUser2',
    name: 'name2'
  },
  {
    id: 'dummyUser3',
    name: 'name3'
  },
  {
    id: 'dummyUser4',
    name: 'name4'
  },
  {
    id: 'dummyUser5',
    name: 'name5'
  },
  {
    id: 'dummyUser6',
    name: 'name6'
  }
];

// type SelectUsersDialogProps = ModalProps &
//   (
//     | { mode: 'ADD' }
//     | { mode: 'EDIT'; baseCategory: GroupManagementAPIResponse }
//     | { mode: 'COPY'; baseCategory: GroupManagementAPIResponse }
//   );

interface SelectUsersDialogProps extends ModalProps {
  mode: 'ADD' | 'EDIT' | 'COPY';
  baseCategory?: GroupManagementAPIResponse;
  selectedUsers: { name: string, id: string }[] | [];
  setSelectedUsers: any;
}

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

const createGroups = (): GroupManagement => {
  return {
    id: '',
    name: '',
    users: [],
    categories: [],
  };
};

export function SelectUsersDialog(props: SelectUsersDialogProps) {
  const { mode, closeSelf, selectedUsers, setSelectedUsers } = props;

  const { t } = useTranslation();
  const modalCtrl = useModal();
  const queryClient = useQueryClient();
  // const [params, apiActions, api] = useAssets(defaultAPIListParams);

  const defaultGroups = useMemo(() => {
    if (mode === 'ADD') return createGroups();
    if (mode === 'EDIT')
      return {
        id: props.baseCategory.id,
        name: props.baseCategory.name,
        speed: props.baseCategory.speed,
        iconId: props.baseCategory.iconId,
        iconName: props.baseCategory.iconName,
      };
    if (mode === 'COPY')
      return {
        id: props.baseCategory.id,
        name: props.baseCategory.name,
        speed: props.baseCategory.speed,
        iconId: props.baseCategory.iconId,
        iconName: props.baseCategory.iconName,
      };
  }, []);

  const [group, groupActions] = useTypeSafeReducer(defaultGroups, {
    set: (_, group: GroupManagement) => group,
    onGroupNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name = e.target.value;
    },
    onGroupUsersChange: (state, e: React.ChangeEvent<HTMLButtonElement>) => {
      // const newSpeed = Number(e.target.value);
      // if (newSpeed < 0) return { ...state, speed: 0 };
      // if (newSpeed > 100) return { ...state, speed: 100 };
      // state.users = newSpeed;
    },
    onManagerSelect: (state, asset: Asset) => {
      // state.iconId = asset.id;
      // state.iconName = asset.name;
    },
    onCategorySelect: (state, asset: Asset) => {
      // state.iconId = asset.id;
      // state.iconName = asset.name;
    },
  });

  // const mutateCreateCategory = useMutation({
  //   mutationFn: () => addCategory(category),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['categories']);
  //     closeSelf();
  //   },
  //   onError: () => modalCtrl.open(<Alert text='카테고리 추가에 실패하였습니다.' />),
  // });

  // const mutateEditCategory = useMutation({
  //   mutationFn: () => editCategory(category),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(['categories']);
  //     closeSelf();
  //   },
  //   onError: () => modalCtrl.open(<Alert text='카테고리 수정에 실패하였습니다.' />),
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

  // const [selectedUsers, setSelectedUsers] = useState<{ name: string, id: string }[]>([]);

  const selectUser = (user) => {
    setSelectedUsers((prev) => {
      const index = prev.findIndex((prevUser) => prevUser.id === user.id);
      if (index !== -1) return [...prev.slice(0, index), ...prev.slice(index + 1)];
      /**
       * Category를 하나만 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      // return [category];
      /**
       * Category를 여러개 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      return [...prev, user];
    });
  }

  const handleSelectUsersClick = () => {

  };

  const onSelectAllClick = () => {
    setSelectedUsers((prev) => {
      if (prev.length === testUsersDummyData.length) return [];
      return testUsersDummyData;
    });
  };

  console.log('selectedUsers : ', selectedUsers);
  console.log('selectedUsers.length, testUsersDummyData.length : ', selectedUsers.length, testUsersDummyData.length);

  const selectedUserIds = selectedUsers.map((user) => user.id);
  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body width='600px'>
        <Modal.Title>
          {mode === 'ADD' ? '유저 선택' : null}
          {mode === 'EDIT' ? '유저 수정' : null}
        </Modal.Title>
        <Modal.Content>
          <Layout.Box mb='15px'>
            <Page2.ContentWrapper>
              <DataTable.Table>
                <DataTable.THead>
                  <DataTable.THeadTr sx={S.UsersListGrid}>
                    <DataTable.Th>
                      <Checkbox
                        checked={selectedUsers.length === testUsersDummyData.length}
                        // indeterminate={selectedCategories.length != categoryApi.data.data.length}
                        indeterminate={
                          selectedUsers.length !== 0 &&
                          selectedUsers.length !== testUsersDummyData.length
                        }
                        onChange={onSelectAllClick}
                      />
                    </DataTable.Th>
                    <DataTable.Th>Name</DataTable.Th>
                  </DataTable.THeadTr>
                </DataTable.THead>
                <DataTable.TBody>
                  {testUsersDummyData.map((user) =>
                    <DataTable.TBodyTr
                      key={user.id}
                      sx={S.UsersListGrid}
                      selected={selectedUserIds.includes(user.id)}
                      onClick={() => selectUser(user)}
                    >
                      <DataTable.Td>
                        <Checkbox
                          checked={selectedUserIds.includes(user.id)}
                        // onChange={() => selectUser(user)}
                        />
                      </DataTable.Td>
                      <DataTable.Td>
                        {user.name}
                      </DataTable.Td>
                    </DataTable.TBodyTr>
                  )


                  }
                </DataTable.TBody>
              </DataTable.Table>
            </Page2.ContentWrapper>
          </Layout.Box>
        </Modal.Content>
      </Modal.Body>
    </Modal.Container>
  );

  // return (
  //   <Modal.Container>
  //     <Modal.Background onClick={closeSelf} />
  //     <Modal.Body>
  //       <Modal.Title>
  //         {mode === 'ADD' ? '그룹 추가' : null}
  //         {mode === 'EDIT' ? '그룹 수정' : null}
  //         {mode === 'COPY' ? '그룹 복사' : null}
  //       </Modal.Title>
  //       <Modal.Content>
  //         <Layout.Box mb='15px'>
  //           <Form.Label htmlFor='name'>그룹 이름 (10자 미만)</Form.Label>
  //           {/* {!isCategoryNameValid ? (
  //             <Form.ErrMsg>카테고리의 이름을 입력해주세요.</Form.ErrMsg>
  //           ) : null} */}
  //           <Form.Input
  //             id='name'
  //             value={category.name}
  //             onChange={categoryActions.onCategoryNameChange}
  //             minLength={1}
  //             maxLength={10}
  //             autoComplete='off'
  //             autoCorrect='off'
  //           />
  //         </Layout.Box>
  //         <Layout.Box mb='15px'>
  //           <Form.Label htmlFor='speed'>카테고리 속도 (단위: 초)</Form.Label>
  //           {!isCategorySpeedValid ? <Form.ErrMsg>1초 이상으로 설정해주세요.</Form.ErrMsg> : null}
  //           <Form.Input
  //             id='speed'
  //             type='number'
  //             min={1}
  //             max={100}
  //             value={String(category.speed)}
  //             onChange={categoryActions.onCategorySpeedChange}
  //             autoComplete='off'
  //             autoCorrect='off'
  //           />
  //         </Layout.Box>
  //         <Layout.Box mb='15px'>
  //           <Form.Label htmlFor='icon'>카테고리 아이콘</Form.Label>
  //           {!isIconValid ? <Form.ErrMsg>아이콘을 등록해주세요.</Form.ErrMsg> : null}
  //           <S.ContentAddButton onClick={openAssetAddDialog}>
  //             {category.iconName}
  //           </S.ContentAddButton>
  //         </Layout.Box>

  //       </Modal.Content>
  //       <Modal.Actions>
  //         {mode === 'ADD' ? (
  //           <Modal.SaveButton
  //             onClick={() => mutateCreateCategory.mutate()}
  //             disabled={isButtonDisabled}
  //           >
  //             생성
  //           </Modal.SaveButton>
  //         ) : null}
  //         {mode === 'EDIT' ? (
  //           <Modal.SaveButton
  //             onClick={() => mutateEditCategory.mutate()}
  //             disabled={isButtonDisabled}
  //           >
  //             수정
  //           </Modal.SaveButton>
  //         ) : null}
  //         <Modal.CloseButton disabled={isMutating} onClick={closeSelf}>
  //           닫기
  //         </Modal.CloseButton>
  //       </Modal.Actions>
  //     </Modal.Body>
  //   </Modal.Container>
  // );
}
