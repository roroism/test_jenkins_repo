import { APIListParams } from '@app/src/apis';
import {
  SocietyManagementAPIResponse,
  addSociety,
  deleteSociety,
} from '@app/src/apis/societyManagement';
import { useSocietyManagementQuery } from '@app/src/apis/societyManagement/useSocietyManagementQuery';
import { Alert } from '@app/src/components/Alert';
import { Confirm } from '@app/src/components/Confirm';
import * as Form from '@app/src/components/Form.style';
import * as Page from '@app/src/components/Page.style';
import { Pagination } from '@app/src/components/Pagination';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { debounce } from '@app/src/utils';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { faEdit } from '@fortawesome/pro-solid-svg-icons/faEdit';
import { faPlusCircle } from '@fortawesome/pro-solid-svg-icons/faPlusCircle';
import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import * as S from './Groups.style';
import * as Page2 from '@app/src/components/Page2.style';
import * as DataTable from '@app/src/components/DataTable.style';
import { useSelector } from 'react-redux';
import { selectToken, selectUserData } from '@app/src/store/slices/authSlice';
import { config } from '@app/src/config';
import { css } from '@emotion/react';
import { GroupsDialog } from './GroupsDialog/GroupsDialog';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CollapsibleTable from './CollapsibleTable/CollapsibleTable';
import SocietyTable from '@app/src/components/Table/SocietyTable/SocietyTable';

const DummyDataGroups = [
  {
    societyId: '1',
    societyName: 'groupName1',
    societyCategories: [
      { categoryId: 'cate1', categoryName: 'Categories1' },
      { categoryId: 'cate2', categoryName: 'Categories2' },
      { categoryId: 'cate3', categoryName: 'Categories3' },
      { categoryId: 'cate4', categoryName: 'Categories4' },
      { categoryId: 'cate5', categoryName: 'Categories5' },
      { categoryId: 'cate6', categoryName: 'Categories6' },
    ],
    societyUser: [
      { userId: 'user1', userName: 'UserName1', societyUserLevel: 'Manager' },
      { userId: 'user2', userName: 'UserName2', societyUserLevel: 'User' },
      { userId: 'user3', userName: 'UserName3', societyUserLevel: 'Manager' },
      { userId: 'user4', userName: 'UserName4', societyUserLevel: 'User' },
      { userId: 'user5', userName: 'UserName5', societyUserLevel: 'User' },
      { userId: 'user6', userName: 'UserName6', societyUserLevel: 'User' },
      { userId: 'user7', userName: 'UserName7', societyUserLevel: 'User' },
      { userId: 'user8', userName: 'UserName8', societyUserLevel: 'User' },
      { userId: 'user9', userName: 'UserName9', societyUserLevel: 'User' },
      { userId: 'user10', userName: 'UserName10', societyUserLevel: 'User' },
    ],
    societyDevices: [
      { deviceId: 'Device123456_1', deviceName: 'Device디바이스_1', owner: 'user2' },
      { deviceId: 'Device123456_2', deviceName: 'Device디바이스_2', owner: 'user4' },
      { deviceId: 'Device123456_3', deviceName: 'Device디바이스_3', owner: 'user5' },
      { deviceId: 'Device123456_4', deviceName: 'Device디바이스_4', owner: 'user9' },
    ],
  },
];

export enum PermissionsLookup {
  ANONYMOUS = 0,
  END_USER = 0,
  ADMIN = 2,
  SUPER_ADMIN = 2,
}

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 20,
  order: 'DESC',
  sort: `-updateDate`,
  filter: [],
  // filterMode: 'AND',
};

