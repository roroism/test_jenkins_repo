import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import * as Modal from '@app/src/components/Modal.style';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { ModalProps } from '@app/src/store/model';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { WorkArea } from '../../lib/objects/fabric.workarea';

type Props = ModalProps & {
  workArea: WorkArea;
} & ModalProps;

export type Category = {
  categoryId: string;
  categoryName: string;
};

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5MmQxZDkxYjEzODczMTM1MGIxZDJmZiIsInVzZXJuYW1lIjoiZGVtbyIsImRpc3BsYXlOYW1lIjoiZGVtbyIsImVtYWlsIjoiZGVtb0BnbWFpbC5jb20iLCJhdmF0YXJVcmwiOiJhdmF0YXIvZGVmYXVsdF9hdmF0YXJfMTI4eDEyOC5wbmciLCJ1c2VyUmlnaHQiOiJFTkRfVVNFUiIsImlhdCI6MTY3NzkyOTE0NiwiZXhwIjoxNjgwMDg5MTQ2fQ.lTdWByBW9PCvZLA6-yLv4N8zTuVaiBk7e-TONIhp8HI';

const getChildCategoryByName = async (parentCategory: string) => {
  const url = `https://api-service.cublick.com/v1/auth/getChildCategories_byName`;
  const axiosConfig = {
    headers: { 'X-Access-Token': token },
    params: { parentCategory },
  };
  const res = await axios.get<Category[]>(url, axiosConfig);
  return res.data;
};

const maxCategoryDepth = 2;

export function DesignPropertyDialog(props: Props) {
  const { closeSelf, workArea } = props;
  const { t } = useTranslation();
  const [name, setName] = useState(workArea.name);
  const [desc, setDesc] = useState(workArea.desc);
  const [categories, setCategories] = useState(workArea.categories);

  const parentCategoryNames = ['elder']
    .concat(categories.map((c) => c.categoryName))
    .slice(0, maxCategoryDepth);

  const responses = useQueries({
    queries: parentCategoryNames.map((parentCategory) => ({
      queryKey: ['child_categories', parentCategory],
      queryFn: () => getChildCategoryByName(parentCategory),
      initialData: [] as Category[],
    })),
  });

  const onCategoryClick = (index: number, category: Category) => {
    if (!categories[index]) {
      setCategories((prev) => prev.concat([category]));
      return;
    }
    if (categories[index].categoryId !== category.categoryId) {
      setCategories((prev) => prev.slice(0, index).concat([category]));
      return;
    }
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(e.target.value);
  };

  const onSaveClick = () => {
    workArea.name = name;
    workArea.desc = desc;
    workArea.categories = categories;
    closeSelf();
  };

  const isNameValid = name.length > 0;
  const isButtonDisalbed = !isNameValid;
  return (
    <Modal.Container>
      <Modal.Background />
      <Modal.Body>
        <Modal.Title>디자인 이름과 설명 변경</Modal.Title>
        <Modal.Content>
          <Layout.Box mb='20px'>
            <Form.Label htmlFor='name'>{t('app-common.name')}</Form.Label>
            {!isNameValid ? <Form.ErrMsg>이름을 입력해주세요.</Form.ErrMsg> : null}
            <Form.Input
              id='name'
              name='name'
              placeholder='New Presentation'
              onChange={onNameChange}
              value={name}
              autoComplete='off'
              autoCorrect='off'
              autoFocus
            />
          </Layout.Box>

          <Layout.Box mb='20px'>
            <Form.Label htmlFor='desc'>{t('app-presentation.preview.desc')}</Form.Label>
            <Form.TextArea
              id='desc'
              name='desc'
              rows={5}
              placeholder={t('app-presentation.preview.desc')}
              onChange={onDescChange}
              value={desc}
              autoComplete='off'
              autoCorrect='off'
            />
          </Layout.Box>

          {responses.map((response, index) => (
            <div key={index}>
              <Layout.Box mb='20px'>
                <Form.Label>제{index + 1} 카테고리</Form.Label>
              </Layout.Box>
              <Layout.CategoryBox>
                {response.data.map((category) => (
                  <Layout.CategoryItem
                    select={category.categoryName === categories[index]?.categoryName}
                    key={category.categoryId + index}
                    onClick={() => onCategoryClick(index, category)}
                  >
                    {category.categoryName}
                  </Layout.CategoryItem>
                ))}
              </Layout.CategoryBox>
            </div>
          ))}
        </Modal.Content>
        <Modal.Actions>
          <Modal.SaveButton onClick={onSaveClick} disabled={isButtonDisalbed}>
            저장
          </Modal.SaveButton>
          <Modal.CloseButton onClick={closeSelf}>닫기</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
