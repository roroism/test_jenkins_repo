import { APIListParams } from '@app/src/apis';
import { CategoryAPIResponse, deleteCategory } from '@app/src/apis/category';
import { useCategoriesQuery } from '@app/src/apis/category/useCategoriesQuery';
import { Alert } from '@app/src/components/Alert';
import { Confirm } from '@app/src/components/Confirm';
import * as Form from '@app/src/components/Form.style';
import * as Page from '@app/src/components/Page.style';
import * as Page2 from '@app/src/components/Page2.style';
import * as DataTable from '@app/src/components/DataTable.style';
import { Pagination } from '@app/src/components/Pagination';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { CategoryDialog } from '@app/src/pages/Category/CategoryDialog';
import { debounce } from '@app/src/utils';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import { faEdit } from '@fortawesome/pro-solid-svg-icons/faEdit';
import { faPlusCircle } from '@fortawesome/pro-solid-svg-icons/faPlusCircle';
// import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { faTrash } from '@fortawesome/pro-regular-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import * as S from './CategorySelection.style';

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 10,
  order: 'DESC',
  sort: `-updateDate`,
};

type CategorySelectionProps = {
  onSelect: (category: CategoryAPIResponse | CategoryAPIResponse[]) => void;
  selectMultiple?: boolean;
};

export function CategorySelection(props: CategorySelectionProps) {
  const { onSelect, selectMultiple = false } = props;
  const { t } = useTranslation();
  const modalCtrl = useModal();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<CategoryAPIResponse[]>([]);
  const [params, apiActions, categoryApi] = useCategoriesQuery(defaultAPIListParams);

  const handleSearchValue = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, 300);

  const openCategoryAddDialog = () => {
    modalCtrl.open(<CategoryDialog mode='ADD' />);
  };

  const openCategoryEditDialog = (category: CategoryAPIResponse) => {
    modalCtrl.open(<CategoryDialog mode='EDIT' baseCategory={category} />);
  };

  const openCategoryDeleteConfirm = (categoryId: string) => {
    modalCtrl.open(
      <Confirm
        text='삭제 하시겠습니까?'
        onConfirmed={() => {
          deleteCategory(categoryId).catch(() => {
            modalCtrl.open(<Alert text='카테고리 삭제에 실패하였습니다.' />);
          });
        }}
      />
    );
  };

  const selectCategory = (category: CategoryAPIResponse) => {
    setSelectedCategories((prev) => {
      const index = prev.findIndex((prevCategory) => prevCategory.id === category.id);
      if (index !== -1) return [...prev.slice(0, index), ...prev.slice(index + 1)];

      if (selectMultiple) {
        /**
         * Category를 여러개 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
         */
        return [...prev, category];
      } else {
        /**
         * Category를 하나만 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
         */
        return [category];
      }
    });
  };

  useEffect(() => {
    if (!selectMultiple && selectedCategories.length === 1) {
      console.log('CategorySelection selectedCategories : ', selectedCategories);
      onSelect(selectedCategories[0]);
      return;
    }
    if (selectMultiple && selectedCategories.length > 0) {
      console.log('CategorySelection selectedCategories : ', selectedCategories);
      onSelect(selectedCategories);
      return;
    }
    onSelect(null);
  }, [selectedCategories.length]);

  const selectedCategoryIds = selectedCategories.map((category) => category.id);
  return (
    <>
      <Page.Actions>
        <Page.ActionButton onClick={openCategoryAddDialog}>
          <FontAwesomeIcon icon={faPlusCircle} color='#3e70d6' size='lg' />
          &nbsp; 새로만들기
        </Page.ActionButton>
        <Page.ActionButton onClick={() => categoryApi.refetch()}>
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
      <Page2.ContentWrapper>
        <DataTable.Table>
          <DataTable.THead>
            <DataTable.THeadTr sx={S.CategoryListGrid}>
              <DataTable.Th>{t('app-Category.name')}</DataTable.Th>
              <DataTable.Th>{t('app-Category.owner')}</DataTable.Th>
              <DataTable.Th>{t('app-Category.updateDate')}</DataTable.Th>
              <DataTable.Th>{t('app-Category.action')}</DataTable.Th>
            </DataTable.THeadTr>
          </DataTable.THead>
          <DataTable.TBody>
            {categoryApi.data.data
              .filter((category) => category.name.includes(searchText))
              .map((category) => (
                <DataTable.TBodyTr
                  key={category.id}
                  sx={S.CategoryListGrid}
                  selected={selectedCategoryIds.includes(category.id)}
                  onClick={() => selectCategory(category)}
                >
                  <DataTable.Td>{category.name}</DataTable.Td>
                  <DataTable.Td>
                    {category.owner ? category.owner.displayName : 'None'}
                  </DataTable.Td>
                  <DataTable.Td>
                    {dayjs(category.updatedDate).format('YYYY-MM-DD. HH:mm')}
                  </DataTable.Td>
                  <DataTable.Td>
                    <Page.TdActions>
                      <Page.FunctionButton onClick={() => openCategoryEditDialog(category)}>
                        <FontAwesomeIcon icon={faEdit} color='#3e70d6' />
                      </Page.FunctionButton>
                      <Page.FunctionButton onClick={() => openCategoryDeleteConfirm(category.id)}>
                        <FontAwesomeIcon icon={faTrash} color='#e85050' />
                      </Page.FunctionButton>
                    </Page.TdActions>
                  </DataTable.Td>
                </DataTable.TBodyTr>
              ))}
          </DataTable.TBody>
        </DataTable.Table>
        <Pagination paginationInfo={categoryApi.data.pages} onPageChange={apiActions.changePage} />
      </Page2.ContentWrapper>
    </>
  );
}
