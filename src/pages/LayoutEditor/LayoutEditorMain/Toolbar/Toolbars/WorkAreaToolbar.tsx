import { ColorPickDialog } from '@app/src/components/ColorPickDialog';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { faFillDrip } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, Typography } from '@mui/material';
import React from 'react';
import { CanvasObject } from '../../../lib/objects/fabric.canvas';
import { WorkArea } from '../../../lib/objects/fabric.workarea';
import * as S from '../Toolbar.style';

type Props = {
  canvas: CanvasObject;
  activeObject: WorkArea;
};

export function WorkAreaToolbar(props: Props) {
  const { activeObject, canvas } = props;

  const { t } = useTranslation();
  const modalCtrl = useModal();

  const openFillDialog = () => {
    modalCtrl.open(
      <ColorPickDialog
        defaultColor={activeObject.fill}
        onSelected={(color) => {
          activeObject.apply('fill', color).commit();
          canvas.renderAll();
        }}
      />
    );
  };

  return (
    <S.Ul>
      {/* fill */}
      <Tooltip title={<Typography>{t('app-LayoutEditor.fullscreen')}</Typography>}>
        <S.LiButton onClick={openFillDialog}>
          <FontAwesomeIcon icon={faFillDrip} />
        </S.LiButton>
      </Tooltip>
    </S.Ul>
  );
}
