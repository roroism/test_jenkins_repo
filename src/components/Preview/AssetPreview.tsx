import { useTranslation } from '@app/src/hooks/useTranslation';
import { Asset, putAsset, uploadAssetMood, uploadAssetStyle } from '@app/src/apis/assets';
import * as Modal from '@app/src/components/Modal.style';
import { config } from '@app/src/config';
import { useTypeSafeReducer } from '@app/src/hooks/useTypeSafeReducer';
import { ModalProps } from '@app/src/store/model';
import { selectToken, selectUserDataByKey } from '@app/src/store/slices/authSlice';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as Layout from '@app/src/components/Layout.style';
import * as Form from '@app/src/components/Form.style';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { SelectChangeEvent } from '@mui/material';
import { css } from '@emotion/react';
import * as S from './AssetPreview.style';
import dayjs from 'dayjs';

type AssetPreviewProps = ModalProps & {
  asset: Asset;
  closeAnimation?: boolean;
};

const VALID_USER_RIGHT = ['ADMIN', 'SUPER_ADMIN'];

const moodArray = [
  '신나는',
  '즐거운',
  '슬픈',
  '잔잔한',
  '설레는',
  '고요한',
  '밝은',
  '깔끔한',
  '모던한',
  '귀여운',
  '어두운',
  '선명한',
  '연한',
  '부드러운',
  '차분한',
  '진한',
  '평화로운',
  '지루한',
  '우울한',
  '역동적인',
  '답답한',
  '축제',
  '로맨틱',
  '열정적인',
  '시끄러운',
  '혼돈스러운',
  '무서운',
  '위급한',
  '단조로운',
  '고독한',
  '공허한',
  '낙관적',
  '비관적',
  '당황한',
  '따뜻한',
  '차가운',
];
const styleArray = [
  '3D',
  '2D',
  '스케치',
  '파스텔',
  '사진',
  '동양화',
  '서양화',
  '네온',
  '고딕',
  '미래',
  '판타지',
  '클로즈업',
  '항공샷',
  '흑백',
  '영화',
  '드로잉',
  '어린아이그림',
  '스티커',
  '일러스트',
  '포스터',
  '캐릭터',
  '싸이버펑크',
];

