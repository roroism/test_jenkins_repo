import { debounce, isCtrlOrCmd } from '@app/src/utils';
import { fabric } from 'fabric';
import { CanvasObject } from '../objects/fabric.canvas';
import { Handler } from './Handler';

/**
 * 캔버스에서 발생하는 모든 이벤트를 통합관리하는 클래스
 *
 * 1. 캔버스자체에서 이벤트가 발생하는 경우 ( ex: ondrop, onkeydown, onmousewheel 등 )
 * 2. 캔버스위에 올라가있는 오브젝트에서 이벤트가 발생하는 경우 ( 오브젝트의 추가, 속성변경, 삭제 등 )
 * 3. 캔버스를 감싸고 있는 컨테이너에서 이벤트가 발생하는 경우 ( onresize )
 *
 * @author 오지민 2023.02.16
 */
export class EventHandler extends Handler {
  private _lastPosX: number;
  private _lastPosY: number;
  private _isDragging: boolean;
  private _resizeObserver: ResizeObserver;
  private _interactionMode: 'SELECT' | 'HAND';

  /**
   * EventHandler의 생성자
   *
   * 1. 캔버스에 이벤트 핸들러를 등록한다.
   * 2. 캔버스 컨테이너의 크기가 변경되는 경우 캔버스의 크기를 변경하는 핸들러를 등록한다.
   * 3. 윈도우객체에 키다운이벤트 핸들러를 등록한다.
   *
   * @author 오지민 2023.02.16
   * @param canvas 이벤트 핸들러를 등록할 캔버스
   */
  constructor(canvas: CanvasObject) {
    super(canvas);
    this._isDragging = false;
    this._interactionMode = 'SELECT';
    this._resizeObserver = new ResizeObserver(([container]) => this.onContainerResize(container));
    this._resizeObserver.observe(this._canvas.containerEl);

    this._canvas.on('drop', this.onDrop);
    this._canvas.on('object:added', this.onObjectAdded);
    this._canvas.on('object:modified', this.onObjectModified);
    this._canvas.on('object:bulk_removed', this.onObjectBulkRemoved);
    this._canvas.on('selection:created', this.onSelectionCreated);
    this._canvas.on('selection:updated', this.onSelectionUpdated);
    this._canvas.on('selection:cleared', this.onSelectionCleared);
    this._canvas.on('mouse:wheel', this.onMouseWheel);
    this._canvas.on('mouse:down', this.onMouseDown);
    this._canvas.on('mouse:move', this.onMouseMove);
    this._canvas.on('mouse:up', this.onMouseUp);

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  /**
   * EventHandler의 소멸자
   *
   * 1. 캔버스에 등록된 이벤트 핸들러를 해제한다.
   * 2. 캔버스 컨테이너의 크기가 변경되는 경우 캔버스의 크기를 변경하는 핸들러를 해제한다.
   * 3. 윈도우객체에 키다운이벤트 핸들러를 해제한다.
   *
   * @usecase 리엑트쪽에서 에디터의 마운트가 해제되었을 경우 호출된다.
   * @author 오지민 2023.02.16
   */
  public cleanUp = () => {
    this._resizeObserver.disconnect();
    this._canvas.removeListeners();

    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  };

  // getter setter -----------------------------------------------------
  public get interactionMode() {
    return this._interactionMode;
  }
  public setInteractionMode = (mode: 'SELECT' | 'HAND') => {
    this._interactionMode = mode;
    this._canvas.selection = mode === 'SELECT';
    this._canvas.updateFn();
  };

  //event handlers -----------------------------------------------------
  private onMouseDown = (e: fabric.IEvent<MouseEvent>) => {
    this._isDragging = true;
    this._lastPosX = e.e.clientX;
    this._lastPosY = e.e.clientY;
  };

  private onMouseMove = (e: fabric.IEvent<MouseEvent>) => {
    if (this._interactionMode === 'HAND' && this._isDragging) {
      const vpt = this._canvas.viewportTransform;
      vpt[4] += e.e.clientX - this._lastPosX;
      vpt[5] += e.e.clientY - this._lastPosY;
      this._canvas.setViewportTransform(vpt);
    }
    this._lastPosX = e.e.clientX;
    this._lastPosY = e.e.clientY;
  };

  private onMouseUp = (e: fabric.IEvent<MouseEvent>) => {
    this._isDragging = false;
  };

  private onDrop = (e: fabric.IEvent<MouseEvent>) => {
    this._canvas.onDrop(e.e as DragEvent);
  };

  private onObjectAdded = (e: fabric.IEvent<MouseEvent>) => {
    this._canvas.undoRedoHandler.save();
    this._canvas.updateFn();
  };

  private onObjectModified = (e: fabric.IEvent<MouseEvent>) => {
    this._canvas.undoRedoHandler.save();
    this._canvas.updateFn();
  };

  private onObjectBulkRemoved = (e: fabric.IEvent<MouseEvent>) => {
    this._canvas.undoRedoHandler.save();
    this._canvas.updateFn();
  };

  private onSelectionCreated = (e: fabric.IEvent<MouseEvent>) => {
    this._canvas.updateFn();
  };

  private onSelectionUpdated = (e: fabric.IEvent<MouseEvent>) => {
    this._canvas.updateFn();
  };

  private onSelectionCleared = (e: fabric.IEvent<MouseEvent>) => {
    this._canvas.updateFn();
  };

  private onMouseWheel = (e: fabric.IEvent<WheelEvent>) => {
    e.e.preventDefault();
    e.e.stopPropagation();
    const oldZoom = this._canvas.getZoom();
    const newZoom = oldZoom * 0.999 ** e.e.deltaY;
    this._canvas.zoomHandler.zoomToPoint({ x: e.e.offsetX, y: e.e.offsetY }, newZoom);
    this._canvas.lazyUpdateFn();
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (this.isShortcut(e, 'ctrl+shift+KeyZ')) {
      this._canvas.undoRedoHandler.redo();
      return;
    }
    if (this.isShortcut(e, 'ctrl+shift+KeyF')) {
      this._canvas.elementHandler.bringForward();
      return;
    }
    if (this.isShortcut(e, 'ctrl+shift+KeyB')) {
      this._canvas.elementHandler.sendBackwards();
      return;
    }
    if (this.isShortcut(e, 'ctrl+shift+Minus')) {
      this._canvas.zoomHandler.zoom(-1, 'BIG');
      return;
    }
    if (this.isShortcut(e, 'ctrl+shift+Equal')) {
      this._canvas.zoomHandler.zoom(1, 'BIG');
      return;
    }
    if (this.isShortcut(e, 'ctrl+alt+Minus')) {
      this._canvas.zoomHandler.zoom(-1, 'SMALL');
      return;
    }
    if (this.isShortcut(e, 'ctrl+alt+Equal')) {
      this._canvas.zoomHandler.zoom(1, 'SMALL');
      return;
    }
    if (this.isShortcut(e, 'ctrl+KeyZ')) {
      this._canvas.undoRedoHandler.undo();
      return;
    }
    if (this.isShortcut(e, 'ctrl+KeyY')) {
      this._canvas.undoRedoHandler.redo();
      return;
    }
    if (this.isShortcut(e, 'ctrl+Minus')) {
      this._canvas.zoomHandler.zoom(-1, 'NORMAL');
      return;
    }
    if (this.isShortcut(e, 'ctrl+Equal')) {
      this._canvas.zoomHandler.zoom(1, 'NORMAL');
      return;
    }
    if (this.isShortcut(e, 'ctrl+KeyC')) {
      this._canvas.clipboardHandler.copy();
      return;
    }
    if (this.isShortcut(e, 'ctrl+KeyV')) {
      this._canvas.clipboardHandler.paste();
      return;
    }
    if (this.isShortcut(e, 'ctrl+KeyX')) {
      this._canvas.clipboardHandler.cut();
      return;
    }
    // TODO: 정말로 이게 딜리트가 맞는지 확인필요
    if (this.isShortcut(e, 'Delete')) {
      this._canvas.remove();
      return;
    }
    if (this.isShortcut(e, 'ctrl+Backspace')) {
      this._canvas.remove();
      return;
    }
    if (this.isShortcut(e, 'Space')) {
      this.setInteractionMode('HAND');
      return;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    if (this.isShortcut(e, 'Space')) {
      this.setInteractionMode('SELECT');
      return;
    }
  };

  private onContainerResize = debounce((wrapper: ResizeObserverEntry) => {
    const { width, height } = wrapper.contentRect;
    const workarea = this._canvas.getObjects().find((object) => object.type === 'WORKAREA');
    if (!workarea) return console.log('workarea가 존재하지 않아 리사이즈를 진행하지 않습니다.');
    this._canvas.setWidth(width);
    this._canvas.setHeight(height);
    this._canvas.zoomHandler.zoomToSelection(workarea);
  }, 300);

  // event helper  ---------------------------------------------------------------
  /**
   * 해당 키보드 이벤트가 특정 단축키를 포함하고 있는지 아닌지 확인하여 이벤트 핸들러를 호출하는 함수
   *
   * @author 오지민 2023.02.24
   * @example
   * this.checkShortCut(e, 'ctrl+Equal', () => zoom(0.1));
   * this.checkShortCut(e, 'ctrl+alt+Equal', () => zoom(0.01));
   * this.checkShortCut(e, 'ctrl+shift+Equal', () => zoom(0.5));
   * this.checkShortCut(e, 'ctrl+Minus', () => zoom(0.1));
   * this.checkShortCut(e, 'ctrl+alt+Minus', () => zoom(0.01));
   * this.checkShortCut(e, 'ctrl+shift+Minus', () => zoom(0.5));
   *
   * @param e 확인할 이벤트
   * @param shortcut 지정한 단축키
   * @param listener 단축키가 입력되었을 때 실행할 함수
   * @deprecated ctrl+shift+KeyZ와 ctrl+KeyZ를 구분할 방법이 없음
   */
  private checkShortCut = (
    e: KeyboardEvent,
    shortcut: string,
    listener: (this: Window, ev: KeyboardEvent) => any
  ) => {
    if (this.isShortcut(e, shortcut)) listener.call(window, e);
  };

  /**
   * 해당 키보드 이벤트가 특정 단축키를 포함하고 있는지 아닌지 확인하는 함수
   *
   * @author 오지민 2023.02.24
   * @example
   * this.isShortCut(e, 'ctrl+Equal');
   * this.isShortCut(e, 'ctrl+alt+Equal');
   * this.isShortCut(e, 'ctrl+shift+Equal');
   * this.isShortCut(e, 'ctrl+Minus');
   * this.isShortCut(e, 'ctrl+alt+Minus');
   * this.isShortCut(e, 'ctrl+shift+Minus');
   *
   * @param e 확인할 이벤트
   * @param shortcut 지정한 단축키
   */
  private isShortcut = (e: KeyboardEvent, shortcut: string) => {
    const keys = shortcut.split('+').map((key) => key.trim());
    if (keys.includes('ctrl') && !isCtrlOrCmd(e)) return false;
    if (keys.includes('alt') && !e.altKey) return false;
    if (keys.includes('shift') && !e.shiftKey) return false;
    if (e.code !== keys.at(-1)) return false;
    return true;
  };
}
