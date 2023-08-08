import { debounce } from '@app/src/utils';
import { fabric } from 'fabric';
import { ClipboardHandler } from '../handlers/ClipBoardHandler';
import { ElementHandler } from '../handlers/ElementHandler';
import { EventHandler } from '../handlers/EventHandler';
import { PresentationHandler } from '../handlers/PresentationHandler';
import { UndoRedoHandler } from '../handlers/UndoRedoHandler';
import { ZoomHandler } from '../handlers/ZoomHandler';
import { FabricObject } from './fabric.object';

const propertiesToIncludes = [
  'type',
  'selectable',
  'name',
  'element',
  'bold',
  'italic',
  'fileType',
  'md5',
  'mimeType',
  'name',
  'desc',
  'id',
  'mute',
  'repeat',
  'srcLink',
  'element',
];

interface CanvasRequired {
  element: HTMLCanvasElement;
  containerEl: HTMLElement;
  updateFn: () => void;
}

export class CanvasObject extends fabric.Canvas {
  public containerEl: HTMLElement;
  public updateFn: () => void;
  public lazyUpdateFn: () => void;
  public propertiesToIncludes = propertiesToIncludes;
  public eventHandler: EventHandler;
  public undoRedoHandler: UndoRedoHandler;
  public clipboardHandler: ClipboardHandler;
  public zoomHandler: ZoomHandler;
  public elementHandler: ElementHandler;
  public presentationHandler: PresentationHandler;

  constructor(required: CanvasRequired, options?: fabric.ICanvasOptions) {
    super(required.element, {
      ...options,
      width: 1,
      height: 1,
      preserveObjectStacking: true,
    });
    this.containerEl = required.containerEl;
    this.updateFn = required.updateFn;
    this.lazyUpdateFn = debounce(required.updateFn, 100);
    this.elementHandler = new ElementHandler(this);
    this.presentationHandler = new PresentationHandler(this);
    this.undoRedoHandler = new UndoRedoHandler(this);
    this.clipboardHandler = new ClipboardHandler(this);
    this.zoomHandler = new ZoomHandler(this);
    this.elementHandler = new ElementHandler(this);
    this.eventHandler = new EventHandler(this);
  }

  public getActiveObject() {
    return super.getActiveObject() as FabricObject;
  }

  public getActiveObjects() {
    return super.getActiveObjects() as FabricObject[];
  }

  public getObjects() {
    return this._objects as FabricObject[];
  }

  // handle new object addition & object deletion -----------------------------------------
  /**
   * 캔버스에 새로운 오브젝트를 추가하기 위해 드레그하고 있는 아이템
   *
   * @author 오지민 2023.02.16
   * @example 이미지, 비디오, 도형, 이미지프레임, 텍스트 등
   */
  _draggingItem: FabricObject = null;

  /**
   * 드레그를 시작하는 함수, 현재 드레그 아이템을 기록한다.
   *
   * @author 오지민 2023.02.16
   * @param item 캔버스에 새로운 오브젝트를 추가하기 위해 드레그하고 있는 아이템
   */
  public onDragStart = (item: FabricObject) => {
    this._draggingItem = item;
  };

