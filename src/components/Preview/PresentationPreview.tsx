import { useTranslation } from '@app/src/hooks/useTranslation';
import {
  getPresentation,
  putPresentation,
  uploadPresentationMood,
  uploadPresentationStyle,
} from '@app/src/apis/presentation/presentationApi';
import { Alert } from '@app/src/components/Alert';
import { spin } from '@app/src/components/Global.style';
import * as Modal from '@app/src/components/Modal.style';
import { config } from '@app/src/config';
import { useModal } from '@app/src/hooks/useModal';
import { ModalProps } from '@app/src/store/model';
import { selectToken, selectUserDataByKey } from '@app/src/store/slices/authSlice';
import { CublickParser } from '@cublick/parser';
import { CublickRenderer } from '@cublick/renderer';
import styled from '@emotion/styled';
import * as Layout from '@app/src/components/Layout.style';
import * as Form from '@app/src/components/Form.style';
import { faSpinnerThird } from '@fortawesome/pro-solid-svg-icons';
import { RawPresentation } from '@cublick/parser/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { SelectChangeEvent } from '@mui/material';
import { PresentationAPIResponse } from '@app/src/apis/presentation';
import { useTypeSafeReducer } from '@app/src/hooks/useTypeSafeReducer';
import { css } from '@emotion/react';
import * as S from './PresentationPreview.style';
import dayjs from 'dayjs';

export const FaLoading = styled(FontAwesomeIcon)`
  animation: ${spin} 1s linear infinite;
`;