export function AssetPreview(props: AssetPreviewProps) {
  const { closeSelf, asset, closeAnimation = true } = props;
  const { t } = useTranslation();
  const modalBodyRef = useRef(null);
  const modalBackgroundRef = useRef(null);
  const authToken = useSelector(selectToken());
  const extension = asset.name.split('.').pop();
  const queryClient = useQueryClient();
  const userRight = useSelector(selectUserDataByKey('userRight'));
  const [type, setType] = useState<string>('');

  const [newAsset, assetActions] = useTypeSafeReducer(asset, {
    onNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name = e.target.value;
    },
    onDescChange: (state, e: React.ChangeEvent<HTMLTextAreaElement>) => {
      state.desc = e.target.value;
    },
    onIsSystemChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.isSystem = e.target.value === 'true';
    },
    onIsPrivateChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.isPrivate = e.target.value === 'true';
    },
  });
  const onSaveClick = async () => {
    if (newAsset.isSystem !== asset.isSystem) {
      await putAsset(asset.id, { isSystem: newAsset.isSystem });
    }
    if (newAsset.isPrivate !== asset.isPrivate) {
      await putAsset(asset.id, { isPrivate: newAsset.isPrivate });
    }

    if ((mood !== asset.id, mood)) {
      await uploadAssetMood(asset.id, mood);
    }

    if ((style !== asset.id, style)) {
      await uploadAssetStyle(asset.id, style);
    }

    // if ((tag !== asset.id, tag)) {
    //   await uploadAssetTag(asset.id, tag);
    // }

    // if ((pricee !== presentation.id, pricee)) {
    //   await uploadPresentationPrice(presentation.id, pricee);
    // }
    await putAsset(asset.id, {
      name: newAsset.name,
      desc: newAsset.desc,
      //price: String(newPresentation.price),
    }),
      // await uploadAssetStyle(asset.id, style);
      // await uploadAssetMood(asset.id, mood);
      // await putAsset(asset.id, {
      //   name: newAsset.name,
      //   desc: newAsset.desc,
      // });
      await queryClient.invalidateQueries(['assets']);

    closeSelf();
  };

  const changeMood = (e) => {
    setMood(e.target.value);
  };
  const changeStyle = (e) => {
    setStyle(e.target.value);
  };
  const changeTag = (e) => {
    const newTag = e.target.value.split(',');
    setTag(newTag);
    setTag(e.target.value);
  };

  const [mood, setMood] = useState<string>(newAsset?.moods?.[0]?.moodName);
  const [style, setStyle] = useState<string>(newAsset?.styles?.[0]?.styleName);
  const [tag, setTag] = useState<''>('');
  const originalImage = useQuery({
    queryKey: ['assets', asset.id, 'data'],
    queryFn: async () => {
      const uri = config.EXTERNAL.CUBLICK.ASSET.ORIGINAL(asset.id, authToken);
      const res = await axios.get<Blob>(uri, { responseType: 'blob' });
      return res.data;
    },
    select: (data) => URL.createObjectURL(data),
    enabled: asset.mimeType === 'IMAGE',
  });
  console.log('aaaaaaaaaaa', originalImage);
  useEffect(() => {
    return () => URL.revokeObjectURL(originalImage.data);
  }, []);

  const isNameExtensionValid = newAsset.name.includes('.' + extension);
  const isNameLengthValid = newAsset.name.length > extension.length + 1;
  const isButtonDisabled = !isNameExtensionValid || !isNameLengthValid;

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
  };

  // closeSelf 없애고 수정 누르면 저장하고 닫히게 <Modal.Container onClick={closeSelf}>
  if (asset.mimeType === 'IMAGE') {
    return (
      <Modal.Container>
        <Modal.Background ref={modalBackgroundRef} onClick={onClose} />
        <Modal.Body
          ref={modalBodyRef}
          css={css`
            width: 70vw;
          `}
        >
          <Modal.Title>상세보기</Modal.Title>
          <Modal.Content>
            <Layout.Box display='flex' flexWrap='wrap' alignContent='stretch' gap='16px'>
              <Layout.Box flex='3.2'>
                <Layout.Box width='100%' height='100%' borderRadius='8px' overflow='hidden'>
                  <S.PreviewBox>
                    {originalImage.isLoading ? (
                      <S.FaLoading icon={faSpinnerThird} color='#3e70d6' />
                    ) : (
                      <S.OriginalImage src={originalImage?.data} alt={asset.name} />
                    )}
                  </S.PreviewBox>
                </Layout.Box>
              </Layout.Box>
              <Layout.Box flex='0 0 289px'>
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='name'>이름</Form.Label>
                  {!isNameExtensionValid || asset.name.endsWith('.png') ? (
                    <Form.ErrMsg>확장자는 변경할 수 없습니다.</Form.ErrMsg>
                  ) : null}
                  {!isNameLengthValid ? (
                    <Form.ErrMsg>에셋의 이름이 너무 짧습니다.</Form.ErrMsg>
                  ) : null}
                  <Form.Input
                    id='name'
                    defaultValue={newAsset?.name}
                    onChange={assetActions.onNameChange}
                  />
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='description'>설명</Form.Label>
                  <Form.TextArea
                    id='description'
                    defaultValue={newAsset?.desc}
                    onChange={assetActions.onDescChange}
                    placeholder='태그는 #을 사용해주세요'
                  />
                </Layout.Box>
                {/* <Layout.Box>
                <Form.Label onClick={() => setType('')}>태그</Form.Label>
                {type === 'tag' ? (
                  <Form.TextArea onChange={(e) => changeTag(e)} />
                ) : (
                  <Form.TextArea
                    value={tag}
                    onClick={() => setType('tag')}
                    onBlur={() => setType('')}
                  />
                )}
              </Layout.Box> */}
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='WidthxHeight'>화면 비율</Form.Label>
                  <Form.Input
                    id='WidthxHeight'
                    as='div'
                  >{`${newAsset?.width} x ${newAsset?.height}`}</Form.Input>
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='owner'>소유자</Form.Label>
                  <Form.Input id='owner' as='div'>
                    {newAsset?.owner?.displayName}
                  </Form.Input>
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='createdDate'>생성일자</Form.Label>
                  <Form.Input id='createdDate' as='div'>
                    {dayjs(newAsset?.createdDate).format('YYYY-MM-DD HH:mm')}
                  </Form.Input>
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label>분위기</Form.Label>
                  <Form.Select value={mood} onChange={(e: SelectChangeEvent) => changeMood(e)}>
                    {moodArray.map((mood) => {
                      return <Form.Option value={mood}>{mood}</Form.Option>;
                    })}
                  </Form.Select>
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label>스타일</Form.Label>
                  <Form.Select value={style} onChange={(e: SelectChangeEvent) => changeStyle(e)}>
                    {styleArray.map((style) => {
                      return <Form.Option value={style}>{style}</Form.Option>;
                    })}
                  </Form.Select>
                </Layout.Box>
                {VALID_USER_RIGHT.includes(userRight) ? (
                  <Layout.Box mb='8px'>
                    <Form.Label htmlFor='isSystem'>isSystem</Form.Label>
                    <Form.Select
                      id='isSystem'
                      value={String(newAsset?.isSystem)}
                      onChange={assetActions.onIsSystemChange}
                    >
                      <Form.Option value='true'>true</Form.Option>
                      <Form.Option value='false'>false</Form.Option>
                    </Form.Select>
                  </Layout.Box>
                ) : null}
                {VALID_USER_RIGHT.includes(userRight) ? (
                  <Layout.Box mb='8px'>
                    <Form.Label htmlFor='isPrivate'>isPrivate</Form.Label>
                    <Form.Select
                      id='isPrivate'
                      value={String(newAsset?.isPrivate)}
                      onChange={assetActions.onIsPrivateChange}
                    >
                      <Form.Option value='true'>true</Form.Option>
                      <Form.Option value='false'>false</Form.Option>
                    </Form.Select>
                  </Layout.Box>
                ) : null}
              </Layout.Box>
            </Layout.Box>
          </Modal.Content>
          <Modal.Actions>
            <Modal.SaveButton disabled={isButtonDisabled} onClick={onSaveClick}>
              수정
            </Modal.SaveButton>
            <Modal.CloseButton onClick={onClose}>닫기</Modal.CloseButton>
          </Modal.Actions>
        </Modal.Body>
      </Modal.Container>
    );
  }

  if (asset.mimeType === 'VIDEO') {
    return (
      <Modal.Container>
        <Modal.Background ref={modalBackgroundRef} onClick={onClose} />
        <Modal.Body
          ref={modalBodyRef}
          css={css`
            width: 70vw;
          `}
        >
          <Modal.Title>상세보기</Modal.Title>
          <Modal.Content>
            <Layout.Box display='flex' flexWrap='wrap' alignContent='stretch' gap='16px'>
              <Layout.Box flex='3.2'>
                <Layout.Box width='100%' height='100%' borderRadius='8px' overflow='hidden'>
                  <S.PreviewBox>
                    <video
                      controls
                      src={config.EXTERNAL.CUBLICK.ASSET.ORIGINAL(asset.id, authToken)}
                    />
                  </S.PreviewBox>
                </Layout.Box>
              </Layout.Box>
              <Layout.Box flex='0 0 289px'>
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='name'>이름</Form.Label>
                  {!isNameExtensionValid || asset.name.endsWith('.png') ? (
                    <Form.ErrMsg>확장자는 변경할 수 없습니다.</Form.ErrMsg>
                  ) : null}
                  {!isNameLengthValid ? (
                    <Form.ErrMsg>에셋의 이름이 너무 짧습니다.</Form.ErrMsg>
                  ) : null}
                  <Form.Input
                    id='name'
                    defaultValue={newAsset?.name}
                    onChange={assetActions.onNameChange}
                  />
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='description'>설명</Form.Label>
                  <Form.TextArea
                    id='description'
                    defaultValue={newAsset?.desc}
                    onChange={assetActions.onDescChange}
                    placeholder='태그는 #을 사용해주세요'
                  />
                </Layout.Box>
                {/* <Layout.Box>
                  <Form.Label onClick={() => setType('')}>태그</Form.Label>
                  {type === 'tag' ? (
                    <Form.TextArea onChange={(e) => changeTag(e)} />
                  ) : (
                    <Form.TextArea
                      value={tag}
                      onClick={() => setType('tag')}
                      onBlur={() => setType('')}
                    />
                  )}
                </Layout.Box> */}
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='WidthxHeight'>화면 비율</Form.Label>
                  <Form.Input
                    id='WidthxHeight'
                    as='div'
                  >{`${newAsset?.width} x ${newAsset?.height}`}</Form.Input>
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='owner'>소유자</Form.Label>
                  <Form.Input id='owner' as='div'>
                    {newAsset?.owner?.displayName}
                  </Form.Input>
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='createdDate'>생성일자</Form.Label>
                  <Form.Input id='createdDate' as='div'>
                    {dayjs(newAsset?.createdDate).format('YYYY-MM-DD HH:mm')}
                  </Form.Input>
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label>분위기</Form.Label>
                  <Form.Select value={mood} onChange={(e: SelectChangeEvent) => changeMood(e)}>
                    {moodArray.map((mood) => {
                      return <Form.Option value={mood}>{mood}</Form.Option>;
                    })}
                  </Form.Select>
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label>스타일</Form.Label>
                  <Form.Select value={style} onChange={(e: SelectChangeEvent) => changeStyle(e)}>
                    {styleArray.map((style) => {
                      return <Form.Option value={style}>{style}</Form.Option>;
                    })}
                  </Form.Select>
                </Layout.Box>
                {VALID_USER_RIGHT.includes(userRight) ? (
                  <Layout.Box mb='8px'>
                    <Form.Label htmlFor='isSystem'>isSystem</Form.Label>
                    <Form.Select
                      id='isSystem'
                      value={String(newAsset?.isSystem)}
                      onChange={assetActions.onIsSystemChange}
                    >
                      <Form.Option value='true'>true</Form.Option>
                      <Form.Option value='false'>false</Form.Option>
                    </Form.Select>
                  </Layout.Box>
                ) : null}
                {VALID_USER_RIGHT.includes(userRight) ? (
                  <Layout.Box mb='8px'>
                    <Form.Label htmlFor='isPrivate'>isPrivate</Form.Label>
                    <Form.Select
                      id='isPrivate'
                      value={String(newAsset?.isPrivate)}
                      onChange={assetActions.onIsPrivateChange}
                    >
                      <Form.Option value='true'>true</Form.Option>
                      <Form.Option value='false'>false</Form.Option>
                    </Form.Select>
                  </Layout.Box>
                ) : null}
              </Layout.Box>
            </Layout.Box>
          </Modal.Content>
          <Modal.Actions>
            <Modal.SaveButton disabled={isButtonDisabled} onClick={onSaveClick}>
              수정
            </Modal.SaveButton>
            <Modal.CloseButton onClick={onClose}>닫기</Modal.CloseButton>
          </Modal.Actions>
        </Modal.Body>
      </Modal.Container>
    );
  }

  if (asset.mimeType === 'AUDIO') {
    return (
      <Modal.Container>
        <Modal.Background ref={modalBackgroundRef} onClick={onClose} />
        <Modal.Body
          ref={modalBodyRef}
          css={css`
            width: 70vw;
            /* max-width: 1039px; */
            /* height: 60vh; */
          `}
        >
          <Modal.Title>상세보기</Modal.Title>
          <Modal.Content>
            <Layout.Box display='flex' flexWrap='wrap' alignContent='stretch' gap='16px'>
              <Layout.Box flex='3.2'>
                <Layout.Box width='100%' height='100%' borderRadius='8px' overflow='hidden'>
                  <S.PreviewBox>
                    <audio
                      controls
                      src={config.EXTERNAL.CUBLICK.ASSET.ORIGINAL(asset.id, authToken)}
                    />
                  </S.PreviewBox>
                </Layout.Box>
              </Layout.Box>
              <Layout.Box flex='0 0 289px'>
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='name'>이름</Form.Label>
                  {!isNameExtensionValid || asset.name.endsWith('.png') ? (
                    <Form.ErrMsg>확장자는 변경할 수 없습니다.</Form.ErrMsg>
                  ) : null}
                  {!isNameLengthValid ? (
                    <Form.ErrMsg>에셋의 이름이 너무 짧습니다.</Form.ErrMsg>
                  ) : null}
                  <Form.Input
                    id='name'
                    defaultValue={newAsset?.name}
                    onChange={assetActions.onNameChange}
                  />
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='description'>설명</Form.Label>
                  <Form.TextArea
                    id='description'
                    defaultValue={newAsset?.desc}
                    onChange={assetActions.onDescChange}
                    placeholder='태그는 #을 사용해주세요'
                  />
                </Layout.Box>
                {/* <Layout.Box>
                  <Form.Label onClick={() => setType('')}>태그</Form.Label>
                  {type === 'tag' ? (
                    <Form.TextArea onChange={(e) => changeTag(e)} />
                  ) : (
                    <Form.TextArea
                      value={tag}
                      onClick={() => setType('tag')}
                      onBlur={() => setType('')}
                    />
                  )}
                </Layout.Box> */}
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='WidthxHeight'>화면 비율</Form.Label>
                  <Form.Input
                    id='WidthxHeight'
                    as='div'
                  >{`${newAsset?.width} x ${newAsset?.height}`}</Form.Input>
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='owner'>소유자</Form.Label>
                  <Form.Input id='owner' as='div'>
                    {newAsset?.owner?.displayName}
                  </Form.Input>
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label htmlFor='createdDate'>생성일자</Form.Label>
                  <Form.Input id='createdDate' as='div'>
                    {dayjs(newAsset?.createdDate).format('YYYY-MM-DD HH:mm')}
                  </Form.Input>
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label>분위기</Form.Label>
                  <Form.Select value={mood} onChange={(e: SelectChangeEvent) => changeMood(e)}>
                    {moodArray.map((mood) => {
                      return <Form.Option value={mood}>{mood}</Form.Option>;
                    })}
                  </Form.Select>
                </Layout.Box>
                <Layout.Box mb='8px'>
                  <Form.Label>스타일</Form.Label>
                  <Form.Select value={style} onChange={(e: SelectChangeEvent) => changeStyle(e)}>
                    {styleArray.map((style) => {
                      return <Form.Option value={style}>{style}</Form.Option>;
                    })}
                  </Form.Select>
                </Layout.Box>
                {VALID_USER_RIGHT.includes(userRight) ? (
                  <Layout.Box mb='8px'>
                    <Form.Label htmlFor='isSystem'>isSystem</Form.Label>
                    <Form.Select
                      id='isSystem'
                      value={String(newAsset?.isSystem)}
                      onChange={assetActions.onIsSystemChange}
                    >
                      <Form.Option value='true'>true</Form.Option>
                      <Form.Option value='false'>false</Form.Option>
                    </Form.Select>
                  </Layout.Box>
                ) : null}
                {VALID_USER_RIGHT.includes(userRight) ? (
                  <Layout.Box mb='8px'>
                    <Form.Label htmlFor='isPrivate'>isPrivate</Form.Label>
                    <Form.Select
                      id='isPrivate'
                      value={String(newAsset?.isPrivate)}
                      onChange={assetActions.onIsPrivateChange}
                    >
                      <Form.Option value='true'>true</Form.Option>
                      <Form.Option value='false'>false</Form.Option>
                    </Form.Select>
                  </Layout.Box>
                ) : null}
              </Layout.Box>
            </Layout.Box>
          </Modal.Content>
          <Modal.Actions>
            <Modal.SaveButton disabled={isButtonDisabled} onClick={onSaveClick}>
              수정
            </Modal.SaveButton>
            <Modal.CloseButton onClick={onClose}>닫기</Modal.CloseButton>
          </Modal.Actions>
        </Modal.Body>
      </Modal.Container>
    );
  }
  // return (
  //   <Modal.Container onClick={closeSelf}>
  //     <Modal.Background />
  //     <Body width='auto'>
  //       <OriginalImage src={originalImage.data} alt={asset.name} />
  //     </Body>
  //   </Modal.Container>
  // );
}
