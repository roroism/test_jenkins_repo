import { Asset } from '@app/src/apis/assets';
import { addCategory, Category, CategoryAPIResponse, editCategory } from '@app/src/apis/category';
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
import * as S from './CategoryDialog.style';
import { useAssets } from '@app/src/apis/assets/useAssets';
import { APIListParams } from '@app/src/apis';
import * as Page from '@app/src/components/Page.style';
import { config } from '@app/src/config';
import { useSelector } from 'react-redux';
import { selectToken } from '@app/src/store/slices/authSlice';

type CategoryDialogProps = ModalProps & ({ closeAnimation?: boolean }) &
  (
    | { mode: 'ADD' }
    | { mode: 'EDIT'; baseCategory: CategoryAPIResponse }
    | { mode: 'COPY'; baseCategory: CategoryAPIResponse }
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

const createCategory = (): Category => {
  return {
    id: '',
    name: '',
    speed: 60,
    iconId: '',
    iconName: '업로드',
  };
};

export function CategoryDialog(props: CategoryDialogProps) {
  const { mode, closeSelf, closeAnimation = true } = props;

  const { t } = useTranslation();
  const modalBodyRef = useRef(null);
  const modalBackgroundRef = useRef(null);
  const modalCtrl = useModal();
  const queryClient = useQueryClient();
  const [params, apiActions, api] = useAssets(defaultAPIListParams);
  const authToken = useSelector(selectToken());

  const defaultCategory = useMemo(() => {
    if (mode === 'ADD') return createCategory();
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

  const [category, categoryActions] = useTypeSafeReducer(defaultCategory, {
    set: (_, category: Category) => category,
    onCategoryNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name = e.target.value;
    },
    onCategorySpeedChange: (state, e: React.ChangeEvent<HTMLButtonElement>) => {
      const newSpeed = Number(e.target.value);
      if (newSpeed < 0) return { ...state, speed: 0 };
      if (newSpeed > 100) return { ...state, speed: 100 };
      state.speed = newSpeed;
    },
    onAssetSelect: (state, asset: Asset) => {
      state.iconId = asset.id;
      state.iconName = asset.name;
    },
    // onGroupSelect: (state) => {
    //   state.group = state;
    // },
  });

  const mutateCreateCategory = useMutation({
    mutationFn: () => addCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      closeSelf();
    },
    onError: () => modalCtrl.open(<Alert text='카테고리 추가에 실패하였습니다.' />),
  });

  const mutateEditCategory = useMutation({
    mutationFn: () => editCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      closeSelf();
    },
    onError: () => modalCtrl.open(<Alert text='카테고리 수정에 실패하였습니다.' />),
  });

  const [noImage, setNoImage] = useState<boolean>(false);

  useEffect(() => {
    setNoImage(false);
  }, [category.iconName]);

  const openAssetAddDialog = () => {
    modalCtrl.open(<Selection availables={['IMAGE']} onSelect={categoryActions.onAssetSelect} />);
  };

  const handleSelectGroupClick = () => {
    // admin은 모든 그룹 보기.
    // manager는 선택권 없음. (자기그룹만 추가 삭제)
    // Selection의 onSelect, CategoryDialog의 defaulttype 수정 필요.
    modalCtrl.open(
      <Selection availables={['GROUPMANAGEMENT']} onSelect={categoryActions.onAssetSelect} />
    );
  };

  const isCategoryNameValid = category.name.length !== 0;
  const isCategorySpeedValid = category.speed !== 0;
  const isIconValid = category.iconId.length !== 0;
  const isMutating = mutateCreateCategory.isLoading || mutateEditCategory.isLoading;
  const isButtonDisabled =
    isMutating || !isCategoryNameValid || !isCategorySpeedValid || !isIconValid;

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
  }

  return (
    <Modal.Container>
      <Modal.Background ref={modalBackgroundRef} onClick={onClose} />
      <Modal.Body ref={modalBodyRef}>
        <Modal.Title>
          {mode === 'ADD' ? '카테고리 추가' : null}
          {mode === 'EDIT' ? '카테고리 수정' : null}
          {mode === 'COPY' ? '카테고리 복사' : null}
        </Modal.Title>
        <Modal.Content>
          <Layout.Box mb='15px'>
            <Form.Label htmlFor='name'>카테고리 이름 (10자 미만)</Form.Label>
            {!isCategoryNameValid ? (
              <Form.ErrMsg>카테고리의 이름을 입력해주세요.</Form.ErrMsg>
            ) : null}
            <Form.Input
              id='name'
              value={category.name}
              onChange={categoryActions.onCategoryNameChange}
              minLength={1}
              maxLength={10}
              autoComplete='off'
              autoCorrect='off'
            />
          </Layout.Box>
          <Layout.Box mb='15px'>
            <Form.Label htmlFor='speed'>카테고리 속도 (단위: 초)</Form.Label>
            {!isCategorySpeedValid ? <Form.ErrMsg>1초 이상으로 설정해주세요.</Form.ErrMsg> : null}
            <Form.Input
              id='speed'
              type='number'
              min={1}
              max={100}
              value={String(category.speed)}
              onChange={() => categoryActions.onCategorySpeedChange}
              autoComplete='off'
              autoCorrect='off'
            />
          </Layout.Box>
          <Layout.Box mb='15px'>
            <Form.Label htmlFor='icon'>카테고리 아이콘</Form.Label>
            {!isIconValid ? <Form.ErrMsg>아이콘을 등록해주세요.</Form.ErrMsg> : null}
            <S.ContentAddButton onClick={openAssetAddDialog}>
              {category.iconName}
            </S.ContentAddButton>
          </Layout.Box>
          {noImage ? null : (
            <Page.ThumbnailImage
              src={config.EXTERNAL.CUBLICK.ASSET.THUMBNAIL(category.iconId, authToken)}
              alt={category.iconName}
              onError={() => setNoImage(true)}
            />
          )}
          <Layout.Box mb='15px'>
            <Form.Label htmlFor='icon'>그룹 설정</Form.Label>
            <S.InputWrapper>
              <Form.Input
                id='group-name'
                // value={category.groupName}
                // onChange={categoryActions.onCategoryNameChange}
                minLength={1}
                maxLength={10}
                autoComplete='off'
                autoCorrect='off'
              />
              <S.SelectButton onClick={handleSelectGroupClick}>Select Group</S.SelectButton>
            </S.InputWrapper>
          </Layout.Box>
        </Modal.Content>
        <Modal.Actions>
          {mode === 'ADD' ? (
            <Modal.SaveButton
              onClick={() => mutateCreateCategory.mutate()}
              disabled={isButtonDisabled}
            >
              생성
            </Modal.SaveButton>
          ) : null}
          {mode === 'EDIT' ? (
            <Modal.SaveButton
              onClick={() => mutateEditCategory.mutate()}
              disabled={isButtonDisabled}
            >
              수정
            </Modal.SaveButton>
          ) : null}
          <Modal.CloseButton disabled={isMutating} onClick={onClose}>
            닫기
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
