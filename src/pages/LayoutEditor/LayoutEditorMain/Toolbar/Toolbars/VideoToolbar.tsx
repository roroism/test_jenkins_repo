import { faVolume, faVolumeOff } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, Typography } from '@mui/material';
import React from 'react';
import { CanvasObject } from '../../../lib/objects/fabric.canvas';
import { VideoObject } from '../../../lib/objects/fabric.video';
import * as S from '../Toolbar.style';

type TextToolbarProps = {
  canvas: CanvasObject;
  activeObject: VideoObject;
};

export function VideoToolbar(props: TextToolbarProps) {
  const { activeObject, canvas } = props;

  if (activeObject.srcType === 'SDSS') {
    return (
      <S.Ul>
        {/* mute & unmute */}
        <Tooltip title={<Typography>{activeObject?.mute ? '음소거' : '소리 나옴'}</Typography>}>
          <S.LiButton
            onClick={() => activeObject.apply('mute', (prev) => !prev).commit()}
            blocked={!activeObject}
          >
            <FontAwesomeIcon icon={activeObject?.mute ? faVolumeOff : faVolume} />
          </S.LiButton>
        </Tooltip>
      </S.Ul>
    );
  }

  return <S.Ul></S.Ul>;
}
