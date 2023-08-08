import {
  PresentationAPIResponse,
  putPresentation,
  putPresentationInfo,
  uploadPresentationMood,
  uploadPresentationPrice,
  uploadPresentationStyle,
  uploadPresentationTag,
} from '@app/src/apis/presentation';
import { ModalProps } from '@app/src/store/model';
import React, { useState, useEffect } from 'react';
import * as Modal from '@app/src/components/Modal.style';
import * as Layout from '@app/src/components/Layout.style';
import * as Form from '@app/src/components/Form.style';
import { useTypeSafeReducer } from '@app/src/hooks/useTypeSafeReducer';
import { useSelector } from 'react-redux';
import { selectUserDataByKey } from '@app/src/store/slices/authSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { SelectChangeEvent } from '@mui/material';
import { cloneDeep } from '@app/src/utils';

type Props = ModalProps & { presentation: PresentationAPIResponse };

const VALID_USER_RIGHT = ['ADMIN', 'SUPER_ADMIN'];

export function PresentationDialog(props: Props) {
  const { closeSelf, presentation } = props;
  const { t } = useTranslation();

  const userRight = useSelector(selectUserDataByKey('userRight'));
  const queryClient = useQueryClient();

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
  const [tag, setTag] = useState(newPresentation.taggedTags);
  const [style, setStyle] = useState<String>(newPresentation?.styles?.[0]?.styleName);
  const [mood, setMood] = useState<String>(newPresentation?.moods?.[0]?.moodName);
  const [pricee, setPrice] = useState(newPresentation?.price);

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    // newPresentation.pricee = price;
  };

  const onSaveClick = async () => {
    console.log('aaaaaaaaaa', tag);
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

  useEffect(() => {
    console.log(newPresentation);
  }, [newPresentation]);

  const settingTag = (e) => {
    const newTag = [];
    const tagArray = e.target.value.split(',');
    tagArray.map((tag) => {
      newTag.push({ tagId: '', tagName: tag });
    });
    setTag(newTag);
  };

  const isNameLengthValid = newPresentation.name.length > 0;
  const isButtonDisabled = !isNameLengthValid;

  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body width='300px'>
        <Modal.Title>정보변경</Modal.Title>
        <Modal.Content>
          <Layout.Box>
            <Form.Label htmlFor='name'>이름</Form.Label>
            {!isNameLengthValid ? (
              <Form.ErrMsg>프레젠테이션의 이름이 너무 짧습니다.</Form.ErrMsg>
            ) : null}
            <Form.Input
              id='name'
              defaultValue={newPresentation.name}
              //onChange={(e) => presentationActions.onNameChange(e)}
              onChange={presentationActions.onNameChange}
            />
          </Layout.Box>
          <Layout.Box>
            <Form.Label htmlFor='description' placeholder='태그는 #을 사용해주세요'>
              설명
            </Form.Label>
            <Form.TextArea
              id='description'
              defaultValue={newPresentation.desc}
              onChange={presentationActions.onDescChange}
            />
          </Layout.Box>
          {VALID_USER_RIGHT.includes(userRight) ? (
            <Layout.Box>
              <Form.Label htmlFor='isSystem'>isSystem</Form.Label>
              <Form.Select
                id='isSystem'
                value={String(newPresentation.isSystem)}
                onChange={presentationActions.onIsSystemChange}
              >
                <Form.Option value='true'>true</Form.Option>
                <Form.Option value='false'>false</Form.Option>
              </Form.Select>
            </Layout.Box>
          ) : null}
          {VALID_USER_RIGHT.includes(userRight) ? (
            <Layout.Box>
              <Form.Label htmlFor='isPrivate'>isPrivate</Form.Label>
              <Form.Select
                id='isPrivate'
                value={String(newPresentation.isPrivate)}
                onChange={presentationActions.onIsPrivateChange}
              >
                <Form.Option value='true'>true</Form.Option>
                <Form.Option value='false'>false</Form.Option>
              </Form.Select>
            </Layout.Box>
          ) : null}
          {/* <Layout.Box>
            <Form.TextArea onChange={(e) => settingTag(e)} placeholder='Tag'></Form.TextArea>
            <Form.WrapDiv></Form.WrapDiv>
          </Layout.Box> */}
          <Layout.Box>
            <Form.Label>분위기</Form.Label>
            <Form.Select value={mood} onChange={(e: SelectChangeEvent) => setMood(e.target.value)}>
              <Form.Option value='신나는'>신나는</Form.Option>
              <Form.Option value='즐거운'>즐거운</Form.Option>
              <Form.Option value='슬픈'>슬픈</Form.Option>
              <Form.Option value='잔잔한'>잔잔한</Form.Option>
              <Form.Option value='설레는'>설레는</Form.Option>
              <Form.Option value='고요한'>고요한</Form.Option>
              <Form.Option value='밝은'>밝은</Form.Option>
              <Form.Option value='깔끔한'>깔끔한</Form.Option>
              <Form.Option value='모던한'>모던한</Form.Option>
              <Form.Option value='귀여운'>귀여운</Form.Option>
              <Form.Option value='어두운'>어두운</Form.Option>
              <Form.Option value='선명한'>선명한</Form.Option>
              <Form.Option value='연한'> 연한</Form.Option>
              <Form.Option value='부드러운'>부드러운</Form.Option>
              <Form.Option value='차분한'>차분한</Form.Option>
              <Form.Option value='진한'>진한</Form.Option>
              <Form.Option value='평화로운'>평화로운</Form.Option>
              <Form.Option value='지루한'>지루한</Form.Option>
              <Form.Option value='우울한'>우울한</Form.Option>
              <Form.Option value='역동적인'>역동적인</Form.Option>
              <Form.Option value='답답한'>답답한</Form.Option>
              <Form.Option value='축제'>축제</Form.Option>
              <Form.Option value='로맨틱'>로맨틱</Form.Option>
              <Form.Option value='열정적인'>열정적인</Form.Option>
              <Form.Option value='시끄러운'>시끄러운</Form.Option>
              <Form.Option value='혼돈스러운'>혼돈스러운</Form.Option>
              <Form.Option value='무서운'>무서운</Form.Option>
              <Form.Option value='위급한'>위급한</Form.Option>
              <Form.Option value='단조로운'>단조로운</Form.Option>
              <Form.Option value='고독한'>고독한</Form.Option>
              <Form.Option value='공허한'>공허한</Form.Option>
              <Form.Option value='낙관적'>낙관적</Form.Option>
              <Form.Option value='비관적'>비관적,</Form.Option>
              <Form.Option value='당황한'>당황한</Form.Option>
              <Form.Option value='따뜻한'>따뜻한</Form.Option>
              <Form.Option value='차가운'>차가운</Form.Option>
            </Form.Select>
          </Layout.Box>
          <Layout.Box>
            <Form.Label>스타일</Form.Label>
            <Form.Select
              value={style}
              onChange={(e: SelectChangeEvent) => setStyle(e.target.value)}
              onBlur={() => setEditType('')}
            >
              <Form.Option value='3D'>3D</Form.Option>
              <Form.Option value='2D'>2D</Form.Option>
              <Form.Option value='스케치'>스케치</Form.Option>
              <Form.Option value='파스텔'>파스텔</Form.Option>
              <Form.Option value='사진'>사진</Form.Option>
              <Form.Option value='동양화'>동양화</Form.Option>
              <Form.Option value='서양화'>서양화</Form.Option>
              <Form.Option value='네온'>네온</Form.Option>
              <Form.Option value='고딕'>고딕</Form.Option>
              <Form.Option value='미래'>미래</Form.Option>
              <Form.Option value='판타지'>판타지</Form.Option>
              <Form.Option value='클로즈업'>클로즈업</Form.Option>
              <Form.Option value='항공샷'>항공샷</Form.Option>
              <Form.Option value='흑백'>흑백</Form.Option>
              <Form.Option value='영화'>영화</Form.Option>
              <Form.Option value='드로잉'>드로잉</Form.Option>
              <Form.Option value='어린아이그림'>어린아이그림</Form.Option>
              <Form.Option value='스티커'>스티커</Form.Option>
              <Form.Option value='일러스트'>일러스트</Form.Option>
              <Form.Option value='포스터'>포스터</Form.Option>
              <Form.Option value='캐릭터'>캐릭터</Form.Option>
              <Form.Option value='싸이버펑크'>싸이버펑크</Form.Option>
            </Form.Select>
          </Layout.Box>
          {/* <Layout.Box>
            <Form.Label>가격</Form.Label>
            {!inputPrice || isNaN(inputPrice) ? (
              <Form.ErrMsg>가격을 숫자로 입력해주세요.</Form.ErrMsg>
            ) : null}
            <Form.Input value={pricee} onChange={handlePriceChange} />
          </Layout.Box> */}
        </Modal.Content>

        <Modal.Actions>
          <Modal.SaveButton disabled={isButtonDisabled} onClick={onSaveClick}>
            수정
          </Modal.SaveButton>
          <Modal.CloseButton onClick={closeSelf}>취소</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
