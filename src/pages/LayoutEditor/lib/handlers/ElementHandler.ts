import { FabricObject } from '../objects/fabric.object';
import { WorkArea } from '../objects/fabric.workarea';
import { Handler } from './Handler';

/**
 * 오브젝트를 조작하는 핸들러
 *
 * 1. 모든 오브젝트에 적용되는 동작을 정의한다.
 * 2. 특정 오브젝트만의 고유기능이나 속성의 변경은 해당 오브젝트의 클래스에 정의되어 있다.
 *
 * @author 오지민 2023.02.20
 */
export class ElementHandler extends Handler {
  /**
   * 캐싱된 작업영역, getWorkArea()를 통해서 캐싱되고 접근된다.
   */
  private _workarea: WorkArea;

  /**
   * 오브젝트가 작업영역을 가득채우도록 한다.
   *
   * 1. 파라미터로 넘겨준 오브젝트를 fill한다.
   * 2. 파라미터로 아무것도 넘기지 않을 경우에는 현재 선택된 오브젝트를 fill한다.
   * 3. 선택된 오브젝트도 없을 경우에는 아무것도 하지 않는다.
   * 4. 작업영역이 없을 경우에는 아무것도 하지 않는다.
   *
   * @author 오지민 2023.02.20
   * @param object fill할 오브젝트
   */
  public fill(object?: FabricObject) {
    const activeObject = object || this._canvas.getActiveObject();
    if (!activeObject) return;
    const workarea = this.getWorkArea();
    if (!workarea) return;
    activeObject.setOptions({
      top: 0,
      left: 0,
      scaleX: workarea.width / activeObject.width,
      scaleY: workarea.height / activeObject.height,
    });
    this._canvas.renderAll();
    this._canvas.fire('object:modified');
  }

  /**
   * 오브젝트가 작업영역의 가로를 가득채우도록 한다.
   *
   * 1. 파라미터로 넘겨준 오브젝트를 가로로 가득채운다.
   * 2. 파라미터로 아무것도 넘기지 않을 경우에는 현재 선택된 오브젝트를 가로로 가득채운다.
   * 3. 선택된 오브젝트도 없을 경우에는 아무것도 하지 않는다.
   * 4. 작업영역이 없을 경우에는 아무것도 하지 않는다.
   *
   * @author 오지민 2023.02.20
   * @param object 가로로 가득채울 오브젝트
   */
  public fitX(object?: FabricObject) {
    const activeObject = object || this._canvas.getActiveObject();
    if (!activeObject) return;
    const workarea = this.getWorkArea();
    if (!workarea) return;
    activeObject.setOptions({
      left: 0,
      scaleX: workarea.width / activeObject.width,
    });
    this._canvas.renderAll();
    this._canvas.fire('object:modified');
  }

  /**
   * 오브젝트가 작업영역의 세로로 가득채우도록 한다.
   *
   * 1. 파라미터로 넘겨준 오브젝트를 세로로 가득채운다.
   * 2. 파라미터로 아무것도 넘기지 않을 경우에는 현재 선택된 오브젝트를 세로로 가득채운다.
   * 3. 선택된 오브젝트도 없을 경우에는 아무것도 하지 않는다.
   * 4. 작업영역이 없을 경우에는 아무것도 하지 않는다.
   *
   * @author 오지민 2023.02.20
   * @param object 세로로 가득채울 오브젝트
   */
  public fitY(object?: FabricObject) {
    const activeObject = object || this._canvas.getActiveObject();
    if (!activeObject) return;
    const workarea = this.getWorkArea();
    if (!workarea) return;
    activeObject.setOptions({
      top: 0,
      scaleY: workarea.height / activeObject.height,
    });
    this._canvas.renderAll();
    this._canvas.fire('object:modified');
  }

  /**
   * 오브젝트가 작업영역의 중심으로 이동시킨다.
   *
   * 1. 파라미터로 넘겨준 오브젝트를 이동시킨다.
   * 2. 파라미터로 아무것도 넘기지 않을 경우에는 현재 선택된 오브젝트를 이동시킨다.
   * 3. 선택된 오브젝트도 없을 경우에는 아무것도 하지 않는다.
   * 4. 작업영역이 없을 경우에는 아무것도 하지 않는다.
   *
   * @author 오지민 2023.02.20
   * @param object 중심으로 이동시킬 오브젝트
   */
  public center(options: 'horizontal' | 'vertical' | 'all', object?: FabricObject) {
    const activeObject = object || this._canvas.getActiveObject();
    if (!activeObject) return;
    const workarea = this.getWorkArea();
    if (!workarea) return;
    if (options === 'all') {
      activeObject.setOptions({
        left: workarea.width / 2 - activeObject.getScaledWidth() / 2,
        top: workarea.height / 2 - activeObject.getScaledHeight() / 2,
      });
    }
    if (options === 'horizontal' || options === 'all') {
      activeObject.setOptions({
        left: workarea.width / 2 - activeObject.getScaledWidth() / 2,
      });
    }
    if (options === 'vertical' || options === 'all') {
      activeObject.setOptions({
        top: workarea.height / 2 - activeObject.getScaledHeight() / 2,
      });
    }
    this._canvas.renderAll();
    this._canvas.fire('object:modified');
  }

