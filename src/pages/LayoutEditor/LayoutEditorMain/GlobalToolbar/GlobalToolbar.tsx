import {
  postPresentationForEditor,
  putPresentationForEditor,
} from '@app/src/apis/presentation/presentationApi';
import { Alert } from '@app/src/components/Alert';
import { Info } from '@app/src/components/Info';
import * as Page from '@app/src/components/Page.style';
import { PresentationPreview } from '@app/src/components/Preview/PresentationPreview';
import { InstantPreview } from '@app/src/components/Preview/InstantPreview';
import { useModal } from '@app/src/hooks/useModal';
import { useMuiSafeMenu } from '@app/src/hooks/useMuiSafeMenu';
import { createHexID } from '@app/src/utils';
import {
  faBorderCenterH,
  faBorderCenterV,
  faBringForward,
  faCaretLeft,
  faCaretRight,
  faCog,
  faCopy,
  faCut,
  faExpand,
  faExpandArrowsAlt,
  faEye,
  faHandPaper,
  faLock,
  faLockOpen,
  faMousePointer,
  faPaste,
  faSave,
  faTrash,
  faUndo,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { CanvasObject } from '../../lib/objects/fabric.canvas';
import { DesignPropertyDialog } from './DesignPropertyDialog';
import * as S from './GlobalToolbar.style';

export function GlobalToolbar(props: { canvas: CanvasObject }) {
  const { canvas } = props;
  const modalCtrl = useModal();
  const saveMenu = useMuiSafeMenu();

  const activeObject = canvas?.getActiveObject();
  const undoable = canvas?.undoRedoHandler.undoable;
  const redoable = canvas?.undoRedoHandler.redoable;

  const saveRawPresentation = async () => {
    try {
      const rawPresentation = canvas.presentationHandler.exportRawPresentation();
      const presentationThumbnail = canvas.presentationHandler.generateThumbnail();
      if (!!rawPresentation.id) {
        await putPresentationForEditor(rawPresentation, presentationThumbnail);
      } else {
        await postPresentationForEditor(rawPresentation, presentationThumbnail);
      }
      modalCtrl.open(<Info text='저장되었습니다' />);
    } catch (error) {
      modalCtrl.open(<Alert text='저장에 실패하였습니다' />);
    }
  };
  const saveAsRawPresentation = async () => {
    try {
      const rawPresentation = canvas.presentationHandler.exportRawPresentation();
      const presentationThumbnail = canvas.presentationHandler.generateThumbnail();
      rawPresentation.id = createHexID(24);
      await postPresentationForEditor(rawPresentation, presentationThumbnail);
      modalCtrl.open(<Info text='저장되었습니다' />);
    } catch (error) {
      modalCtrl.open(<Alert text='저장에 실패하였습니다' />);
    }
  };

  const openDesignPropertyDialog = () => {
    const workarea = canvas?.elementHandler.getWorkArea();
    modalCtrl.open(<DesignPropertyDialog workArea={workarea} />);
  };

  const openPresentationPreview = () => {
    const rawPresentation = canvas.presentationHandler.exportRawPresentation();
    modalCtrl.open(<InstantPreview rawPresentation={rawPresentation} />);
  };

  return (
    <S.Ul>
      {/* selector mode */}
      <Tooltip title={<Typography>선택</Typography>}>
        <S.LiButton
          onClick={() => canvas.eventHandler.setInteractionMode('SELECT')}
          selected={canvas.eventHandler.interactionMode === 'SELECT'}
        >
          <FontAwesomeIcon icon={faMousePointer} />
        </S.LiButton>
      </Tooltip>
      {/* grab mode */}
      <Tooltip title={<Typography>캔버스 잡기</Typography>}>
        <S.LiButton
          onClick={() => canvas.eventHandler.setInteractionMode('HAND')}
          selected={canvas.eventHandler.interactionMode === 'HAND'}
        >
          <FontAwesomeIcon icon={faHandPaper} />
        </S.LiButton>
      </Tooltip>
      {/* copy */}
      <Tooltip title={<Typography>복사</Typography>}>
        <S.LiButton onClick={() => canvas.clipboardHandler.copy()} blocked={!activeObject}>
          <FontAwesomeIcon icon={faCopy} />
        </S.LiButton>
      </Tooltip>
      {/* cut */}
      <Tooltip title={<Typography>잘라내기</Typography>}>
        <S.LiButton onClick={() => canvas.clipboardHandler.cut()} blocked={!activeObject}>
          <FontAwesomeIcon icon={faCut} />
        </S.LiButton>
      </Tooltip>
      {/* paste */}
      <Tooltip title={<Typography>붙여넣기</Typography>}>
        <S.LiButton onClick={() => canvas.clipboardHandler.paste()}>
          <FontAwesomeIcon icon={faPaste} />
        </S.LiButton>
      </Tooltip>
      {/* lock & unlock */}
      <Tooltip title={<Typography>{activeObject?.lockMovementX ? '잠금해제' : '잠금'}</Typography>}>
        <S.LiButton onClick={() => canvas.elementHandler.toggleLock()} blocked={!activeObject}>
          <FontAwesomeIcon icon={activeObject?.lockMovementX ? faLockOpen : faLock} />
        </S.LiButton>
      </Tooltip>
      {/* 크게보기 */}
      <Tooltip title={<Typography>크게보기</Typography>}>
        <S.LiButton onClick={() => canvas.zoomHandler.zoomToSelection()} blocked={!activeObject}>
          <FontAwesomeIcon icon={faExpand} />
        </S.LiButton>
      </Tooltip>
      {/* 꽉 채우기 */}
      <Tooltip title={<Typography>꽉 채우기</Typography>}>
        <S.LiButton onClick={() => canvas.elementHandler.fill()} blocked={!activeObject}>
          <FontAwesomeIcon icon={faExpandArrowsAlt} />
        </S.LiButton>
      </Tooltip>
      {/* rotate left 90deg */}
      <Tooltip title={<Typography>반시계방향 회전</Typography>}>
        <S.LiButton onClick={() => canvas.elementHandler.rotate(-90)} blocked={!activeObject}>
          <FontAwesomeIcon icon={faUndo} />
        </S.LiButton>
      </Tooltip>
      {/* roteate right 90deg */}
      <Tooltip title={<Typography>시계방향 회전</Typography>}>
        <S.LiButton onClick={() => canvas.elementHandler.rotate(90)} blocked={!activeObject}>
          <FontAwesomeIcon icon={faUndo} flip='horizontal' />
        </S.LiButton>
      </Tooltip>
      {/* vertical center */}
      <Tooltip title={<Typography>세로 중심</Typography>}>
        <S.LiButton
          onClick={() => canvas.elementHandler.center('vertical')}
          blocked={!activeObject}
        >
          <FontAwesomeIcon icon={faBorderCenterH} />
        </S.LiButton>
      </Tooltip>
      {/* horizontal center */}
      <Tooltip title={<Typography>가로 중심</Typography>}>
        <S.LiButton
          onClick={() => canvas.elementHandler.center('horizontal')}
          blocked={!activeObject}
        >
          <FontAwesomeIcon icon={faBorderCenterV} flip='horizontal' />
        </S.LiButton>
      </Tooltip>

      {/* saperator */}
      <div style={{ flex: 1 }}></div>

      {/* undo */}
      <Tooltip title={<Typography>되돌리기</Typography>}>
        <S.LiButton onClick={() => canvas.undoRedoHandler.undo()} blocked={!undoable}>
          <FontAwesomeIcon icon={faCaretLeft} />
        </S.LiButton>
      </Tooltip>
      {/* redo */}
      <Tooltip title={<Typography>앞으로 돌리기</Typography>}>
        <S.LiButton onClick={() => canvas.undoRedoHandler.redo()} blocked={!redoable}>
          <FontAwesomeIcon icon={faCaretRight} />
        </S.LiButton>
      </Tooltip>
      {/* bringFoward */}
      <Tooltip title={<Typography>앞으로 보내기</Typography>}>
        <S.LiButton onClick={() => canvas.elementHandler.bringForward()} blocked={!activeObject}>
          <FontAwesomeIcon icon={faBringForward} />
        </S.LiButton>
      </Tooltip>
      {/* sendBackwards */}
      <Tooltip title={<Typography>뒤로 보내기</Typography>}>
        <S.LiButton onClick={() => canvas.elementHandler.sendBackwards()} blocked={!activeObject}>
          <FontAwesomeIcon icon={faBringForward} rotation={180} />
        </S.LiButton>
      </Tooltip>
      {/* remove */}
      <Tooltip title={<Typography>삭제하기</Typography>}>
        <S.LiButton onClick={() => canvas.remove()} blocked={!activeObject}>
          <FontAwesomeIcon icon={faTrash} />
        </S.LiButton>
      </Tooltip>
      {/* saveMenu */}
      <Tooltip title={<Typography>저장하기</Typography>}>
        <S.LiButton
          {...saveMenu.triggerProps}
          blocked={!undoable}
          onClick={undoable ? saveMenu.triggerProps.onClick : () => {}}
        >
          <FontAwesomeIcon icon={faSave} />
        </S.LiButton>
      </Tooltip>
      <Menu {...saveMenu.popperProps}>
        <Page.MenuItem onClick={saveRawPresentation}>&nbsp; 저장</Page.MenuItem>
        <Page.MenuItem onClick={saveAsRawPresentation}>&nbsp; 다른이름으로 저장</Page.MenuItem>
      </Menu>
      {/* preview */}
      <Tooltip title={<Typography>미리보기</Typography>}>
        <S.LiButton onClick={openPresentationPreview}>
          <FontAwesomeIcon icon={faEye} />
        </S.LiButton>
      </Tooltip>
      {/* setting - change name & description */}
      <Tooltip title={<Typography>이름과 설명 변경</Typography>}>
        <S.LiButton onClick={openDesignPropertyDialog}>
          <FontAwesomeIcon icon={faCog} />
        </S.LiButton>
      </Tooltip>
    </S.Ul>
  );
}
