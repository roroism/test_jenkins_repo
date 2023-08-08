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
import { debounce } from '@app/src/utils';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import { faEdit } from '@fortawesome/pro-solid-svg-icons/faEdit';
import { faPlusCircle } from '@fortawesome/pro-solid-svg-icons/faPlusCircle';
// import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { faTrash } from '@fortawesome/pro-regular-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { CategoryDialog } from '../CategoryDialog';
import * as S from './CategoryList.style';
import * as Page2 from '@app/src/components/Page2.style';
import * as DataTable from '@app/src/components/DataTable.style';
import { useSelector } from 'react-redux';
import { selectToken } from '@app/src/store/slices/authSlice';
import { config } from '@app/src/config';
import { Checkbox } from '@mui/material';
import { css } from '@emotion/react';
import PerPageSelect from '@app/src/components/PerPageSelect/PerPageSelect';

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 10,
  order: 'DESC',
  sort: `-updateDate`,
  filter: [],
  q: '',
  // filterMode: 'AND',
};

export function CategoryList() {
  const { t } = useTranslation();
  const modalCtrl = useModal();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<CategoryAPIResponse[]>([]);
  const [params, apiActions, categoryApi] = useCategoriesQuery(defaultAPIListParams);
  const authToken = useSelector(selectToken());
  const [selectionMode, setSelctionMode] = useState(false);
  const mutateDeleteCategory = useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: () => {
      categoryApi.refetch();
      setSelectedCategories([]);
    },
  });

  const handleSearchValue = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, 300);

  const openCategoryAddDialog = () => {
    modalCtrl.open(<CategoryDialog mode='ADD' />);
  };

  const openCategoryEditDialog = (category: CategoryAPIResponse) => {
    console.log(category.id, category.name, category.iconId, category.iconName);
    modalCtrl.open(<CategoryDialog mode='EDIT' baseCategory={category} />);
  };

  const openCategoryDeleteConfirm = (selectedCategories: CategoryAPIResponse[]) => {
    if (selectedCategories.length === 0) {
      modalCtrl.open(<Alert text='삭제할 카테고리를 선택해주세요.' />);
      return;
    }
    modalCtrl.open(
      <Confirm
        text='삭제 하시겠습니까?'
        onConfirmed={async () => {
          try {
            for (const category of selectedCategories) {
              await mutateDeleteCategory.mutateAsync(category.id);
            }
          } catch (error) {
            modalCtrl.open(<Alert text='카테고리 삭제에 실패하였습니다.' />);
          }
        }}
      />
    );
  };

  const selectCategory = (category: CategoryAPIResponse) => {
    setSelectedCategories((prev) => {
      const index = prev.findIndex((prevCategory) => prevCategory.id === category.id);
      if (index !== -1) return [...prev.slice(0, index), ...prev.slice(index + 1)];
      /**
       * Category를 하나만 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      // return [category];
      /**
       * Category를 여러개 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      return [...prev, category];
    });
  };

  const onSelectAllClick = () => {
    setSelectedCategories((prev) => {
      if (prev.length === categoryApi.data.data.length) return [];
      return categoryApi.data.data;
    });
  };
  console.log('category : ', categoryApi.data.data);
  const selectedCategoryIds = selectedCategories.map((category) => category.id);
  return (
    <Page2.Container>
      <Page.Title>카테고리 관리</Page.Title>
      <Page.Actions
        css={css`
          margin-top: 32px;
        `}
      >
        <Page.ActionButton onClick={openCategoryAddDialog}>
          <FontAwesomeIcon icon={faPlusCircle} color='#3e70d6' size='lg' />
          &nbsp; 새로만들기
        </Page.ActionButton>
        {/* <Page.ActionButton onClick={onSelectAllClick}>
          <FontAwesomeIcon icon={faCheck} />
          &nbsp; 전체선택
        </Page.ActionButton> */}
        <Page.ActionButton onClick={() => openCategoryDeleteConfirm(selectedCategories)}>
          <FontAwesomeIcon icon={faTrash} />
          &nbsp; 선택삭제
        </Page.ActionButton>
        <Page.ActionButton onClick={() => categoryApi.refetch()}>
          <FontAwesomeIcon icon={faSyncAlt} color='hsl(0, 0%, 30%)' />
          &nbsp; 새로고침
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
      </Page.Actions>
      <Page2.ContentWrapper>
        <DataTable.Table>
          <DataTable.THead>
            <DataTable.THeadTr sx={S.CategoryListGrid}>
              <DataTable.Th>
                <Checkbox
                  checked={selectedCategories.length === categoryApi.data.data.length}
                  // indeterminate={selectedCategories.length != categoryApi.data.data.length}
                  indeterminate={
                    selectedCategories.length !== 0 &&
                    selectedCategories.length !== categoryApi.data.data.length
                  }
                  onChange={onSelectAllClick}
                />
              </DataTable.Th>
              <DataTable.Th>{t('app-Category.name')}</DataTable.Th>
              <DataTable.Th>{t('app-Category.owner')}</DataTable.Th>
              <DataTable.Th>{t('app-Category.speed')}</DataTable.Th>
              <DataTable.Th>{t('app-Category.createdDate')}</DataTable.Th>
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
                  // onClick={() => selectCategory(category)}
                  onDoubleClick={() => openCategoryEditDialog(category)}
                >
                  <DataTable.Td>
                    <Checkbox
                      checked={selectedCategoryIds.includes(category.id)}
                      onChange={() => selectCategory(category)}
                    />
                  </DataTable.Td>
                  <DataTable.Td>
                    <DataTable.CategoryNameInnerTd>
                      <DataTable.ThumbnailWrapper>
                        <DataTable.ThumbnailImg
                          src={config.EXTERNAL.CUBLICK.ASSET.THUMBNAIL(category.iconId, authToken)}
                          alt='Thumbnail 이미지'
                        />
                      </DataTable.ThumbnailWrapper>
                      <DataTable.CategoryNameWrapper>
                        {category?.name}
                      </DataTable.CategoryNameWrapper>
                    </DataTable.CategoryNameInnerTd>
                  </DataTable.Td>
                  <DataTable.Td>
                    {category.owner ? category.owner.displayName : 'None'}
                  </DataTable.Td>
                  <DataTable.Td>{category?.speed + ' sec'}</DataTable.Td>
                  <DataTable.Td>
                    {dayjs(category?.createdDate).format('YYYY-MM-DD HH:mm')}
                  </DataTable.Td>
                  <DataTable.Td>
                    {dayjs(category?.updatedDate).format('YYYY-MM-DD HH:mm')}
                  </DataTable.Td>
                  <DataTable.Td>
                    <Page.TdActions>
                      <Page.FunctionButton onClick={() => openCategoryEditDialog(category)}>
                        <FontAwesomeIcon icon={faEdit} color='#3e70d6' />
                      </Page.FunctionButton>
                      <Page.FunctionButton onClick={() => openCategoryDeleteConfirm([category])}>
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
    </Page2.Container>
  );
}
