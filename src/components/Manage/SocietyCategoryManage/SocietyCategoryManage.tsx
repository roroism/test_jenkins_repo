import React, { useCallback, useMemo, useState } from 'react';
import { CategoryInSociety } from '@app/src/apis/societyManagement';

import * as Page from '@app/src/components/Page.style';
import * as Table from '@app/src/components/DataTable.style';
import * as S from './SocietyCategoryManage.style';

import Button from '../../Button/Button';
import { Checkbox } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlusCircle, faTrash } from '@fortawesome/pro-regular-svg-icons';

export interface SocietyCategoryManagePropsType {
  categories: CategoryInSociety[];
}

const SocietyCategoryManage = ({ categories }: SocietyCategoryManagePropsType) => {
  const [selectedCategoryIdList, setSelectedCategoryIdList] = useState([]);
  const categoriIdList = useMemo(() => categories.map((c) => c.categoryId), [categories]);
  const allChecked = useMemo(
    () => selectedCategoryIdList.length === categoriIdList.length,
    [selectedCategoryIdList, categoriIdList]
  );

  const toggleAllSelect = useCallback(() => {
    if (selectedCategoryIdList.length > 0) {
      setSelectedCategoryIdList([]);
      return;
    }
    setSelectedCategoryIdList(categoriIdList);
  }, [selectedCategoryIdList]);

  const onCheck = useCallback(
    (userId: string, checked: boolean) => {
      if (checked) {
        setSelectedCategoryIdList((prev) => prev.filter((id) => id !== userId));
        return;
      }
      setSelectedCategoryIdList((prev) => [...prev, userId]);
    },
    [selectedCategoryIdList]
  );
  return (
    <>
      <Page.Actions>
        <Button
          title='카테고리 추가'
          icon={<FontAwesomeIcon icon={faPlusCircle} size='lg' />}
          disabled={false}
          onClick={() => {}}
        />
        <Button
          title='선택한 카테고리 삭제'
          icon={<FontAwesomeIcon icon={faTrash} size='lg' />}
          disabled={false}
          onClick={() => {}}
        />
      </Page.Actions>
      <Table.Table>
        <Table.THead>
          <Table.THeadTr sx={S.THeadGrid}>
            <Table.Th>
              <Checkbox checked={allChecked} onChange={toggleAllSelect} />
            </Table.Th>
            {['카테고리명', '소유자', '화면 전환 속도', ''].map((title, index) => (
              <Table.Th key={`title-${index}`}>{title}</Table.Th>
            ))}
          </Table.THeadTr>
        </Table.THead>
        <Table.TBody>
          {categories.map((c) => {
            const isChecked = selectedCategoryIdList.includes(c.categoryId);
            return makeRow(c, isChecked, onCheck);
          })}
        </Table.TBody>
      </Table.Table>
    </>
  );
};

const makeRow = (
  category: CategoryInSociety,
  isChecked: boolean,
  onChecked: (categoryId: String, checked: boolean) => void
) => {
  const { categoryId } = category;
  return (
    <Table.TBodyTr sx={S.THeadGrid} key={`${categoryId}`}>
      <Table.Td>
        <Checkbox checked={isChecked} onChange={() => onChecked(categoryId, isChecked)} />
      </Table.Td>
      <Table.Td>{category.categoryName}</Table.Td>
      <Table.Td>소유자 이름</Table.Td>
      <Table.Td>00초</Table.Td>
      <Table.Td>
        <S.ButtonBox>
          <Page.FunctionButton>
            <FontAwesomeIcon icon={faEdit} color='#3e70d6' onClick={() => {}} />
          </Page.FunctionButton>
          <Page.FunctionButton>
            <FontAwesomeIcon icon={faTrash} color='#e85050' onClick={() => {}} />
          </Page.FunctionButton>
        </S.ButtonBox>
      </Table.Td>
    </Table.TBodyTr>
  );
};

export default SocietyCategoryManage;