  /**
   * 드레그중인 아이템을 드랍할 경우 호출되는 이벤트함수, 캔버스위에 오브젝트를 추가한다.
   *
   * @author 오지민 2023.02.16
   * @param e 아이템을 드랍할 때 발생하는 이벤트, 이름이 Drop가 아님에 주의
   */
  public onDrop = async (e: DragEvent) => {
    if (this._draggingItem === null) return console.log('onDrop', 'draggingItem is null');
    const targetObject = this.findTarget(e, true) as FabricObject;
    console.log('targetObject:', targetObject);
    console.log('this._draggingItem:', this._draggingItem);
    // 이미지위에 이미지를 드랍했을 경우, 이미지를 교체한다.
    if (targetObject?.type === 'IMAGE') {
      console.log('드롭한자리에이미지존재');
    }

    if (this._draggingItem.type === 'IMAGE') {
      console.log('드래그중인이미지');
    }

    if (
      targetObject?.type === 'IMAGE' && // 드롭한 자리에 이미지가 있으며,
      this._draggingItem.type === 'IMAGE' // 드래그중인 아이템이 이미지이고,
    ) {
      targetObject.replaceImage(this._draggingItem).commit();
      this._draggingItem = null;
      return;
    }
    console.log('타겟오브젝트쏘쓰타입', targetObject);
    console.log('드래깅아이템쏘쓰타입', this._draggingItem);

    // 이미지위에 이미지프레임을 드랍했을 경우, 이미지에 이미지프레임을 적용한다.
    if (
      targetObject?.type === 'IMAGE' && // 드롭한 자리에 이미지가 있으며,
      this._draggingItem.type === 'VECTOR_GRAPHIC' // 드래그중인 아이템이 이미지프레임이면
    ) {
      targetObject.applyImageFrame(this._draggingItem).commit();
      this._draggingItem = null;
      return;
    }

    // 이미지프레임위에 이미지를 드랍했을 경우, 이미지프레임에 이미지를 적용한다.
    if (
      targetObject?.type === 'VECTOR_GRAPHIC' && // 드롭한 자리에 이미지프레임이 있으며,
      this._draggingItem.type === 'IMAGE' // 드래그중인 아이템이 이미지이면
    ) {
      targetObject.applyImage(this._draggingItem, this).commit();
      this._draggingItem = null;
      return;
    }

    // 비디오위에 이미지프레임을 드랍했을 경우, 비디오에 이미지프레임을 적용한다.
    if (
      targetObject?.type === 'VIDEO' && // 드롭한 자리에 비디오가 있으며,
      this._draggingItem.type === 'VECTOR_GRAPHIC' // 드래그중인 아이템이 이미지프레임이면
    ) {
      targetObject.applyImageFrame(this._draggingItem).commit();
      this._draggingItem = null;
      return;
    }

    // 이미지프레임위에 비디오를 드랍했을 경우, 이미지프레임에 비디오를 적용한다.
    if (
      targetObject?.type === 'VECTOR_GRAPHIC' && // 드롭한 자리에 이미지프레임이 있으며,
      this._draggingItem.type === 'VIDEO' // 드래그중인 아이템이 비디오이면
    ) {
      targetObject.applyVideo(this._draggingItem, this).commit();
      this._draggingItem = null;
      return;
    }

    // 위의 모든 경우에 해당하지 않는 경우, 새로운 오브젝트를 추가한다.
    const { x: left, y: top } = this.getPointer(e);
    this._draggingItem.setOptions({ top, left });
    this.add(this._draggingItem);
    this._draggingItem = null;
  };

  /**
   * 캔버스에 랜더링된 오브젝트를 삭제하는 함수
   *
   * 1. 파라미터로 넘겨준 오브젝트들을 전부 삭제한다.
   * 2. 파라미터로 아무것도 넘기지 않을 경우에는 현재 선택된 오브젝트를 삭제한다.
   * 3. 선택된 오브젝트도 없을 경우에는 아무것도 하지 않는다.
   *
   * 이 함수는 원자적으로 처리되며, undoRedoHandler.undoStack에 하나의 처리단위로서 기록된다.
   *
   * @author 오지민 2023.02.16
   * @param objects 삭제하려고 하는 오브젝트들
   * @chainable
   */
  public remove = (...objects: fabric.Object[]) => {
    let targetObjects = objects;
    if (targetObjects.length === 0) targetObjects = this.getActiveObjects();
    if (targetObjects.length === 0) return;
    this.discardActiveObject();
    super.remove(...targetObjects);
    /**
     * object:removed를 호출하면 벌크삭제가 원자적으로 처리되지 않으므로,
     * object:bulk_removed을 호출한다.
     */
    this.fire('object:bulk_removed');
    return this;
  };
}
