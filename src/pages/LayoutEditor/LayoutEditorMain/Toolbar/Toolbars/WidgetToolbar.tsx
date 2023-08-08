import { GeneralWidgetDialog } from '@app/src/components/GeneralWidgetDialog';
import { useModal } from '@app/src/hooks/useModal';
import { selectUserDataByKey } from '@app/src/store/slices/authSlice';
import { faBoxes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { CanvasObject } from '../../../lib/objects/fabric.canvas';
import { WidgetObject } from '../../../lib/objects/fabric.widget';
import * as S from '../Toolbar.style';

type Props = {
  canvas: CanvasObject;
  activeObject: WidgetObject;
};

export function WidgetToolbar(props: Props) {
  const { activeObject, canvas } = props;
  const modalCtrl = useModal();
  const userLang = useSelector(selectUserDataByKey('name'));

  const openGeneralWidgetDialogForEditor = () => {
    modalCtrl.open(
      <GeneralWidgetDialog
        mode='EDITOR'
        widget={JSON.parse(activeObject.data)}
        onConfirmed={(widget) => {
          activeObject
            .apply('data', JSON.stringify(widget))
            .apply('name', widget.name[userLang])
            .commit();
        }}
      />
    );
  };

  return (
    <S.Ul>
      {/* mute & unmute */}
      <Tooltip title={<Typography>위젯 설정</Typography>}>
        <S.LiButton onClick={openGeneralWidgetDialogForEditor} blocked={!activeObject}>
          <FontAwesomeIcon icon={faBoxes} />
        </S.LiButton>
      </Tooltip>
    </S.Ul>
  );
}
