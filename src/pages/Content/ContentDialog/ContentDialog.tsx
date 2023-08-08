import { Asset } from '@app/src/apis/assets';
import { CategoryAPIResponse } from '@app/src/apis/category';
import {
  ContentAPISingle,
  CreateContentParam,
  putContent,
  postContent,
} from '@app/src/apis/content';
import { Alert } from '@app/src/components/Alert';
import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import * as Modal from '@app/src/components/Modal.style';
import { Selection } from '@app/src/components/Selection';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { useTypeSafeReducer } from '@app/src/hooks/useTypeSafeReducer';
import { ModalProps } from '@app/src/store/model';
import { contentAPISingleToCreateContentParam } from '@app/src/utils';
import { faTrash, faEdit } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SelectChangeEvent, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { ColorResult } from 'react-color';
import * as S from './ContentDialog.style';
import * as Page from '@app/src/components/Page.style';
import { config } from '@app/src/config';
import { useSelector } from 'react-redux';
import { selectToken } from '@app/src/store/slices/authSlice';
import Popover from '@mui/material/Popover';
import { css } from '@emotion/react';

type ContentDialogProps = ModalProps &
  (
    | { mode: 'ADD' } //
    | { mode: 'EDIT'; content: ContentAPISingle }
    | { mode: 'COPY' }
  );

const createContent = (): CreateContentParam => {
  return {
    backgroundColor: '#FFFFFF',
    category: '',
    categoryId: '',
    data: [],
    deptName: '',
    didInfo: '',
    endDate: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm'),
    imageAlign: 'NONE',
    images: [],
    name: '',
    playingDevices: [],
    startDate: dayjs().add(5, 'hour').format('YYYY-MM-DDTHH:mm'),
    textAlign: 'CENTER',
    textColor: '#000000',
    textForm: false,
    titleBorder: false,
    titleColor: '#000000',
  };
};

const toKeyValueArray = (contentData: CreateContentParam['data']) => {
  const contentDataKeyValueArray: { key: string; value: string }[] = [];
  for (let i = 1; i < contentData.length / 2 + 1; i++) {
    const key = contentData.find((data) => data.code === `key_${i}`)?.value;
    if (!key) continue;
    const value = contentData.find((data) => data.code === `value_${i}`)?.value;
    if (!value) continue;
    contentDataKeyValueArray.push({ key, value });
  }
  return contentDataKeyValueArray;
};

