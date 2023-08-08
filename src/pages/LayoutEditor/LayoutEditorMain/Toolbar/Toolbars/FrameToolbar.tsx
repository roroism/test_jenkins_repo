import { ColorPickDialog } from '@app/src/components/ColorPickDialog';
import * as Form from '@app/src/components/Form.style';
import { useModal } from '@app/src/hooks/useModal';
import { Tooltip, Typography } from '@mui/material';
import React from 'react';
import { CanvasObject } from '../../../lib/objects/fabric.canvas';
import { FrameObject } from '../../../lib/objects/fabric.frame';
import * as S from '../Toolbar.style';

type Props = {
  canvas: CanvasObject;
  activeObject: FrameObject;
};

export function FrameToolbar(props: Props) {
  const { activeObject, canvas } = props;
  const modalCtrl = useModal();

  const openFillColorDialog = () => {
    modalCtrl.open(
      <ColorPickDialog
        defaultColor={activeObject.fillColor}
        onSelected={(color: string) => activeObject.apply('fillColor', color).commit()}
      />
    );
  };

  const openLineColorDialog = () => {
    modalCtrl.open(
      <ColorPickDialog
        defaultColor={activeObject.lineColor}
        onSelected={(color: string) => activeObject.apply('lineColor', color).commit()}
      />
    );
  };

  return (
    <S.Ul>
      {/* lineDepth */}
      <Tooltip title={<Typography>선 굵기</Typography>} placement='top'>
        <S.LiSelect
          width='100px'
          color='secondary'
          value={activeObject.lineDepth}
          onChange={(e) => activeObject.apply('lineDepth', +e.target.value).commit()}
        >
          <Form.Option value={5}>5px</Form.Option>
          <Form.Option value={10}>10px</Form.Option>
          <Form.Option value={20}>20px</Form.Option>
          <Form.Option value={30}>30px</Form.Option>
          <Form.Option value={40}>40px</Form.Option>
          <Form.Option value={50}>50px</Form.Option>
        </S.LiSelect>
      </Tooltip>

      {/* line pattern */}
      <Tooltip title={<Typography>선 스타일</Typography>} placement='top'>
        <S.LiSelect
          width='100px'
          color='secondary'
          value={activeObject.linePattern}
          onChange={(e) => activeObject.apply('linePattern', e.target.value as any).commit()}
        >
          <Form.Option value='SOLID'>직선</Form.Option>
          <Form.Option value='DOTTED'>점선</Form.Option>
          <Form.Option value='DASHED'>저어엄 선</Form.Option>
        </S.LiSelect>
      </Tooltip>

      {/* fillColor */}
      <Tooltip title={<Typography>배경색</Typography>} placement='top'>
        <S.LiButton onClick={openFillColorDialog}>
          <S.LiColor color={activeObject.fillColor} />
        </S.LiButton>
      </Tooltip>

      {/* lineColor */}
      <Tooltip title={<Typography>선 색</Typography>} placement='top'>
        <S.LiButton onClick={openLineColorDialog}>
          <S.LiColor color={activeObject.lineColor} />
        </S.LiButton>
      </Tooltip>
    </S.Ul>
  );
}
