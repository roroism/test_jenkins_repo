import React from 'react';
import { CanvasObject } from '../../lib/objects/fabric.canvas';
import * as S from './Toolbar.style';
import { FrameToolbar } from './Toolbars/FrameToolbar';
import { TextToolbar } from './Toolbars/TextToolbar';
import { VideoToolbar } from './Toolbars/VideoToolbar';
import { WidgetToolbar } from './Toolbars/WidgetToolbar';
import { WorkAreaToolbar } from './Toolbars/WorkAreaToolbar';

export function Toolbar(props: { canvas: CanvasObject }) {
  const { canvas } = props;
  const activeObject = canvas.getActiveObject();

  if (!activeObject) {
    const activeObject = canvas.elementHandler.getWorkArea();
    return <WorkAreaToolbar canvas={canvas} activeObject={activeObject} />;
  }

  if (activeObject.type === 'TEXT') {
    return <TextToolbar canvas={canvas} activeObject={activeObject} />;
  }

  if (activeObject.type === 'VIDEO') {
    return <VideoToolbar canvas={canvas} activeObject={activeObject} />;
  }

  if (activeObject.type === 'FRAME') {
    return <FrameToolbar canvas={canvas} activeObject={activeObject} />;
  }

  if (activeObject.type === 'WIDGET') {
    return <WidgetToolbar canvas={canvas} activeObject={activeObject} />;
  }

  return <S.Ul></S.Ul>;
}