type PresentationPreviewProps = ModalProps & { closeAnimation?: boolean } & {
  presentation?: PresentationAPIResponse;
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

export function PresentationPreview(props: PresentationPreviewProps) {
  const { closeSelf, presentation, closeAnimation = true } = props;
  const { t } = useTranslation();
  const modalBodyRef = useRef(null);
  const modalBackgroundRef = useRef(null);
  const userRight = useSelector(selectUserDataByKey('userRight'));
  const queryClient = useQueryClient();
  const modalCtrl = useModal();

  const [newPresentation, presentationActions] = useTypeSafeReducer(presentation, {
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
  const [editType, setEditType] = useState('');
  // const [tag, setTag] = useState(newPresentation.taggedTags);
  const [style, setStyle] = useState<String>(newPresentation?.styles?.[0]?.styleName);
  const [mood, setMood] = useState<String>(newPresentation?.moods?.[0]?.moodName);
  const [pricee, setPrice] = useState(newPresentation?.price);
  const authToken = useSelector(selectToken());
  const displayerMain = useRef<HTMLDivElement>(null);

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    // newPresentation.pricee = price;
  };
  /**
   * 프레젠테이션을 랜더링하는 함수, Ref를 통해 랜더링할 div를 찾아 랜더링한다.
   *
   * @author 오지민 2023.03.05
   * @param rawPresentation 랜더링할 프레젠테이션의 정보
   */
  const renderPresentation = (rawPresentation: RawPresentation) => {
    const mainRender = new CublickRenderer(displayerMain.current);
    const parser = new CublickParser({
      apis: {
        asset: `${config.EXTERNAL.CUBLICK.ASSET.AST}/{id}/data`,
        assetThumbnail: `${config.EXTERNAL.CUBLICK.ASSET.AST}/{id}/thumbnail`,
      },
      apiToken: authToken,
    });
    console.log('displayMain: ', displayerMain);
    console.log('mainRender: ', mainRender);
    console.log('rawPresentation: ', rawPresentation);
    mainRender.renderPresentation(parser.parse(rawPresentation), {
      contentDataInputType: 'PARSED',
    });
  };

  /**
   * props에 presentationId가 존재하면, Cloud Presentation을 불러와 프리뷰에 랜더링한다.
   * @author 오지민 2023.03.05
   */

  console.log('presentation_id:', presentation._id);

  useQuery({
    queryKey: ['presentations', presentation._id, 'design'],
    queryFn: () => getPresentation(presentation._id),
    enabled: !!presentation._id,
    onSuccess: (res) => renderPresentation(res),
    onError: () => {
      modalCtrl.open(<Alert text='프레젠테이션 디자인을 로드하는데 실패하였습니다.' />);
      closeSelf();
    },
  });

  useEffect(() => {
    if (!!presentation._id) return;
  }, []);

  // const settingTag = (e) => {
  //   const newTag = [];
  //   const tagArray = e.target.value.split(',');
  //   tagArray.map((tag) => {
  //     newTag.push({ tagId: '', tagName: tag });
  //   });
  //   setTag(newTag);
  // };

  const onSaveClick = async () => {
    if (newPresentation.isSystem !== presentation.isSystem) {
      await putPresentation(presentation.id, { isSystem: newPresentation.isSystem });
    }
    if (newPresentation.isPrivate !== presentation.isPrivate) {
      await putPresentation(presentation.id, { isPrivate: newPresentation.isPrivate });
    }

    // 서버 로직 완성 후 재작업
    // await uploadPresentationMood(presentation.id, mood),
    //   await uploadPresentationStyle(presentation.id, style),
    //await uploadPresentationPrice(presentation.id, pricee);

    if ((mood !== presentation.id, mood)) {
      await uploadPresentationMood(presentation.id, mood);
    }

    if ((style !== presentation.id, style)) {
      await uploadPresentationStyle(presentation.id, style);
    }

    // if (tag[0]?.tagName !== presentation.id) {
    //   console.log('태그', tag[0]);
    //   console.log('타입', typeof tag[0]);
    //   await uploadPresentationTag(presentation.id, tag[0]);
    // }

    // if ((pricee !== presentation.id, pricee)) {
    //   await uploadPresentationPrice(presentation.id, pricee);
    // }
    await putPresentation(presentation.id, {
      name: newPresentation.name,
      desc: newPresentation.desc,
      //price: String(newPresentation.price),
    }),
      await queryClient.invalidateQueries(['presentations']);
    closeSelf();
  };

  const isNameLengthValid = newPresentation.name.length > 0;
  const isButtonDisabled = !isNameLengthValid;

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
                <S.PreviewBox ref={displayerMain}>
                  <FaLoading icon={faSpinnerThird} color='#0e121a' />
                </S.PreviewBox>
              </Layout.Box>
            </Layout.Box>
            <Layout.Box flex='0 0 289px'>
              <Layout.Box mb='8px'>
                <Form.Label htmlFor='name'>이름</Form.Label>
                {!isNameLengthValid ? (
                  <Form.ErrMsg>프레젠테이션의 이름이 너무 짧습니다.</Form.ErrMsg>
                ) : null}
                <Form.Input
                  id='name'
                  defaultValue={newPresentation?.name}
                  //onChange={(e) => presentationActions.onNameChange(e)}
                  onChange={presentationActions.onNameChange}
                />
              </Layout.Box>
              <Layout.Box mb='8px'>
                <Form.Label htmlFor='description'>설명</Form.Label>
                <Form.TextArea
                  id='description'
                  defaultValue={newPresentation?.desc}
                  onChange={presentationActions.onDescChange}
                  placeholder='태그는 #을 사용해주세요'
                />
              </Layout.Box>
              <Layout.Box mb='8px'>
                <Form.Label htmlFor='WidthxHeight'>화면 비율</Form.Label>
                <Form.Input
                  id='WidthxHeight'
                  as='div'
                >{`${newPresentation?.width} x ${newPresentation?.height}`}</Form.Input>
              </Layout.Box>
              <Layout.Box mb='8px'>
                <Form.Label htmlFor='owner'>소유자</Form.Label>
                <Form.Input id='owner' as='div'>
                  {newPresentation?.owner?.displayName}
                </Form.Input>
              </Layout.Box>
              <Layout.Box mb='8px'>
                <Form.Label htmlFor='createdDate'>생성일자</Form.Label>
                <Form.Input id='createdDate' as='div'>
                  {dayjs(newPresentation?.createdDate).format('YYYY-MM-DD HH:mm')}
                </Form.Input>
              </Layout.Box>

              {/* <Layout.Box>
            <Form.TextArea onChange={(e) => settingTag(e)} placeholder='Tag'></Form.TextArea>
            <Form.WrapDiv></Form.WrapDiv>
            </Layout.Box> */}
              <Layout.Box mb='8px'>
                <Form.Label>분위기</Form.Label>
                <Form.Select
                  value={mood}
                  onChange={(e: SelectChangeEvent) => setMood(e.target.value)}
                >
                  {moodArray.map((mood) => {
                    return <Form.Option value={mood}>{mood}</Form.Option>;
                  })}
                </Form.Select>
              </Layout.Box>
              <Layout.Box mb='8px'>
                <Form.Label>스타일</Form.Label>
                <Form.Select
                  value={style}
                  onChange={(e: SelectChangeEvent) => setStyle(e.target.value)}
                  onBlur={() => setEditType('')}
                >
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
                    value={String(newPresentation?.isSystem)}
                    onChange={presentationActions.onIsSystemChange}
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
                    value={String(newPresentation?.isPrivate)}
                    onChange={presentationActions.onIsPrivateChange}
                  >
                    <Form.Option value='true'>true</Form.Option>
                    <Form.Option value='false'>false</Form.Option>
                  </Form.Select>
                </Layout.Box>
              ) : null}

              {/* <Layout.Box>
              <Form.Label>가격</Form.Label>
              {!inputPrice || isNaN(inputPrice) ? (
                <Form.ErrMsg>가격을 숫자로 입력해주세요.</Form.ErrMsg>
              ) : null}
              <Form.Input value={pricee} onChange={handlePriceChange} />
              </Layout.Box> */}
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
