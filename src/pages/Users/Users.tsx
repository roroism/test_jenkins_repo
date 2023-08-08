import { APIListParams } from '@app/src/apis';
import { CategoryAPIResponse, deleteCategory } from '@app/src/apis/category';
import { useUsersQuery } from '@app/src/apis/users/useUsersQuery';
import { Alert } from '@app/src/components/Alert';
import { Confirm } from '@app/src/components/Confirm';
import * as Form from '@app/src/components/Form.style';
import * as Page from '@app/src/components/Page.style';
import { Pagination } from '@app/src/components/Pagination';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { copyToClipboard, debounce } from '@app/src/utils';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import { faCheck, faListOl } from '@fortawesome/pro-solid-svg-icons';
import { faEdit } from '@fortawesome/pro-solid-svg-icons/faEdit';
import { faCopy } from '@fortawesome/pro-solid-svg-icons/faCopy';
import { faPlusCircle } from '@fortawesome/pro-solid-svg-icons/faPlusCircle';
// import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { faTrash } from '@fortawesome/pro-regular-svg-icons/faTrash';
import { faHandPointer } from '@fortawesome/pro-solid-svg-icons/faHandPointer';
import { faBorderAll } from '@fortawesome/pro-solid-svg-icons/faBorderAll';
import { faUserPlus } from '@fortawesome/pro-solid-svg-icons/faUserPlus';
import * as Layout from '@app/src/components/Layout.style';
import { faUserSlash } from '@fortawesome/pro-solid-svg-icons/faUserSlash';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import { faUsers } from '@fortawesome/pro-solid-svg-icons/faUsers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import * as S from './Users.style';
import * as Page2 from '@app/src/components/Page2.style';
import * as DataTable from '@app/src/components/DataTable.style';
import { useSelector } from 'react-redux';
import { selectToken } from '@app/src/store/slices/authSlice';
import { config } from '@app/src/config';
import { Checkbox, FormControlLabel, Menu, Tooltip, Typography } from '@mui/material';
import { css } from '@emotion/react';
import { deleteUser, userEdit, usersAPIResponse } from '@app/src/apis/users';
//mport { UsersDialog } from './usersDialog/UsersDialog';
import { UsersDialog } from './newUserDialog/UsersDialog';
import { CreateUsersDialog } from './CreateUsers/CreateUsersDialog';
import { ButtonText } from '../../components/BaseNavBar/BaseNavBar.style';
import { CategoryNameInnerTd } from '../../components/DataTable.style';
import { UserDeletionDialog } from './DeleteUser';
import { grey } from '@mui/material/colors';
import onlineImg from '@app/resources/icons/online.svg';
import offlineImg from '@app/resources/icons/offline.svg';
import { faUsersSlash } from '@fortawesome/pro-regular-svg-icons';
import PerPageSelect from '@app/src/components/PerPageSelect/PerPageSelect';

const defaultAPIUsersParams: APIListParams = {
  perPage: 20,
  page: 1,
  sort: '-updatedDate',
  order: 'DESC',
  filter: [],
};

