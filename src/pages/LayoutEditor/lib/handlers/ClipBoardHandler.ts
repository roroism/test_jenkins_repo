import { cloneDeep } from '@app/src/utils';
import { RawPresentationRegion } from '@cublick/parser/models';
import { Handler } from './Handler';

/**
 * 클립보드를 관리하는 핸들러, 복사, 잘라내기, 붙여넣기를 관리한다.
 *
 * @author 오지민 2023.02.16
 * @warning 이 클래스틑 큐브릭랜더러 및 PresentationHandler에 의존함.
 */
export class ClipboardHandler extends Handler {
  /**
   * 내부 클립보드, 오브젝트에서 export한 Region정보를 저장한다.
   *
   * @author 오지민 2023.02.16
   */
  private _clipBoard: RawPresentationRegion | null = null;
  /**
   * 1. 클립보드에 복사, 잘라내기, 붙여넣기를 할때 사용되는 락
   * 2. 붙여넣기가 비동기적으로 실행되기 때문에, 붙여넣기가 실행되는 도중에 다른 클립보드작업이 일어나면 혼선이 생기므로,
   *   락을 걸어서 붙여넣기가 끝날때까지 다른 클립보드작업을 막는다.
   *
   * @author 오지민 2023.03.01
   */
  private _lock: boolean = false;

  /**
   * 선택된 오브젝트를 복사한다.
   *
   * 1. 복사한 오브젝트는 내부 클립보드에 저장한다.
   * 2. 선택된 오브젝트가 없을경우 복사되지 않는다.
   * 3. 여러 오브젝트가 선택되어 있는 경우 복사되지 않는다.
   *
   * @author 오지민 2023.02.16
   */
  public copy = () => {
    if (this._lock) return;
    const activeObject = this._canvas.getActiveObject();
    if (!activeObject) return;
    this._clipBoard = this._canvas.presentationHandler.exportRegion(activeObject);
  };

  /**
   * 선택된 오브젝트를 잘라낸다.
   *
   * 1. 잘라낸 오브젝트는 내부 클립보드에 저장한다.
   * 2. 선택된 오브젝트가 없을경우 잘라내지 않는다.
   * 3. 여러 오브젝트가 선택되어 있는 경우 잘라내지 않는다.
   *
   * @author 오지민 2023.02.16
   */
  public cut = () => {
    if (this._lock) return;
    const activeObject = this._canvas.getActiveObject();
    if (!activeObject) return;
    this._clipBoard = this._canvas.presentationHandler.exportRegion(activeObject);
    this._canvas.remove(activeObject);
  };

  /**
   * 복사해둔 오브젝트를 붙여넣는다. 내부 클립보드에 복사된 오브젝트가 없을 경우 아무것도 하지 않는다.
   *
   * @author 오지민 2023.02.16
   */
  public paste = async () => {
    if (this._lock) return;
    this._lock = true;
    if (!this._clipBoard) return;
    this._canvas.discardActiveObject();
    this._clipBoard.x = this._clipBoard.x + 10;
    this._clipBoard.y = this._clipBoard.y + 10;
    await this._canvas.presentationHandler.importRegion(this._clipBoard);
    this._canvas.setActiveObject(this._canvas.getObjects().at(-1));
    this._clipBoard = cloneDeep(this._clipBoard);
    this._lock = false;
  };
}