  /**
   * 작업영역을 반환한다.
   *
   * 1. 작업영역이 존재할 경우에는 캐싱된 작업영역을 반환한다.
   * 2. 작업영역이 존재하지 않을 경우에는 캔버스에서 작업영역을 찾아서 캐싱하고 반환한다.
   * 3. 작업영역이 존재하지 않을 경우에는 undefined를 반환한다.
   *
   * @author 오지민 2023.02.20
   * @returns 작업영역 오브젝트
   */
  public getWorkArea() {
    if (this._workarea) return this._workarea;
    const workarea = this._canvas.getObjects().find((o): o is WorkArea => o.type === 'WORKAREA');
    this._workarea = workarea;
    return workarea;
  }

  /**
   * 오브젝트가 잠겨있다면 잠금을 풀고, 잠겨있지 않다면 잠금을 건다. (토글한다.)
   *
   * 1. 파라미터로 넘겨준 오브젝트의 잠금을 토글한다.
   * 2. 파라미터로 넘겨준 오브젝트가 없는 경우, 선택된 오브젝트의 잠금을 토글한다.
   * 3. 선택된 오브젝트가 activeSelection인 경우 아무것도 하지 않는다.
   * 4. 선택된 오브젝트도 없는 경우에는 아무것도 하지 않는다.
   *
   * undoRedoHandler.save를 호출하여 현재상태를 기록한다.
   *
   * @author 오지민 2023.02.18
   * @param object 잠금을 토글할 오브젝트
   */
  public toggleLock = (object?: FabricObject) => {
    const targetObject = object || this._canvas.getActiveObject();
    if (!targetObject) return;
    targetObject.setOptions({
      lockMovementX: !targetObject.lockMovementX,
      lockMovementY: !targetObject.lockMovementY,
      lockRotation: !targetObject.lockRotation,
      lockScalingX: !targetObject.lockScalingX,
      lockScalingY: !targetObject.lockScalingY,
      hasControls: !targetObject.hasControls,
      hoverCursor: targetObject.hoverCursor === 'default' ? null : 'default',
    });
    this._canvas.renderAll();
  };

  /**
   * 오브젝트를 잠궈 움직이지 못하도록 한다.
   *
   * 1. 파라미터로 넘겨준 오브젝트를 잠근다.
   * 2. 파라미터로 넘겨준 오브젝트가 없는 경우, 선택된 오브젝트를 잠근다.
   * 3. 선택된 오브젝트가 activeSelection인 경우 아무것도 하지 않는다.
   * 4. 선택된 오브젝트도 없는 경우에는 아무것도 하지 않는다.
   *
   * undoRedoHandler.save를 호출하여 현재상태를 기록한다.
   *
   * @author 오지민 2023.02.18
   * @param object 잠금을 걸 오브젝트
   */
  public lock = (object?: FabricObject) => {
    const targetObject = object || this._canvas.getActiveObject();
    if (!targetObject) return;
    if (targetObject.hasControls) this.toggleLock();
  };

  /**
   * 오브젝트의 잠금을 해제한다.
   *
   * 1. 파라미터로 넘겨준 오브젝트의 잠금을 해제한다.
   * 2. 파라미터로 넘겨준 오브젝트가 없는 경우, 선택된 오브젝트의 잠금을 해제한다.
   * 3. 선택된 오브젝트가 activeSelection인 경우 아무것도 하지 않는다.
   * 4. 선택된 오브젝트도 없는 경우에는 아무것도 하지 않는다.
   *
   * undoRedoHandler.save를 호출하여 현재상태를 기록한다.
   *
   * @author 오지민 2023.02.18
   * @param object 잠금을 해제할 오브젝트
   */
  public unlock = (object?: FabricObject) => {
    const targetObject = object || this._canvas.getActiveObject();
    if (!targetObject) return;
    if (!targetObject.hasControls) this.toggleLock();
  };

