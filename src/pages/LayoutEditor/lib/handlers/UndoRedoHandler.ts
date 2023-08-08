import { fabric } from 'fabric';
import { Handler } from './Handler';
import { RawPresentation } from '@cublick/parser/models';

type CanvasJSON = ReturnType<typeof fabric.Canvas.toJSON>;

/**
 * 캔버스의 현재상태를 저장하고, undo와 redo를 수행하는 클래스
 *
 * @author 오지민 2023.02.16
 * @dependency presentationHandler import / export 기능
 */
export class UndoRedoHandler extends Handler {
  private _undoStack: RawPresentation[] = [];
  private _current: RawPresentation;
  private _redoStack: RawPresentation[] = [];

  /**
   * save를 할 수 있는지 없는지를 나타내는 플래그
   *
   * @author 오지민 2023.02.16
   * @if_ture
   * 1. save함수가 호출되더라도 undoStack에 상태가 기록되지 않음
   * 2. undo함수가 호출되더라도 undo하지 않음
   * 3. redo함수가 호출되더라도 redo하지 않음
   */
  private _lock: boolean = false;

  /**
   * undo할 수 있는지 없는지를 나타내는 플래그
   *
   * @author 오지민 2023.02.19
   * @ture undoStack에 상태가 존재하거나 lock이 false인 경우
   * @false undoStack에 상태가 존재하지 않고 lock이 true인 경우
   */
  public get undoable() {
    return this._undoStack.length > 0 && !this._lock;
  }

  /**
   * redo할 수 있는지 없는지를 나타내는 플래그
   *
   * @author 오지민 2023.02.19
   * @ture redoStack에 상태가 존재하거나 lock이 false인 경우
   * @false redoStack에 상태가 존재하지 않고 lock이 true인 경우
   */
  public get redoable() {
    return this._redoStack.length > 0 && !this._lock;
  }

  /**
   * lockedBlock을 실행하고 그 결과를 반환
   *
   * 1. lockedBlock이 샐행되는 동안에는 save함수가 호출되더라도 undoStack에 상태가 기록되지 않음
   * 2. 의도치 않게 undoStacck에 상태가 기록되는 것을 방지하기 위해 사용
   *
   * @author 오지민 2023.02.16
   * @param lockedBlock save함수를 잠근 상태로 캔버스를 조작할 수 있는 함수
   * @returns lockedBlock의 실행결과
   * @usecase 이미지프레임을 먼저 캔버스에 올린 후에, 이미지를 이미지프레임 위에 올릴 경우에 사용
   */
  public lockArea = <F extends () => any>(lockedBlock: F) => {
    this._lock = true;
    const result = lockedBlock();
    this._lock = false;
    return result;
  };

  /**
   * 현재 상태를 undoStack에 저장
   *
   * @author 오지민 2023.02.16
   * @tip undo나 redo를 하여 캔버스를 이전상태로 되돌리고 있는 도중에 save함수가 호출될 경우 아무것도 하지 않음
   * @usecase eventHandler에서 오브젝트가 추가되거나 수정되는 경우에 호출됨
   * @returns
   */
  public save = () => {
    if (this._lock) return;
    this._undoStack.push(this._current);
    this._current = this._canvas.presentationHandler.exportRawPresentation();
    this._redoStack = [];
  };

  /**
   * undoStack에 저장되어 있는 이전 상태를 가져와서 캔버스에 반영함
   *
   * @author 오지민 2023.02.16
   * @tip undoStack이 비어있을 경우(= undo할 내용이 없는 경우)에는 아무것도 하지 않음
   * @returns
   */
  public undo = () => {
    // lock이 걸려있는 경우에는 아무것도 하지 않음
    if (this._lock) return;
    // 최초 상태는 undo할 수 없음(= 최초 상태에서 undo를 누르면 아무것도 하지 않음)
    // if (this._undoStack.length === 1) return;
    const objects = this._undoStack.pop();
    if (!objects) return;
    this._redoStack.push(this._current);
    this._current = objects;
    this.restore(objects);
  };

  /**
   * redoStack에 저장되어 있는 이후 상태를 가져와서 캔버스에 반영함
   *
   * @author 오지민 2023.02.16
   * @tip redoStack이 비어있는 경우(= redo할 내용이 없는 경우)에는 아무것도 하지 않음
   * @returns
   */
  public redo = () => {
    if (this._lock) return;
    const objects = this._redoStack.pop();
    if (!objects) return;
    this._undoStack.push(this._current);
    this._current = objects;
    this.restore(objects);
  };

  /**
   * undoStack, redoStack을 초기화함
   *
   * @author 오지민 2023.02.16
   * @usecase 프레젠테이션을 로드한 이후에 호출됨
   */
  public resetStack = () => {
    this._undoStack = [];
    this._current = this._canvas.presentationHandler.exportRawPresentation();
    this._redoStack = [];
  };

  /**
   * undo나 redo시 캔버스에 이전상태를 반영함
   *
   * @author 오지민 2023.02.16
   * @param fabricObjects 되돌린 결과, 캔버스에 생성되어야할 오브젝트들
   */
  private restore = (rawPresentation: RawPresentation) => {
    this._lock = true;
    this._canvas.clear();
    this._canvas.presentationHandler.importRawPresentation(rawPresentation).finally(() => {
      this._lock = false;
      this._canvas.updateFn();
    });
  };
}