export const Groups = () => {
  const { t } = useTranslation();
  const modalCtrl = useModal();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedGroups, setSelectedGroups] = useState<SocietyManagementAPIResponse[]>([]);
  const [params, apiActions, societyManagementApi] =
    useSocietyManagementQuery(defaultAPIListParams);
  const authToken = useSelector(selectToken());
  const userData = useSelector(selectUserData());

  const mutateDeleteGroup = useMutation({
    mutationFn: (groupId: string) => deleteSociety(groupId),
    onSuccess: () => {
      societyManagementApi.refetch();
      setSelectedGroups([]);
    },
  });

  const handleSearchValue = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, 300);

  const openGroupAddDialog = () => {
    modalCtrl.open(<GroupsDialog mode='ADD' />);
  };

  const openSocietyEditDialog = (society: SocietyManagementAPIResponse) => {
    console.log(society?.id, society?.name);
    modalCtrl.open(<GroupsDialog mode='EDIT' baseGroup={society} />);
  };

  const openSocietyDeleteConfirm = (selectedSocieties: SocietyManagementAPIResponse[]) => {
    if (selectedSocieties.length === 0) {
      modalCtrl.open(<Alert text='삭제할 카테고리를 선택해주세요.' />);
      return;
    }
    modalCtrl.open(
      <Confirm
        text='삭제 하시겠습니까?'
        onConfirmed={async () => {
          try {
            for (const group of selectedSocieties) {
              await mutateDeleteGroup.mutateAsync(group.id);
            }
          } catch (error) {
            modalCtrl.open(<Alert text='카테고리 삭제에 실패하였습니다.' />);
          }
        }}
      />
    );
  };

  const selectGroup = (group: SocietyManagementAPIResponse) => {
    setSelectedGroups((prev) => {
      const index = prev.findIndex((prevGroup) => prevGroup.id === group.id);
      if (index !== -1) return [...prev.slice(0, index), ...prev.slice(index + 1)];
      /**
       * society을 하나만 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      // return [society];
      /**
       * society을 여러개 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      return [...prev, group];
    });
  };

  // const onSelectAllClick = () => {
  //   setSelectedGroups((prev) => {
  //     if (prev.length === societyManagementApi.data.data.length) return [];
  //     return societyManagementApi.data.data;
  //   });
  // };
  const selectedGroupIds = selectedGroups.map((group) => group.id);
  console.log('societyManagementApi.data : ', societyManagementApi);
  // console.log('societyManagementApi.data.data : ', societyManagementApi?.data.data);

  console.log(PermissionsLookup[userData.userRight]);
  return (
    <Page2.Container>
      <Page.Title>그룹 관리</Page.Title>
      <Page.Actions
        css={css`
          margin-top: 32px;
        `}
      >
        {PermissionsLookup[userData.userRight] >= PermissionsLookup.SUPER_ADMIN && (
          <Page.ActionButton onClick={openGroupAddDialog}>
            <FontAwesomeIcon icon={faPlusCircle} color='#3e70d6' size='lg' />
            &nbsp; 새로만들기
          </Page.ActionButton>
        )}
        {/* <Page.ActionButton onClick={onSelectAllClick}>
          <FontAwesomeIcon icon={faCheck} />
          &nbsp; 전체선택
        </Page.ActionButton> */}
        {/* <Page.ActionButton onClick={() => openGroupDeleteConfirm(selectedGroups)}>
          <FontAwesomeIcon icon={faTrash} />
          &nbsp; 선택삭제
        </Page.ActionButton> */}
        <Page.ActionButton onClick={() => societyManagementApi.refetch()}>
          <FontAwesomeIcon icon={faSyncAlt} color='hsl(0, 0%, 30%)' />
          &nbsp; 새로고침
        </Page.ActionButton>
        <Page.SearchInput
          type='textbox'
          placeholder={t('app-common.search')}
          onChange={debounce(apiActions.onQueryChange, 300)}
        />
      </Page.Actions>
      <Page2.ContentWrapper>
        {societyManagementApi.isLoading ? null : (
          <SocietyTable headTitles={tableTitles} tableDataList={societyManagementApi.data} />
        )}
      </Page2.ContentWrapper>
    </Page2.Container>
  );
};

const tableTitles = ['그룹 이름', '매니저 ID', '사용 카테고리', '그룹 생성일'];