  /**
   * 오브젝트의 zOrder를 바꾸어 1단계 위로 올린다.
   *
   * 1. 파라미터로 넘겨준 오브젝트를 1단계 위로 올린다.
   * 2. 파라미터로 넘겨준 오브젝트가 없는 경우, 선택된 오브젝트나 activeSelection을 1단계 위로 올린다.
   * 3. 파라미터로 선택된 오브젝트도 없는 경우에는 아무것도 하지 않는다.
   * 4. 오브젝트가 최상단에 있을 경우 아무것도 하지 않는다.
   *
   * z-index를 변경하는 것은 오브젝트를 변경하는 것이 아니므로 오브젝트 변경 이벤트가 발생하지 않기에,
   * undoRedoHandler.save를 호출하여 현재상태를 기록한다.
   *
   * @author 오지민 2023.02.16
   * @param object 순서를 변경할 오브젝트
   * @chainable
   */
  public bringForward = (object?: FabricObject, intersecting: boolean = true) => {
    const targetObject = object || this._canvas.getActiveObject();
    if (!targetObject) return;
    if (targetObject === this._canvas.getObjects().at(-1)) return;
    this._canvas.bringForward(targetObject, intersecting);
    this._canvas.fire('object:modified');
    return this._canvas;
  };

  /**
   * 오브젝트의 zOrder를 바꾸어 1단계 아래로 내린다.
   *
   * 1. 파라미터로 넘겨준 오브젝트를 1단계 아래로 내린다.
   * 2. 파라미터로 넘겨준 오브젝트가 없는 경우, 선택된 오브젝트나 activeSelection을 1단계 아래로 내린다.
   * 3. 파라미터로 선택된 오브젝트도 없는 경우에는 아무것도 하지 않는다.
   * 4. 오브젝트는 WorkArea보다 아래로 내려갈 수 없다.
   *
   * z-index를 변경하는 것은 오브젝트를 변경하는 것이 아니므로 오브젝트 변경 이벤트가 발생하지 않기에,
   * undoRedoHandler.save를 호출하여 현재상태를 기록한다.
   *
   * @author 오지민 2023.02.16
   * @param object 순서를 변경할 오브젝트
   * @chainable
   */
  public sendBackwards = (object?: FabricObject, intersecting: boolean = true) => {
    const targetObject = object || this._canvas.getActiveObject();
    if (!targetObject) return;
    if (targetObject === this._canvas.getObjects()[1]) return;
    this._canvas.sendBackwards(targetObject, intersecting);
    this._canvas.fire('object:modified');
    return this._canvas;
  };

  /**
   * moveTo함수에 undoRedo저장기능을 추가, 사용방법은 fabric.Cavnas.moveTo와 동일하다.
   *
   * z-index를 변경하는 것은 오브젝트를 변경하는 것이 아니므로 오브젝트 변경 이벤트가 발생하지 않기에,
   * undoRedoHandler.save를 호출하여 현재상태를 기록한다.
   *
   * @author 오지민 2023.02.16
   * @usecase Layer에서 드래그앤 드랍으로 순서를 변경할 경우에 사용됨
   * @param object zOrder를 변경할 오브젝트
   * @param index zOrder 설정 값
   * @chainable
   */
  public moveTo = (object: FabricObject, index: number) => {
    if (!object) return;
    if (this._canvas.getObjects().indexOf(object) === index) return;
    this._canvas.moveTo(object, index);
    this._canvas.fire('object:modified');
    return this._canvas;
  };

  /**
   * offset에 따라 오브젝트의 zOrder를 변경한다.
   *
   * @author 오지민 2023.02.16
   * @param offset order를 변경할 양
   * @param object order를 변경할 오브젝트
   */
  public moveByOffset = (offset: number, object?: FabricObject) => {
    if (offset === 0) return;
    const targetObject = object || this._canvas.getActiveObject();
    if (!targetObject) return;
    const objects = this._canvas.getObjects();
    const index = objects.indexOf(object);
    if (index + offset < 1) return;
    if (index + offset > objects.length - 1) return;
    this.moveTo(object, index + offset);
  };

  /**
   * 오브젝트를 회전시킨다.
   *
   * 1. 파라미터로 넘겨준 오브젝트를 회전시킨다.
   * 2. 파라미터로 넘겨준 오브젝트가 없는 경우, 선택된 오브젝트를 회전시킨다.
   * 3. 선택된 오브젝트가 activeSelection인 경우 아무것도 하지 않는다.
   * 4. 선택된 오브젝트도 없는 경우에는 아무것도 하지 않는다.
   *
   * @author 오지민 2023.02.26
   * @param deg 회전각도 (deg, not radian)
   * @param object 회전시킬 오브젝트
   */
  public rotate = (deg: number, object?: FabricObject) => {
    const targetObject = object || this._canvas.getActiveObject();
    if (!targetObject) return;
    targetObject.rotate(targetObject.angle + deg);
    this._canvas.fire('object:modified');
    this._canvas.renderAll();
  };
}
