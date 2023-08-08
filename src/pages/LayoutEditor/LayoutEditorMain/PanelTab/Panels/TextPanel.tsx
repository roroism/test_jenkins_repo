import fontList from '@app/resources/fontList.json';
import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import { useTypeSafeReducer } from '@app/src/hooks/useTypeSafeReducer';
import { SelectChangeEvent } from '@mui/material';
import React from 'react';
import { TextBoxObject } from '../../../lib/objects/fabric.textbox';
import { PanelProps } from '../PanelTab';
import * as S from '../PanelTab.style';

const defaultTextBoxInitial = {
  fontFamily: 'Roboto',
  fontSize: 24,
  text: 'Enter Text',
};

export function TextPanel(props: PanelProps) {
  console.log(props);
  const { open, closePanel, canvas } = props;

  const [textboxInitial, textboxInitialActions] = useTypeSafeReducer(defaultTextBoxInitial, {
    onTextChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.text = e.target.value;
    },
    onFontFamilyChange: (state, e: SelectChangeEvent) => {
      state.fontFamily = e.target.value;
    },
    onFontSizeChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      const newFontSize = Number(e.target.value);
      if (newFontSize < 0) return;
      if (newFontSize > 100) return;
      state.fontSize = newFontSize;
    },
  });

  const startDrag = () => {
    const textboxObject = new TextBoxObject(textboxInitial.text)
      .apply('fontSize', textboxInitial.fontSize)
      .apply('fontName', textboxInitial.fontFamily)
      .apply('fontColor', '#000000');

    canvas.onDragStart(textboxObject);
    closePanel();
  };

  return (
    <S.Panel open={open}>
      <S.SubPanel open>
        <Layout.Box mb='20px'>
          <Form.Label htmlFor='text-item.font-family'>폰트</Form.Label>
          <Form.Select
            id='text-item.font-family'
            color='secondary'
            value={textboxInitial.fontFamily}
            onChange={textboxInitialActions.onFontFamilyChange}
            style={{ fontFamily: textboxInitial.fontFamily }}
          >
            {Object.entries(fontList).map(([fontFamily, fontName]) => (
              <Form.Option key={fontFamily} value={fontFamily} style={{ fontFamily }}>
                {fontName}
              </Form.Option>
            ))}
          </Form.Select>
        </Layout.Box>
        <Layout.Box mb='20px'>
          <Form.Label htmlFor='text-item.font-size'>기본 글자 크기</Form.Label>
          <Form.Input
            id='text-item.font-size'
            color='secondary'
            value={textboxInitial.fontSize}
            onChange={textboxInitialActions.onFontSizeChange}
          />
        </Layout.Box>
        <Layout.Box>
          <Form.Label htmlFor='text-item.text'>내용</Form.Label>
          <Form.PassMsg>아래의 글자를 캔버스로 드래드해주세요.</Form.PassMsg>
          <Form.Input
            draggable
            id='text-item.font-family'
            value={textboxInitial.text}
            onChange={textboxInitialActions.onTextChange}
            onDragStart={() => startDrag()}
            style={{
              fontFamily: textboxInitial.fontFamily,
              fontSize: textboxInitial.fontSize,
            }}
          />
        </Layout.Box>
      </S.SubPanel>
    </S.Panel>
  );
}
