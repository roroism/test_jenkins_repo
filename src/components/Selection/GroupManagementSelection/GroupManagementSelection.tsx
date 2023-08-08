import { APIListParams } from '@app/src/apis';
import { CategoryAPIResponse, deleteCategory } from '@app/src/apis/category';
import { useCategoriesQuery } from '@app/src/apis/category/useCategoriesQuery';
import { Alert } from '@app/src/components/Alert';
import { Confirm } from '@app/src/components/Confirm';
import * as Form from '@app/src/components/Form.style';
import * as Page from '@app/src/components/Page.style';
import { Pagination } from '@app/src/components/Pagination';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { CategoryDialog } from '@app/src/pages/Category/CategoryDialog';
import { debounce } from '@app/src/utils';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import { faEdit } from '@fortawesome/pro-solid-svg-icons/faEdit';
import { faPlusCircle } from '@fortawesome/pro-solid-svg-icons/faPlusCircle';
import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import * as S from './GroupManagementSelection.style';

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 10,
  order: 'DESC',
  sort: `-updateDate`,
};

type GroupSelectionProps = {
  onSelect: (group: CategoryAPIResponse) => void;
};

export function GroupManagementSelection(props: GroupSelectionProps) {
  const { onSelect } = props;
  const { t } = useTranslation();
  const modalCtrl = useModal();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<CategoryAPIResponse[]>([]);
  const [params, apiActions, groupApi] = useCategoriesQuery(defaultAPIListParams);

  const handleSearchValue = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, 300);

  // const openCategoryAddDialog = () => {
  //   modalCtrl.open(<CategoryDialog mode='ADD' />);
  // };

  const openCategoryEditDialog = (category: CategoryAPIResponse) => {
    modalCtrl.open(<CategoryDialog mode='EDIT' baseCategory={category} />);
  };

  // const openCategoryDeleteConfirm = (categoryId: string) => {
  //   modalCtrl.open(
  //     <Confirm
  //       text='삭제 하시겠습니까?'
  //       onConfirmed={() => {
  //         deleteCategory(categoryId).catch(() => {
  //           modalCtrl.open(<Alert text='카테고리 삭제에 실패하였습니다.' />);
  //         });
  //       }}
  //     />
  //   );
  // };

  const selectGroup = (group: CategoryAPIResponse) => {
    setSelectedGroup((prev) => {
      const index = prev.findIndex((prevGroup) => prevGroup.id === group.id);
      if (index !== -1) return [...prev.slice(0, index), ...prev.slice(index + 1)];
      /**
       * Group을 하나만 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      return [group];
      /**
       * Group을 여러개 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      // return [...prev, group];
    });
  };

  useEffect(() => {
    if (selectedGroup.length === 1) {
      onSelect(selectedGroup[0]);
      return;
    }
    onSelect(null);
  }, [selectedGroup.length]);

  const selectedGroupIds = selectedGroup.map((group) => group.id);
  return (
    <>
      <Page.Actions>
        {/* <Page.ActionButton onClick={openCategoryAddDialog}>
          <FontAwesomeIcon icon={faPlusCircle} color='#3e70d6' size='lg' />
          &nbsp; 새로만들기
        </Page.ActionButton> */}
        <Page.ActionButton onClick={() => groupApi.refetch()}>
          <FontAwesomeIcon icon={faSyncAlt} color='hsl(0, 0%, 30%)' />
          &nbsp; 새로고침
        </Page.ActionButton>
        <Page.ActionSelect
          color='secondary'
          value={params.perPage}
          onChange={apiActions.onPerPageChange}
        >
          <Form.Option value={10}>10</Form.Option>
          <Form.Option value={20}>20</Form.Option>
          <Form.Option value={30}>30</Form.Option>
          <Form.Option value={40}>40</Form.Option>
          <Form.Option value={50}>50</Form.Option>
        </Page.ActionSelect>
        <Page.SearchInput
          type='textbox'
          placeholder={t('app-common.search')}
          onChange={handleSearchValue}
        />
      </Page.Actions>
      <Page.Table>
        <Page.THead>
          <Page.Tr sx={S.GroupListGrid}>
            <Page.Th>{t('app-Category.name')}</Page.Th>
            <Page.Th>{t('app-Category.owner')}</Page.Th>
            <Page.Th>{t('app-Category.updateDate')}</Page.Th>
            {/* <Page.Th>{t('app-Category.action')}</Page.Th> */}
          </Page.Tr>
        </Page.THead>
        <Page.TBody>
          {groupApi.data.data
            .filter((group) => group.name.includes(searchText))
            .map((group) => (
              <Page.Tr
                key={group.id}
                sx={S.GroupListGrid}
                selectable
                selected={selectedGroupIds.includes(group.id)}
                onClick={() => selectGroup(group)}
              >
                <Page.Td>{group.name}</Page.Td>
                <Page.Td>{group.owner ? group.owner.displayName : 'None'}</Page.Td>
                <Page.Td>{dayjs(group.updatedDate).format('YYYY-MM-DD. HH:mm')}</Page.Td>
                {/* <Page.Td>
                  <Page.TdActions>
                    <Page.FunctionButton onClick={() => openCategoryEditDialog(group)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Page.FunctionButton>
                    <Page.FunctionButton onClick={() => openCategoryDeleteConfirm(group.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Page.FunctionButton>
                  </Page.TdActions>
                </Page.Td> */}
              </Page.Tr>
            ))}
        </Page.TBody>
      </Page.Table>
      <Pagination paginationInfo={groupApi.data.pages} onPageChange={apiActions.changePage} />
    </>
  );
}
