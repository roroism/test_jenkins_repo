import fontList from '@app/resources/fontList.json';
import { ColorPickDialog } from '@app/src/components/ColorPickDialog';
import * as Form from '@app/src/components/Form.style';
import { useModal } from '@app/src/hooks/useModal';
import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faBold,
  faItalic,
  faStrikethrough,
  faUnderline,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SelectChangeEvent, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { CanvasObject } from '../../../lib/objects/fabric.canvas';
import { TextBoxObject } from '../../../lib/objects/fabric.textbox';
import * as S from '../Toolbar.style';

type TextToolbarProps = {
  canvas: CanvasObject;
  activeObject: TextBoxObject;
};

export function TextToolbar(props: TextToolbarProps) {
  const { activeObject, canvas } = props;
  const modalCtrl = useModal();

  const openBgColorDialog = () => {
    modalCtrl.open(
      <ColorPickDialog
        defaultColor={activeObject.backgroundColor}
        onSelected={(color) => activeObject.apply('backgroundColor', color).commit()}
      />
    );
  };

  const openTextBgColorDialog = () => {
    modalCtrl.open(
      <ColorPickDialog
        defaultColor={activeObject.textBackgroundColor}
        onSelected={(color) => activeObject.apply('textBackgroundColor', color).commit()}
      />
    );
  };

  const openFontColorDialog = () => {
    modalCtrl.open(
      <ColorPickDialog
        defaultColor={activeObject.fill as string}
        onSelected={(color) => activeObject.apply('fontColor', color).commit()}
      />
    );
  };

  return (
    <S.Ul>
      {/* align left */}
      <Tooltip title={<Typography>왼쪽 정렬</Typography>}>
        <S.LiButton onClick={() => activeObject.apply('align', 'left').commit()}>
          <FontAwesomeIcon icon={faAlignLeft} />
        </S.LiButton>
      </Tooltip>
      {/* align center */}
      <Tooltip title={<Typography>가운데 정렬</Typography>}>
        <S.LiButton onClick={() => activeObject.apply('align', 'center').commit()}>
          <FontAwesomeIcon icon={faAlignCenter} />
        </S.LiButton>
      </Tooltip>
      {/* align right */}
      <Tooltip title={<Typography>오른쪽 정렬</Typography>}>
        <S.LiButton onClick={() => activeObject.apply('align', 'right').commit()}>
          <FontAwesomeIcon icon={faAlignRight} />
        </S.LiButton>
      </Tooltip>

      {/* saperator */}
      <span style={{ width: 1, height: '80%', background: '#e0e0e0' }} />

      {/* toggle underline */}
      <Tooltip title={<Typography>밑줄</Typography>}>
        <S.LiToggle
          onClick={() => activeObject.apply('underline', (prev) => !prev).commit()}
          blocked={activeObject.underline}
        >
          <FontAwesomeIcon icon={faUnderline} />
        </S.LiToggle>
      </Tooltip>

      {/* toggle underline */}
      <Tooltip title={<Typography>두껍게</Typography>}>
        <S.LiToggle
          onClick={() => activeObject.apply('bold', (prev) => !prev).commit()}
          blocked={activeObject.bold}
        >
          <FontAwesomeIcon icon={faBold} />
        </S.LiToggle>
      </Tooltip>

      {/* toggle underline */}
      <Tooltip title={<Typography>기울이기</Typography>}>
        <S.LiToggle
          onClick={() => activeObject.apply('italic', (prev) => !prev).commit()}
          blocked={activeObject.italic}
        >
          <FontAwesomeIcon icon={faItalic} />
        </S.LiToggle>
      </Tooltip>

      {/* toggle underline */}
      <Tooltip title={<Typography>취소선</Typography>}>
        <S.LiToggle
          onClick={() => activeObject.apply('strikethrough', (prev) => !prev).commit()}
          blocked={activeObject.strikethrough}
        >
          <FontAwesomeIcon icon={faStrikethrough} />
        </S.LiToggle>
      </Tooltip>

      {/* saperator */}
      <span style={{ width: 1, height: '80%', background: '#e0e0e0' }} />

      {/* backgroundColor */}
      {/* <Tooltip title={<Typography>배경색</Typography>} placement='top'>
        <S.LiButton onClick={openBgColorDialog}>
          <S.LiColor color={activeObject.backgroundColor} />
        </S.LiButton>
      </Tooltip> */}

      {/* textBgColor */}
      {/* <Tooltip title={<Typography>글자 배경색</Typography>} placement='top'>
        <S.LiButton onClick={openTextBgColorDialog}>
          <S.LiColor color={activeObject.textBackgroundColor} />
        </S.LiButton>
      </Tooltip> */}

      {/* textBgColor */}
      <Tooltip title={<Typography>글자 색</Typography>} placement='top'>
        <S.LiButton onClick={openFontColorDialog}>
          <S.LiColor color={activeObject.fontColor} />
        </S.LiButton>
      </Tooltip>

      {/* saperator */}
      <span style={{ width: 1, height: '80%', background: '#e0e0e0' }} />

      {/* font_size */}
      {/* 글자크기 자동맞춤 때문에 필요가 없음 */}
      {/* <Tooltip title={<Typography>글자크기</Typography>} placement='top'>
        <S.LiInput
          color='secondary'
          value={String(textbox.fontSize)}
          onChange={(e) => textbox.changeFontSize(Number(e.target.value))}
        />
      </Tooltip> */}

      {/* fontFamily */}
      <Tooltip title={<Typography>폰트</Typography>} placement='top'>
        <S.LiSelect
          width='100px'
          color='secondary'
          value={activeObject.fontFamily}
          onChange={(e: SelectChangeEvent) =>
            activeObject.apply('fontName', e.target.value).commit()
          }
          style={{ fontFamily: activeObject.fontFamily }}
        >
          {Object.entries(fontList).map(([fontFamily, fontName]) => (
            <Form.Option key={fontFamily} value={fontFamily} style={{ fontFamily }}>
              {fontName}
            </Form.Option>
          ))}
        </S.LiSelect>
      </Tooltip>
    </S.Ul>
  );
}
