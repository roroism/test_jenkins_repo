import { useTranslation } from '@app/src/hooks/useTranslation';
import { Ai } from '@app/src/pages/Ai/Ai';
import { faGoogleDrive, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faBrowser, faGlobe, faImagePolaroid } from '@fortawesome/pro-solid-svg-icons';
import {
  faBoxes,
  faCrop,
  faImage,
  faShapes,
  faSignOut,
  faText,
  faVideo,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { CanvasObject } from '../../lib/objects/fabric.canvas';
import { FramePanel } from './Panels/FramePanel';
import { GoogleDrivePanel } from './Panels/GoogleDrivePanel';
import { ImageFramePanel } from './Panels/ImageFramePanel';
import { ImagePanel } from './Panels/ImagePanel/ImagePanel';
import { InputSourcePanel } from './Panels/InputSourcePanel';
import { TextPanel } from './Panels/TextPanel';
import { VideoPanel } from './Panels/VideoPanel';
import { WebPagePanel } from './Panels/WebPagePanel';
import { WidgetPanel } from './Panels/WidgetPanel';
import { YoutubePanel } from './Panels/YoutubePanel';
import * as S from './PanelTab.style';

const editorList: { id: string; path: PanelEnum; icon: any }[] = [
  {
    id: 'app-common.text',
    path: 'TEXT',
    icon: faText,
  },
  {
    id: 'app-asset.image',
    path: 'IMAGE',
    icon: faImage,
  },
  {
    id: 'app-asset.video',
    path: 'VIDEO',
    icon: faVideo,
  },
  {
    id: 'app-asset.frame',
    path: 'FRAME',
    icon: faShapes,
  },
  {
    id: 'app-asset.image_frame',
    path: 'IMAGE_FRAME',
    icon: faCrop,
  },
  {
    id: 'app-asset.input_source',
    path: 'INPUT_SOURCE',
    icon: faSignOut,
  },
  {
    id: 'app-asset.widget',
    path: 'WIDGET',
    icon: faBoxes,
  },
  {
    id: 'app-asset.youtube',
    path: 'YOUTUBE',
    icon: faYoutube,
  },
  {
    id: 'app-asset.google_drive',
    path: 'GOOGLE_DRIVE',
    icon: faGoogleDrive,
  },
  {
    id: 'app-asset.browser',
    path: 'WEBLINK',
    icon: faGlobe,
  },
  {
    id: 'app-ai.image',
    path: 'AI',
    icon: faImagePolaroid,
  },
];

type PanelEnum =
  | 'NONE'
  | 'TEXT'
  | 'IMAGE'
  | 'VIDEO'
  | 'FRAME'
  | 'IMAGE_FRAME'
  | 'INPUT_SOURCE'
  | 'WIDGET'
  | 'YOUTUBE'
  | 'GOOGLE_DRIVE'
  | 'WEBLINK'
  | 'AI'

export type PanelProps = {
  open: boolean;
  closePanel: () => void;
  canvas: CanvasObject;
};

export function PanelTab(props: { canvas: CanvasObject }) {
  const { canvas } = props;
  const { t } = useTranslation();
  const [tab, setTab] = useState<PanelEnum>('NONE');

  const onTabItemClick = (path: PanelEnum) => {
    setTab((prev) => (prev === path ? 'NONE' : path));
  };

  const closePanel = () => {
    setTab('NONE');
  };

  return (
    <S.Container>
      <S.Ul>
        {editorList.map((editor) => (
          <Tooltip
            key={editor.path}
            title={<Typography>{t(editor.id)}</Typography>}
            placement='left'
          >
            <S.LiButton onClick={() => onTabItemClick(editor.path)} selected={tab === editor.path}>
              <FontAwesomeIcon icon={editor.icon} />
            </S.LiButton>
          </Tooltip>
        ))}
      </S.Ul>
      <TextPanel open={tab === 'TEXT'} closePanel={closePanel} canvas={canvas} />
      <ImagePanel open={tab === 'IMAGE'} closePanel={closePanel} canvas={canvas} />
      <VideoPanel open={tab === 'VIDEO'} closePanel={closePanel} canvas={canvas} />
      <FramePanel open={tab === 'FRAME'} closePanel={closePanel} canvas={canvas} />
      <ImageFramePanel open={tab === 'IMAGE_FRAME'} closePanel={closePanel} canvas={canvas} />
      <InputSourcePanel open={tab === 'INPUT_SOURCE'} closePanel={closePanel} canvas={canvas} />
      <YoutubePanel open={tab === 'YOUTUBE'} closePanel={closePanel} canvas={canvas} />
      <WidgetPanel open={tab === 'WIDGET'} closePanel={closePanel} canvas={canvas} />
      <GoogleDrivePanel open={tab === 'GOOGLE_DRIVE'} closePanel={closePanel} canvas={canvas} />
      <WebPagePanel open={tab === 'WEBLINK'} closePanel={closePanel} canvas={canvas} />
      <Ai open={tab === 'AI'} closePanel={closePanel} canvas={canvas} />
    </S.Container>
  );
}
