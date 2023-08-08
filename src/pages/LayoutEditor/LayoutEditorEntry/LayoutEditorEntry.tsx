import { useTranslation } from '@app/src/hooks/useTranslation';
import { SelectChangeEvent } from '@mui/material/Select';
import React, { useCallback, useState } from 'react';
import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import * as S from './LayoutEditorEntry.style';
import { useNavigate } from 'react-router-dom';
import * as Page2 from '@app/src/components/Page2.style';

interface LayoutEditorInfo {
  name: string;
  desc: string;
  orientation: 'LANDSCAPE' | 'PORTRAIT';
  ratio: string;
  width: number;
  height: number;
  backgroundColor: string;
  mainCategory: string;
  subCategory: string;
}

/**
 * @author JJH 2020.11.24
 * @description 레이아웃 에디터 컨테이너
 */
export const LayoutEditorEntry = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [info, setInfoRaw] = useState<LayoutEditorInfo>({
    name: '',
    desc: '',
    orientation: 'LANDSCAPE',
    ratio: '16:9',
    width: 1920,
    height: 1080,
    backgroundColor: '#ffffff',
    mainCategory: '',
    subCategory: '',
  });

  const setInfo = (key: string, value: LayoutEditorInfo[keyof LayoutEditorInfo]) => {
    setInfoRaw((prev) => ({ ...prev, [key]: value }));
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo(e.target.name, e.target.value);
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInfo(e.target.name, e.target.value);
  };

  const onOrientationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [ratioX, ratioY] = info.ratio.split(':');
    setInfo(e.target.name, e.target.value);
    const newRatio = `${ratioY}:${ratioX}`;
    setInfo('ratio', newRatio);
    const newHeight = Math.floor((info.width / Number(ratioY)) * Number(ratioX));
    setInfo('height', newHeight);
  };

  const onRatioChange = (e: SelectChangeEvent) => {
    setInfo(e.target.name, e.target.value);
    if (e.target.value === '*:*') return;
    const [ratioX, ratioY] = e.target.value.split(':');
    const newHeight = Math.floor((info.width / Number(ratioX)) * Number(ratioY));
    setInfo('height', newHeight);
  };

  const onWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo(e.target.name, Number(e.target.value));
    if (info.ratio === '*:*') return;
    const [ratioX, ratioY] = info.ratio.split(':');
    const newHeight = Math.floor((Number(e.target.value) / Number(ratioX)) * Number(ratioY));
    setInfo('height', newHeight);
  };

  const onHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo(e.target.name, Number(e.target.value));
    if (info.ratio === '*:*') return;
    const [ratioX, ratioY] = info.ratio.split(':');
    const newWidth = Math.floor((Number(e.target.value) / Number(ratioY)) * Number(ratioX));
    setInfo('width', newWidth);
  };

  const gotoEditor = () => {
    navigate('/layoutEditor/new', { state: info });
  };

  const goBackPresentationList = useCallback(() => {
    navigate('/presentation');
  }, [navigate]);

  const isNameValid = info.name.length > 0;
  const isCustomAspectRatioInValid =
    (info.orientation === 'LANDSCAPE' && info.ratio === '*:*' && info.width < info.height) ||
    (info.orientation === 'PORTRAIT' && info.ratio === '*:*' && info.width > info.height);
  const isButtonDisalbed = !isNameValid || isCustomAspectRatioInValid;

  return (
    <Page2.Container>
      <div>
        <S.Title>{t('app-common.pesentation-info')}</S.Title>

        <S.Body>
          <Layout.Box mb='20px'>
            <S.TextLabel htmlFor='name'>{t('app-common.name')}</S.TextLabel>
            {!isNameValid ? <Form.ErrMsg>이름을 입력해주세요.</Form.ErrMsg> : null}
            <Form.Input
              id='name'
              name='name'
              placeholder='New Presentation'
              onChange={onNameChange}
              value={info.name}
              autoComplete='off'
              autoCorrect='off'
              autoFocus
            />
          </Layout.Box>

          <Layout.Box mb='20px'>
            <S.TextLabel htmlFor='desc'>{t('app-presentation.preview.desc')}</S.TextLabel>
            <Form.TextArea
              id='desc'
              name='desc'
              rows={5}
              placeholder={t('app-presentation.preview.desc')}
              onChange={onDescriptionChange}
              value={info.desc}
              autoComplete='off'
              autoCorrect='off'
            />
          </Layout.Box>

          <Layout.Box mb='20px'>
            <S.TextLabel htmlFor='orientation'>{t('Orientation')}</S.TextLabel>
            <Form.Select
              name='orientation'
              id='orientation'
              color='secondary'
              variant='outlined'
              value={info.orientation}
              onChange={onOrientationChange}
            >
              <Form.Option value='LANDSCAPE'>{t('app-LayoutEditor.type_hori')}</Form.Option>
              <Form.Option value='PORTRAIT'>{t('app-LayoutEditor.type_ve')}</Form.Option>
            </Form.Select>
          </Layout.Box>

          <Layout.Box mb='20px'>
            <S.TextLabel htmlFor='aspect-ratio'>Aspect Ratio</S.TextLabel>
            {info.orientation === 'LANDSCAPE' ? (
              <Form.Select
                id='aspect-ratio'
                name='ratio'
                variant='outlined'
                color='secondary'
                value={info.ratio} // TODO
                onChange={onRatioChange} //TODO
              >
                <Form.Option value='16:9'>16 : 9</Form.Option>
                <Form.Option value='4:3'>4 : 3</Form.Option>
                <Form.Option value='1:1'>1 : 1</Form.Option>
                <Form.Option value='*:*'>사용자 지정</Form.Option>
              </Form.Select>
            ) : null}
            {info.orientation === 'PORTRAIT' ? (
              <Form.Select
                id='aspect-ratio'
                name='ratio'
                variant='outlined'
                color='secondary'
                value={info.ratio} // TODO
                onChange={onRatioChange} //TODO
              >
                <Form.Option value='9:16'>9 : 16</Form.Option>
                <Form.Option value='3:4'>3 : 4</Form.Option>
                <Form.Option value='1:1'>1 : 1</Form.Option>
                <Form.Option value='*:*'>사용자 지정</Form.Option>
              </Form.Select>
            ) : null}
          </Layout.Box>

          <Layout.Box mb='20px'>
            <S.TextLabel htmlFor='width'>{t('app-presentation.preview.width')}</S.TextLabel>
            {isCustomAspectRatioInValid ? (
              <Form.ErrMsg>유요하지 않은 종횡비입니다.</Form.ErrMsg>
            ) : null}
            <Form.Input
              id='width'
              name='width'
              type='number'
              placeholder={t('app-presentation.preview.width')}
              onChange={onWidthChange}
              value={`${info.width}`}
            />
          </Layout.Box>

          <Layout.Box mb='20px'>
            <S.TextLabel htmlFor='height'>{t('app-presentation.preview.height')}</S.TextLabel>
            {isCustomAspectRatioInValid ? (
              <Form.ErrMsg>유요하지 않은 종횡비입니다.</Form.ErrMsg>
            ) : null}
            <Form.Input
              id='height'
              name='height'
              type='number'
              placeholder={t('app-presentation.preview.height')}
              onChange={onHeightChange}
              value={`${info.height}`}
            />
          </Layout.Box>

          <S.Actions>
            <S.CancelButton onClick={goBackPresentationList}>
              {t('app-common.cancel')}
            </S.CancelButton>
            <S.CreateButton disabled={isButtonDisalbed} onClick={gotoEditor}>
              {t('app-common.create')}
            </S.CreateButton>
          </S.Actions>
        </S.Body>
      </div>
    </Page2.Container>
  );
};