export const Users = () => {
  const { t } = useTranslation();
  const modalCtrl = useModal();
  const [searchText, setSearchText] = useState<string>('');
  const [params, apiActions, usersAPI] = useUsersQuery(defaultAPIUsersParams);
  const [selectedUsers, setSelectedUsers] = useState<usersAPIResponse[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const mutateDeleteUser = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      usersAPI.refetch();
      setSelectedUsers([]);
    },
  });

  const toggleSelectionMode = () => {
    setSelectionMode((prev) => !prev);
    setSelectedUsers([]);
  };

  const openUserDeleteConfirm = (selectedUsers: usersAPIResponse[]) => {
    if (selectedUsers.length === 0) {
      modalCtrl.open(<Alert text='Please choose users to delete' />);
      return;
    }
    modalCtrl.open(
      <Confirm
        text={`Are you sure you want to delete ${selectedUsers.length} users?`}
        onConfirmed={async () => {
          try {
            for (const user of selectedUsers) {
              await mutateDeleteUser.mutateAsync(user.id);
            }
          } catch (error) {
            modalCtrl.open(<Alert text='Couldnt delete a user' />);
          }
        }}
      />
    );
  };

  const selectUser = (user: usersAPIResponse) => {
    setSelectedUsers((prev) => {
      const index = prev.findIndex((prevUser) => prevUser.id === user.id);
      if (index !== -1) return [...prev.slice(0, index), ...prev.slice(index + 1)];
      return [...prev, user];
    });
  };

  const onSelectAllClick = () => {
    setSelectedUsers((prev) => {
      if (prev.length === usersAPI.data.data.length) return [];
      return usersAPI.data.data;
    });
  };

  const selectedUserIds = selectedUsers.map((user) => user.id);

  const openUserAddDialog = () => {
    modalCtrl.open(<UsersDialog mode='ADD' />);
  };

  const openUserEditDialog = (user: usersAPIResponse) => {
    console.log(user.id, user.username, user.displayName, user.email);
    modalCtrl.open(<UsersDialog mode='EDIT' baseUser={user} />);
  };
  //src={config.EXTERNAL.CUBLICK.ASSET.THUMBNAIL(user.avatarUrl, authToken)
  const openUserDeleteDialog = (user: usersAPIResponse) => {
    console.log(user.id, user.username, user.displayName, user.email);
    modalCtrl.open(<UserDeletionDialog mode='DELETE' baseUser={user} />);
  };

  const authToken = useSelector(selectToken());

  const [openFields, setOpenFields] = useState({
    ID: true,
    name: true,
    status: true,
    email: true,
    rights: true,
    groups: true,
    expirationDate: true,
    actions: true,
  });
  const [columnSelectionOpen, setColumnSelectionOpen] = useState(false);
  const changeOpenFields = (e: any) => {
    const attribute = e.target.name;
    setOpenFields((prev) => {
      return { ...prev, [attribute]: !openFields[attribute] };
    });
  };

  return (
    <Page2.Container>
      <Page.Title>{t('app-users.userManagement')}</Page.Title>
      <Page.Actions
        css={css`
          margin-top: 32px;
        `}
      >
        <Page.ActionButton onClick={openUserAddDialog}>
          <FontAwesomeIcon icon={faUserPlus} color='#3e70d6' size='lg' />
          <S.ButtonText>{t('app-users.addUser')}</S.ButtonText>
        </Page.ActionButton>
        <Page.ActionButton onClick={() => toggleSelectionMode()}>
          <FontAwesomeIcon icon={faHandPointer} />
          &nbsp; Selection mode
        </Page.ActionButton>
        {selectionMode && (
          <>
            <Page.ActionButton>
              <FontAwesomeIcon icon={selectedUsers.length > 2 ? faUsers : faUser} />
              &nbsp; {selectedUsers.length}
            </Page.ActionButton>
            <Page.ActionButton onClick={() => onSelectAllClick()}>
              <FontAwesomeIcon icon={faBorderAll} />
              &nbsp; Select all
            </Page.ActionButton>

            <Page.ActionButton onClick={() => openUserDeleteConfirm(selectedUsers)}>
              <FontAwesomeIcon icon={faUsersSlash} color='#e85050' />
              &nbsp; Delete
            </Page.ActionButton>
          </>
        )}
        <Page.ActionButton onClick={() => usersAPI.refetch()}>
          <FontAwesomeIcon icon={faSyncAlt} color='hsl(0, 0%, 30%)' />
          &nbsp; {t('app-users.reload')}
        </Page.ActionButton>

        <PerPageSelect
          selectedN={params.perPage}
          fromToArray={[10, 20, 30, 40]}
          onClick={apiActions.changePerPage}
        />

        <Page.SearchInput
          type='textbox'
          placeholder={t('app-common.search')}
          onChange={debounce(apiActions.onQueryChange, 300)}
        />
        <Page.ActionButton
          onClick={() =>
            setColumnSelectionOpen((prev) => {
              return !prev;
            })
          }
        >
          Column Select
        </Page.ActionButton>
        {columnSelectionOpen && (
          <Layout.Box
            padding='0 17px'
            border='1px solid #ddd'
            borderRadius={'8px'}
            overflow='scroll'
          >
            <Layout.Box display='flex' justifyContent='space-evenly'>
              {Object.keys(openFields).map((key) => {
                return (
                  <>
                    <Page.ActionButton
                      id={`${key}Checkbox`}
                      name={key}
                      onClick={(e) => changeOpenFields(e)}
                    >
                      {key}
                    </Page.ActionButton>
                  </>
                );
              })}
            </Layout.Box>
          </Layout.Box>
        )}
      </Page.Actions>
      <Page2.ContentWrapper>
        <DataTable.Table>
          <DataTable.THead>
            <DataTable.THeadTr sx={S.CategoryListGrid}>
              {openFields.ID && <DataTable.Th>{t('app-users.ID')}</DataTable.Th>}
              {openFields.name && <DataTable.Th>{t('app-users.name')}</DataTable.Th>}
              {openFields.status && <DataTable.Th>{t('app-users.status')}</DataTable.Th>}
              {openFields.email && <DataTable.Th>{t('app-users.email')}</DataTable.Th>}
              {openFields.rights && <DataTable.Th>{t('app-users.rights')}</DataTable.Th>}
              {openFields.groups && <DataTable.Th>{t('app-users.groups')}</DataTable.Th>}
              {openFields.expirationDate && (
                <DataTable.Th>{t('app-users.expiration')}</DataTable.Th>
              )}
              {openFields.actions && <DataTable.Th>{t('app-users.actions')}</DataTable.Th>}
            </DataTable.THeadTr>
          </DataTable.THead>
          <DataTable.TBody>
            {usersAPI.data.data
              .filter((user) => user.displayName.includes(searchText))
              .map((user) => (
                <DataTable.TBodyTr
                  key={user.id}
                  sx={S.CategoryListGrid}
                  selected={selectedUserIds.includes(user.id)}
                  style={user.status === 'DELETED' ? { backgroundColor: 'rgb(168,168,168)' } : {}}
                  onClick={
                    selectionMode
                      ? () => {
                          selectUser(user);
                        }
                      : () => {}
                  }
                  //selected={selectedUsersIds.includes(category.id)}
                  // onClick={() => selectCategory(category)}
                  //onDoubleClick={() => openCategoryEditDialog(category)}
                >
                  {openFields.ID && (
                    <DataTable.Td
                      onDoubleClick={
                        !selectionMode
                          ? () => {
                              copyToClipboard(user?.id);
                            }
                          : () => {}
                      }
                    >
                      {user?.id}
                    </DataTable.Td>
                  )}
                  {openFields.name && (
                    <DataTable.Td>
                      <DataTable.CategoryNameInnerTd>
                        <DataTable.ThumbnailWrapper>
                          <DataTable.ThumbnailImg
                            src={`${config.EXTERNAL.CUBLICK._ROOT}${user.avatarUrl}`}
                            alt='Thumbnail 이미지'
                          />
                        </DataTable.ThumbnailWrapper>
                        <DataTable.CategoryNameWrapper
                          onDoubleClick={() => {
                            copyToClipboard(user.displayName);
                            alert(`copied ${user.displayName}`);
                          }}
                        >
                          {user?.displayName}
                        </DataTable.CategoryNameWrapper>
                      </DataTable.CategoryNameInnerTd>
                    </DataTable.Td>
                  )}
                  {openFields.status && (
                    <DataTable.Td>
                      <S.Status src={user?.liveStatus === 'ONLINE' ? onlineImg : offlineImg} />
                    </DataTable.Td>
                  )}
                  {openFields.email && (
                    <DataTable.Td
                      onDoubleClick={() => {
                        copyToClipboard(user?.email);
                      }}
                    >
                      <S.TextSpan>{user?.email}</S.TextSpan>
                    </DataTable.Td>
                  )}
                  {openFields.rights && (
                    <DataTable.Td
                      onDoubleClick={() => {
                        copyToClipboard(user?.userRight);
                      }}
                    >
                      <S.TextSpan>{user?.userRight}</S.TextSpan>
                    </DataTable.Td>
                  )}
                  {openFields.groups && (
                    <DataTable.Td
                      onDoubleClick={() => {
                        copyToClipboard(user.userRight);
                      }}
                    >
                      <S.TextSpan>{user?.userRight}</S.TextSpan>
                    </DataTable.Td>
                  )}
                  {openFields.expirationDate && (
                    <DataTable.Td
                      onDoubleClick={() => {
                        copyToClipboard(user?.expiredDate);
                      }}
                    >
                      <S.TextSpan>
                        {new Date(user?.expiredDate).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                        })}
                      </S.TextSpan>
                    </DataTable.Td>
                  )}

                  {openFields.actions && (
                    <DataTable.Td>
                      <Page.TdActions>
                        {/* <Page.FunctionButton>
                          <FontAwesomeIcon
                            icon={faCopy}
                            color='#737475'
                            onClick={() => copyToClipboard(user)}
                          />
                        </Page.FunctionButton> */}
                        <Page.FunctionButton>
                          <FontAwesomeIcon
                            icon={faEdit}
                            color='#3e70d6'
                            onClick={() => openUserEditDialog(user)}
                          />
                        </Page.FunctionButton>
                        <Page.FunctionButton>
                          <FontAwesomeIcon
                            icon={faTrash}
                            color='#e85050'
                            onClick={() => openUserDeleteDialog(user)}
                          />
                        </Page.FunctionButton>
                      </Page.TdActions>
                    </DataTable.Td>
                  )}
                </DataTable.TBodyTr>
              ))}
          </DataTable.TBody>
        </DataTable.Table>
        <Pagination paginationInfo={usersAPI.data.pages} onPageChange={apiActions.changePage} />
      </Page2.ContentWrapper>
    </Page2.Container>
  );
};
