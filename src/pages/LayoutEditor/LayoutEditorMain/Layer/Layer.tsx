import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import {
  faBoxes,
  faChartArea,
  faCrop,
  faGlobe,
  faImage,
  faShapes,
  faSignOut,
  faText,
  faTrash,
  faVideo,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { CanvasObject } from '../../lib/objects/fabric.canvas';
import { FabricObject } from '../../lib/objects/fabric.object';
import { WorkArea } from '../../lib/objects/fabric.workarea';
import * as S from './Layer.style';

export function Layer(props: { canvas: CanvasObject }) {
  const { canvas } = props;

  let { current: draggingItem } = useRef<FabricObject>(null);
  const objects = canvas.getObjects() || [];
  const activeObject = canvas.getActiveObject();

  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, object: FabricObject) => {
    e.stopPropagation();
    canvas.remove(object);
  };

  const getIcon = (object: FabricObject) => {
    if (object.type === 'TEXT') return faText;
    if (object.type === 'IMAGE') return faImage;
    if (object.type === 'VIDEO') {
      if (object.srcType === 'YOUTUBE') return faYoutube;
      return faVideo;
    }
    if (object.type === 'FRAME') return faShapes;
    if (object.type === 'VECTOR_GRAPHIC') return faCrop;
    if (object.type === 'WEBPAGE') return faGlobe;
    if (object.type === 'WIDGET') return faBoxes;
    if (object.type === 'INPUT_SOURCE') return faSignOut;
    /** 여기에 WORKAREA가 올 가능성은 없지만 혹시 모르니 완충코드 */
    if (object.type === 'WORKAREA') return faChartArea;
    return faImage;
  };

  return (
    <S.Ol>
      {objects
        .filter((o): o is Exclude<FabricObject, WorkArea> => o.type !== 'WORKAREA')
        .reverse()
        .map((object, index) => (
          <Tooltip
            key={`${object.width}x${object.height}x${object.left}x${object.top}`}
            title={<Typography>{object.name}</Typography>}
            placement='left'
          >
            <S.Li
              key={`${object.width}x${object.height}x${object.left}x${object.top}`}
              selected={object === activeObject}
              onClick={() => {
                console.log(object);
                canvas.setActiveObject(object).renderAll();
              }}
              onDoubleClick={() => canvas.zoomHandler.zoomToSelection()}
              onDragStart={() => (draggingItem = object)}
              onDrop={() =>
                canvas.elementHandler.moveTo(draggingItem, objects.length - (index + 1))
              }
              onDragOver={(e) => e.preventDefault()} // 없으면 onDrop이 호출되지 않음
            >
              <FontAwesomeIcon icon={getIcon(object)} />
              <S.LiName draggable>{object.name}</S.LiName>
              <S.LiButton onClick={(e) => onDeleteClick(e, object)}>
                <FontAwesomeIcon icon={faTrash} />
              </S.LiButton>
            </S.Li>
          </Tooltip>
        ))}
    </S.Ol>
  );
}