export function ContentDialog(props: ContentDialogProps) {
  const { mode, closeSelf } = props;

  const { t } = useTranslation();
  const modalCtrl = useModal();
  const queryClient = useQueryClient();
  const authToken = useSelector(selectToken());

  const defaultContent = useMemo(() => {
    if (mode === 'ADD') return createContent();
    if (mode === 'EDIT') return contentAPISingleToCreateContentParam(props.content);
    if (mode === 'COPY') return createContent();
  }, []);
  const [content, contentActions] = useTypeSafeReducer(defaultContent, {
    onContentNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name = e.target.value;
    },
    onDidInfoChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.didInfo = e.target.value;
    },
    onCategoryChange: (state, category: CategoryAPIResponse) => {
      state.category = category.name;
      state.categoryId = category.id;
    },
    onBackgroundColorChange: (state, color: ColorResult) => {
      state.backgroundColor = color.hex;
    },
    onTitleColorChange: (state, color: ColorResult) => {
      state.titleColor = color.hex;
    },
    onTitleBorderChange: (state, e: SelectChangeEvent) => {
      state.titleBorder = e.target.value === 'true';
    },
    onTextColorChange: (state, color: ColorResult) => {
      state.textColor = color.hex;
    },
    onTextFormChange: (state, e: SelectChangeEvent) => {
      state.textForm = e.target.value === 'true';
    },
    onStartDateChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.startDate = e.target.value;
    },
    onEndDateChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.endDate = e.target.value;
    },
    addAsset: (state, asset: Asset) => {
      state.images.push({ id: asset.id, name: asset.name });
    },
    removeAsset: (state, index: number) => {
      state.images.splice(index, 1);
    },
    updateAsest: (state, payload: { index: number; asset: Asset }) => {
      state.images[payload.index] = { id: payload.asset.id, name: payload.asset.name };
    },
    onImageAlignChange: (state, e: SelectChangeEvent) => {
      state.imageAlign = e.target.value as CreateContentParam['imageAlign'];
    },
    onTextAlignChange: (state, e: SelectChangeEvent) => {
      state.textAlign = e.target.value as CreateContentParam['textAlign'];
    },
    addContentData: (state, data: { key: string; value: string }) => {
      const index = state.data.length / 2 + 1;
      state.data.push({ code: `key_${index}`, value: data.key });
      state.data.push({ code: `value_${index}`, value: data.value });
    },
    updateContentData: (
      state,
      payload: { index: number; keyValueData: { key: string; value: string } }
    ) => {
      const keyIndex = state.data.findIndex((d) => d.code === `key_${payload.index}`);
      const valueIndex = state.data.findIndex((d) => d.code === `value_${payload.index}`);
      state.data[keyIndex].value = payload.keyValueData.key;
      state.data[valueIndex].value = payload.keyValueData.value;
    },
    removeContentData: (state, index: number) => {
      const keyIndex = state.data.findIndex((d) => d.code === `key_${index}`);
      const valueIndex = state.data.findIndex((d) => d.code === `value_${index}`);
      state.data.splice(keyIndex, 1);
      state.data.splice(valueIndex, 1);
    },
  });

  const mutateCreateContent = useMutation({
    mutationFn: () => postContent(content),
    // onMutate: () => queryClient.invalidateQueries(['contents']),
    onError: () => modalCtrl.open(<Alert text='컨텐츠 추가에 실패하였습니다.' />),
    onSuccess: () => {
      queryClient.invalidateQueries(['contents']);
      closeSelf();
    },
  });
  const mutateEditContent = useMutation({
    mutationFn: () => mode === 'EDIT' && putContent(content, props.content.id),
    // onMutate: () => queryClient.invalidateQueries(['contents']),
    onError: () => modalCtrl.open(<Alert text='컨텐츠 수정에 실패하였습니다.' />),
    onSuccess: () => {
      queryClient.invalidateQueries(['contents']);
      closeSelf();
    },
  });
  const mutateCopyContent = useMutation({
    mutationFn: () => postContent(content),
    // onMutate: () => queryClient.invalidateQueries(['contents']),
    onError: () => modalCtrl.open(<Alert text='컨텐츠 복사에 실패하였습니다.' />),
    onSuccess: () => {
      queryClient.invalidateQueries(['contents']);
      closeSelf();
    },
  });

  const openCategorySelection = () => {
    modalCtrl.open(
      <Selection availables={['CATEGORY']} onSelect={contentActions.onCategoryChange} />
    );
  };

  const openAssetSelectionForAdd = () => {
    modalCtrl.open(
      <Selection /** */
        availables={['ASSET']}
        onSelect={(asset) => contentActions.addAsset(asset)}
      />
    );
  };

  const openAssetSelectionForEdit = (index: number) => {
    modalCtrl.open(
      <Selection /** */
        availables={['ASSET']}
        onSelect={(asset) => contentActions.updateAsest({ index, asset })}
      />
    );
  };

  const openContentKeyValueDialogForAdd = () => {
    modalCtrl.open(<ContentKeyValueDialog onSave={contentActions.addContentData} />);
  };

  const openContentKeyValueDialogForEdit = (index: number) => {
    modalCtrl.open(
      <ContentKeyValueDialog
        onSave={(keyValueData) => contentActions.updateContentData({ index, keyValueData })}
      />
    );
  };

  const isContentNameValid = content.name.length > 0;
  const isCategoryValid = content.categoryId.length !== 0;
  const isEndDateFuture = dayjs(content.endDate).diff(Date.now()) > 0;
  const isStartDateBeforeEndDate = dayjs(content.startDate).diff(content.endDate) < 0;
  const isImageAddButtonDisabled = content.images.length === 2;
  const isButtonDisabled =
    !isContentNameValid || !isCategoryValid || !isEndDateFuture || !isStartDateBeforeEndDate;

  const [noImage, setNoImage] = useState<boolean>(false);
  const [backColorAnchorEl, setBackColorAnchorEl] = useState<null | HTMLElement>(null);
  const [titleColorAnchorEl, setTitleColorAnchorEl] = useState<null | HTMLElement>(null);
  const [textColorAnchorEl, setTextColorAnchorEl] = useState<null | HTMLElement>(null);

  // useEffect(() => {
  //   setNoImage(false);
  // }, [category.iconName]);
  console.log(
    'queryClient.getQueryData([assets]) : ',
    queryClient.getQueryData([
      'assets',
      {
        page: 1,
        perPage: 20,
        order: 'DESC',
        sort: '-updatedDate',
        filter: [
          { key: 'fileType', operator: '!=', value: '.svg' },
          { key: 'owner', operator: '=', value: 'mine' },
        ],
        q: '',
      },
    ])
  );

  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body width='75%'>
        <Modal.Title>
          {mode === 'ADD' ? '컨텐츠 추가' : null}
          {mode === 'EDIT' ? '컨텐츠 수정' : null}
        </Modal.Title>
        <S.Content>
          {/* Basic Settings */}
          <Layout.Box>
            <Layout.SubTitle>{t('app-common.basic-setting')}</Layout.SubTitle>
            <Layout.Box mb='20px'>
              <Form.Label htmlFor='name'>컨텐츠 이름</Form.Label>
              {!isContentNameValid ? (
                <Form.ErrMsg>컨텐츠의 이름을 입력해주세요.</Form.ErrMsg>
              ) : null}
              <Form.Input
                id='name'
                placeholder='컨텐츠 이름을 입력해주세요.'
                value={content.name}
                onChange={contentActions.onContentNameChange}
              />
            </Layout.Box>

            <Layout.Box mb='20px'>
              <Form.Label htmlFor='did-info'>컨텐츠 설명</Form.Label>
              <Form.Input
                id='did-info'
                placeholder='컨텐츠 설명을 입력해주세요.'
                value={content.didInfo}
                onChange={contentActions.onDidInfoChange}
              />
            </Layout.Box>

            <Layout.Box mb='20px'>
              <Form.Label htmlFor='category'>카테고리</Form.Label>
              {!isCategoryValid ? <Form.ErrMsg>카테고리를 선택해주세요.</Form.ErrMsg> : null}
              <Form.Input
                id='category'
                placeholder='눌러서 카테고리를 선택해주세요.'
                readOnly
                value={content.category}
                onClick={openCategorySelection}
              />
            </Layout.Box>

            <Layout.Box mb='20px'>
              <Form.Label htmlFor='start-date'>개시 시작</Form.Label>
              <TextField
                id='start-date'
                color='secondary'
                type='datetime-local'
                defaultValue={dayjs(content.startDate).format('YYYY-MM-DDTHH:mm')}
                onChange={contentActions.onStartDateChange}
                fullWidth
                inputProps={{ style: { fontSize: '1.4rem', padding: 10 } }}
                sx={{ fontSize: '1.4rem' }}
                // max='9999-12-31T23:59:59'
              />
            </Layout.Box>

            <Layout.Box mb='20px'>
              <Form.Label htmlFor='end-date'>개시 종료</Form.Label>
              {!isStartDateBeforeEndDate ? (
                <Form.ErrMsg>개시 종료 시각은 개시 시작 시각보다 빠를 수 없습니다.</Form.ErrMsg>
              ) : null}
              {!isEndDateFuture ? (
                <Form.ErrMsg>개시기간을 과거로 설정할 수 없습니다.</Form.ErrMsg>
              ) : null}
              <TextField
                id='end-date'
                color='secondary'
                type='datetime-local'
                defaultValue={dayjs(content.endDate).format('YYYY-MM-DDTHH:mm')}
                onChange={contentActions.onEndDateChange}
                fullWidth
                inputProps={{ style: { fontSize: '1.4rem', padding: 10 } }}
                sx={{ fontSize: '1.4rem' }}
                // max='9999-12-31T23:59:59'
              />
            </Layout.Box>
          </Layout.Box>

          {/* Background Properties */}
          <Layout.Box>
            <Layout.SubTitle>Background Properties</Layout.SubTitle>
            <Layout.Box mb='20px'>
              <Layout.Box display='flex' alignItems='center'>
                <Form.Label
                  htmlFor='backcolorpicker'
                  css={css`
                    height: 30px;
                    margin-bottom: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  `}
                >
                  배경 색상
                </Form.Label>
                <S.ColorPickerPopperButton
                  id='backcolorpicker'
                  type='button'
                  backgroundColor={content.backgroundColor}
                  onClick={(e) => {
                    console.log('backColorAnchorEl Click : ', backColorAnchorEl);
                    setBackColorAnchorEl(backColorAnchorEl ? null : e.currentTarget);
                  }}
                >
                  <div></div>
                </S.ColorPickerPopperButton>
              </Layout.Box>
              <Popover
                open={Boolean(backColorAnchorEl)}
                onClose={() => setBackColorAnchorEl(null)}
                anchorEl={backColorAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                id='backcolorpicker-popover'
                sx={{ zIndex: 1 }}
              >
                <Layout.ChromePicker
                  disableAlpha={true}
                  color={content.backgroundColor}
                  onChange={contentActions.onBackgroundColorChange}
                />
              </Popover>
            </Layout.Box>
          </Layout.Box>

          {/* Title Properties */}
          <Layout.Box>
            <Layout.SubTitle>Title Properties</Layout.SubTitle>
            <Layout.Box mb='20px'>
              <Layout.Box display='flex' alignItems='center'>
                <Form.Label
                  htmlFor='titlecolorpicker'
                  css={css`
                    height: 30px;
                    margin-bottom: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  `}
                >
                  제목 색상
                </Form.Label>
                <S.ColorPickerPopperButton
                  id='titlecolorpicker'
                  type='button'
                  backgroundColor={content.titleColor}
                  onClick={(e) => {
                    console.log('titleColorAnchorEl Click : ', titleColorAnchorEl);
                    setTitleColorAnchorEl(titleColorAnchorEl ? null : e.currentTarget);
                  }}
                >
                  <div></div>
                </S.ColorPickerPopperButton>
              </Layout.Box>
              <Popover
                open={Boolean(titleColorAnchorEl)}
                onClose={() => setTitleColorAnchorEl(null)}
                anchorEl={titleColorAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                id='titlecolorpicker-popover'
                sx={{ zIndex: 1 }}
              >
                <Layout.ChromePicker
                  disableAlpha={true}
                  color={content.titleColor}
                  onChange={contentActions.onTitleColorChange}
                />
              </Popover>
            </Layout.Box>

            <Layout.Box mb='20px'>
              <Form.Label htmlFor='title-border'>제목 테두리</Form.Label>
              <Form.Select
                color='secondary'
                id='title-border'
                value={String(content.titleBorder)}
                onChange={contentActions.onTitleBorderChange}
              >
                <Form.Option value='true'>있음</Form.Option>
                <Form.Option value='false'>없음</Form.Option>
              </Form.Select>
            </Layout.Box>
          </Layout.Box>

          {/* Text Properties */}
          <Layout.Box>
            <Layout.SubTitle>Text Properties</Layout.SubTitle>
            <Layout.Box mb='20px'>
              <Layout.Box display='flex' alignItems='center'>
                <Form.Label
                  htmlFor='textcolorpicker'
                  css={css`
                    height: 30px;
                    margin-bottom: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  `}
                >
                  텍스트 색상
                </Form.Label>
                <S.ColorPickerPopperButton
                  id='textcolorpicker'
                  type='button'
                  backgroundColor={content.textColor}
                  onClick={(e) => {
                    console.log('textColorAnchorEl Click : ', textColorAnchorEl);
                    setTextColorAnchorEl(textColorAnchorEl ? null : e.currentTarget);
                  }}
                >
                  <div></div>
                </S.ColorPickerPopperButton>
              </Layout.Box>
              <Popover
                open={Boolean(textColorAnchorEl)}
                onClose={() => setTextColorAnchorEl(null)}
                anchorEl={textColorAnchorEl}
                id='textcolorpicker-popover'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                sx={{ zIndex: 1 }}
              >
                <Layout.ChromePicker
                  disableAlpha={true}
                  color={content.textColor}
                  onChange={contentActions.onTextColorChange}
                />
              </Popover>
            </Layout.Box>

            <Layout.Box mb='20px'>
              <Form.Label htmlFor='text-form'>텍스트 줄</Form.Label>
              <Form.Select
                color='secondary'
                id='text-form'
                value={String(content.textForm)}
                onChange={contentActions.onTextFormChange}
              >
                <Form.Option value='true'>있음</Form.Option>
                <Form.Option value='false'>없음</Form.Option>
              </Form.Select>
            </Layout.Box>

            <Layout.Box mb='20px'>
              <Form.Label htmlFor='text-align'>텍스트 정렬</Form.Label>
              <Form.Select
                color='secondary'
                id='text-align'
                value={content.textAlign}
                onChange={contentActions.onTextAlignChange}
              >
                <Form.Option value='LEFT'>왼쪽</Form.Option>
                <Form.Option value='CENTER'>중앙</Form.Option>
                <Form.Option value='RIGHT'>오른쪽</Form.Option>
              </Form.Select>
            </Layout.Box>
          </Layout.Box>

          {/* Contents Properties */}
          <Layout.Box>
            <Layout.SubTitle>Contents Properties</Layout.SubTitle>
            <Layout.Box mb='20px'>
              {/* <S.ContentAddButton
                disabled={isImageAddButtonDisabled}
                onClick={openAssetSelectionForAdd}
              >
                이미지 추가
              </S.ContentAddButton> */}
              <Form.Label>이미지 추가</Form.Label>
              <Layout.Box display='flex'>
                {content.images.map((image, index) => (
                  <>
                    {/* <S.ContentImageItem key={index}>

                    <div className='name'>{image.name}</div>
                    <div className='duration'>{image.id}</div>

                    <button className='edit' onClick={() => openAssetSelectionForEdit(index)}>
                      수정
                    </button>
                    <button className='delete' onClick={() => contentActions.removeAsset(index)}>
                      <FontAwesomeIcon icon={faTrash} size='1x' />
                    </button>
                  </S.ContentImageItem> */}
                    <Layout.Box>
                      <Layout.Box display='flex'>
                        {noImage ? null : (
                          <S.ThumbnailImageWrapper>
                            <S.ThumbnailImage
                              src={config.EXTERNAL.CUBLICK.ASSET.THUMBNAIL(image.id, authToken)}
                              alt={image.name}
                              onError={() => setNoImage(true)}
                            />
                            <S.HoverDiv className='hover-div'>
                              <S.HoverDivInner>
                                <button
                                  className='edit'
                                  onClick={() => openAssetSelectionForEdit(index)}
                                  type='button'
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                  className='delete'
                                  onClick={() => contentActions.removeAsset(index)}
                                  type='button'
                                >
                                  <FontAwesomeIcon icon={faTrash} size='1x' />
                                </button>
                              </S.HoverDivInner>
                            </S.HoverDiv>
                          </S.ThumbnailImageWrapper>
                        )}
                      </Layout.Box>
                    </Layout.Box>
                  </>
                ))}
                <S.AddImgButton
                  type='button'
                  onClick={openAssetSelectionForAdd}
                  hidden={isImageAddButtonDisabled}
                >
                  <div>
                    <div></div>
                  </div>
                </S.AddImgButton>
              </Layout.Box>
            </Layout.Box>

            <Layout.Box mb='20px'>
              <Form.Label htmlFor='image-align'>이미지 위치</Form.Label>
              <Form.Select
                color='secondary'
                id='image-align'
                disabled={content.images.length !== 1}
                value={content.imageAlign}
                onChange={contentActions.onImageAlignChange}
              >
                <Form.Option value='NONE'>설정안함</Form.Option>
                <Form.Option value='LEFT'>왼쪽</Form.Option>
                <Form.Option value='RIGHT'>오른쪽</Form.Option>
                <Form.Option value='BACKGROUND'>백그라운드</Form.Option>
              </Form.Select>
            </Layout.Box>

            <Layout.Box mb='20px'>
              <S.ContentAddButton onClick={openContentKeyValueDialogForAdd}>
                컨텐츠 추가
              </S.ContentAddButton>
              {toKeyValueArray(content.data).map((datum, index) => (
                <S.ContentImageItem key={index}>
                  <div className='name'>{datum.key}</div>
                  <div className='duration'>{datum.value}</div>

                  <button className='edit' onClick={() => openContentKeyValueDialogForEdit(index)}>
                    수정
                  </button>
                  <button
                    className='delete'
                    onClick={() => contentActions.removeContentData(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} size='2x' />
                  </button>
                </S.ContentImageItem>
              ))}
            </Layout.Box>
          </Layout.Box>
        </S.Content>
        <Modal.Actions>
          {mode === 'EDIT' ? ( //
            <Modal.SaveButton
              disabled={isButtonDisabled}
              onClick={() => mutateEditContent.mutate()}
            >
              수정
            </Modal.SaveButton>
          ) : null}
          {mode === 'ADD' ? ( //
            <Modal.SaveButton
              disabled={isButtonDisabled}
              onClick={() => mutateCreateContent.mutate()}
            >
              생성
            </Modal.SaveButton>
          ) : null}
          <Modal.CloseButton onClick={closeSelf}>닫기</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}

type ContentKeyValueDialogProps = {
  defaultData?: { key: string; value: string };
  onSave: (data: { key: string; value: string }) => void;
} & ModalProps;

function ContentKeyValueDialog(props: ContentKeyValueDialogProps) {
  const { defaultData, onSave, closeSelf } = props;

  const [key, setKey] = useState(defaultData?.key || '');
  const [value, setValue] = useState(defaultData?.value || '');

  const onSaveClick = () => {
    onSave({ key, value });
    closeSelf();
  };

  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body>
        <Modal.Title>컨텐츠</Modal.Title>
        <Modal.Content>
          <Layout.Box mb='20px'>
            <Form.Label htmlFor='key'>이름</Form.Label>
            <Form.Input id='key' defaultValue={key} onChange={(e) => setKey(e.target.value)} />
          </Layout.Box>
          <Layout.Box mb='20px'>
            <Form.Label htmlFor='value'>내용</Form.Label>
            <Form.Input
              id='value'
              defaultValue={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Layout.Box>
        </Modal.Content>
        <Modal.Actions>
          <Modal.SaveButton onClick={onSaveClick}>저장</Modal.SaveButton>
          <Modal.CloseButton onClick={closeSelf}>닫기</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
