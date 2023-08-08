import { getPresentation } from '@app/src/apis/presentation/presentationApi';
import { Confirm } from '@app/src/components/Confirm';
import { useModal } from '@app/src/hooks/useModal';
import { ImageLoader } from '@app/src/utils';
import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { unstable_useBlocker, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CanvasObject } from '../lib/objects/fabric.canvas';
import { WorkArea } from '../lib/objects/fabric.workarea';
import { GlobalToolbar } from './GlobalToolbar';
import { Layer } from './Layer';
import { PanelTab } from './PanelTab';
import { Toolbar } from './Toolbar';
import { ZoomTool } from './ZoomTool';

const Container = styled.div`
  height: 100%;
  background: #e0e0e0;

  display: grid;
  gap: 2px;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto 1fr;
  grid-template-areas:
    'global-toolbar global-toolbar global-toolbar'
    'panel-tab toolbar layer'
    'panel-tab canvas layer';
`;

const CanvasContainer = styled.div`
  grid-area: canvas;
  overflow: hidden;
  outline: 0;
  border: 0;
`;

// baseInfo의 타입은 LayoutEditorInfo ( layoutEditorEntry에서 확인할 수 있음 )
export function LayoutEditorMain(props: { mode: 'ADD' | 'EDIT' | 'COPY' }) {
  const { mode } = props;
  const { presentationId } = useParams<{ presentationId?: string }>();
  const { state: baseInfo } = useLocation();
  const [_, forceUpdate] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // canvas state는 한번 설정되면 변경되지 않는다.
  const [canvas, setCanvas] = useState<CanvasObject>(null);

  /**
   * canvas 초기화
   *
   * 1. presentationId가 존재하면 이미 존재하는 프레젠테이션을 수정하는 것이므로,
   *    해당 프레젠테이션을 서버에서 가져와 canvas에 임포트한다.
   * 2. presentationId가 존재하지 않으면 새로운 프레젠테이션을 생성하는 것이므로,
   *    기본 정보를 바탕으로 새로운 workarea를 생성한다.
   *
   * @author 오지민 2023.01.22
   */
  useEffect(() => {
    const canvas = new CanvasObject({
      containerEl: containerRef.current,
      element: canvasRef.current,
      updateFn: () => forceUpdate((prev) => prev + 1),
    });
    console.log(mode);
    if (mode === 'ADD') {
      (async () => {
        const workarea = new WorkArea()
          .apply('id', null)
          .apply('name', baseInfo.name)
          .apply('desc', baseInfo.desc)
          .apply('width', baseInfo.width)
          .apply('height', baseInfo.height)
          .apply('ratio', baseInfo.ratio)
          .apply('orientation', baseInfo.orientation)
          .apply('fill', '#ffffff');
        canvas.add(workarea);
        canvas.undoRedoHandler.resetStack();
        setCanvas(canvas);
      })();
    }
    if (mode === 'EDIT') {
      getPresentation(presentationId)
        .then((data) => canvas.presentationHandler.importRawPresentation(data))
        .then(() => canvas.undoRedoHandler.resetStack())
        .then(() => setCanvas(canvas))
        .catch((error) => console.log(error));
    }
    if (mode === 'COPY') {
      getPresentation(presentationId)
        .then((data) => {
          delete data.id;
          canvas.presentationHandler.importRawPresentation(data);
        })
        .then(() => canvas.undoRedoHandler.resetStack())
        .then(() => setCanvas(canvas))
        .catch((error) => console.log(error));
    }

    return () => {
      canvas.eventHandler.cleanUp();
      ImageLoader.invalidateAllCaches();
    }; // 페이지에서 다른 페이지로 갈 때 cleanUp하고 사라짐
  }, []);

  /**
   * react-router v6.7.0용 라우트 이탈 방지
   *
   * @author 오지민 2023.03.05
   */
  {
    const navigate = useNavigate();
    const modalCtrl = useModal();
    const [doNavigate, setDoNavigate] = useState(false);
    const blocker = unstable_useBlocker(() => {
      modalCtrl.open(
        <Confirm id='app-showmessagebox.out' onConfirmed={() => setDoNavigate(true)} />
      );
      return true;
    });
    useEffect(() => {
      if (!doNavigate) return;
      blocker.proceed();
      navigate(blocker.location.pathname);
    }, [doNavigate]);
  }

  return (
    <Container>
      <CanvasContainer tabIndex={0} ref={containerRef}>
        <canvas ref={canvasRef} style={{ transition: '700ms' }} />
      </CanvasContainer>
      {canvas !== null ? (
        <>
          <GlobalToolbar canvas={canvas} />
          <Toolbar canvas={canvas} />
          <Layer canvas={canvas} />
          <PanelTab canvas={canvas} />
          <ZoomTool canvas={canvas} />
        </>
      ) : null}
    </Container>
  );
}
