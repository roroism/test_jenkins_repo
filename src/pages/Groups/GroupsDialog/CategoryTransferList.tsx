import { APIListParams } from '@app/src/apis';
import { useLayoutEffect, useState } from 'react';
import TransferList, { TransferListEnum } from '../TransferList/TransferList';
import React from 'react';
import { useCategoriesQuery } from '@app/src/apis/category/useCategoriesQuery';
import type { CategoryAPIResponse } from '@app/src/apis/category';

const defaultAPICategoryParams: APIListParams = {
  // perPage: 20,
  // page: 1,
  sort: '-updatedDate',
  order: 'DESC',
  filter: [],
};

interface CategoryTransferListProps {
  editLeftItems: {
    leftItems: any;
    setLeftItems: React.Dispatch<React.SetStateAction<any>>;
  };
  editManager?: { selectedManagers: any; setSelectedManagers: any };
}

export default function CategoryTransferList({
  editLeftItems,
  editManager,
}: CategoryTransferListProps) {
  const [params, apiActions, categoryApi] = useCategoriesQuery(defaultAPICategoryParams);
  const [allCategory, setAllCategory] = useState<CategoryAPIResponse[]>([]);

  useLayoutEffect(() => {
    console.log('useLayoutEffect categoryApi.data.data :: ', categoryApi.data.data);
    setAllCategory(categoryApi.data.data);
  }, [categoryApi.data.data]);

  console.log('categoryApi.data.data :: ', categoryApi.data);
  return (
    <>
      {allCategory.length > 0 && (
        <TransferList
          editLeftItems={editLeftItems}
          editRightItems={{
            rightItems: allCategory,
            setRightItems: setAllCategory,
          }}
          editManager={editManager}
          transferValue={TransferListEnum.category}
        />
      )}
    </>
  );
}
