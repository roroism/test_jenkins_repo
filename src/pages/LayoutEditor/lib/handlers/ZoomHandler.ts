import { Handler } from './Handler';

type ZoomStep = 'BIG' | 'NORMAL' | 'SMALL';

/**
 * 캔버스의 줌을 관리하는 핸들러, 캔버스의 줌을 변경하는 기능을 제공한다.
 *
 * @author 오지민 2023.02.19
 */
export class ZoomHandler extends Handler {
  private _zoomBigStep = 0.5;
  private _zoomStep = 0.1;
  private _zoomSmallStep = 0.01;
  /**
   * 캔버스의 최소 줌 레벨
   */
  private _zoomMin = 0.01;
  /**
   * 캔버스의 최대 줌 레벨
   */
  private _zoomMax = 10;

  // base functions, updateFn이 포함되지 않음 --------------------------------------
  /**
   * 캔버스의 특정 좌표를 기준으로 줌 레벨을 변경한다.
   *
   * @author 오지민 2023.02.19
   * @param point 줌을 변경할 기준점
   * @param zoom 변경할 줌 레벨
   */
  public zoomToPoint(point: fabric.IPoint, zoom: number) {
    const newZoom = this.normalizeZoom(zoom);
    this._canvas.zoomToPoint(point, newZoom);
  }

  /**
   * 캔버스의 중심을 기준으로 줌 레벨을 변경한다.
   *
   * @author 오지민 2023.02.19
   * @param zoom 변경할 줌 레벨
   */
  public zoomToCavnasCenter(zoom: number) {
    const { top, left } = this._canvas.getCenter();
    const center = { x: left, y: top };
    const newZoom = this.normalizeZoom(zoom);
    this._canvas.zoomToPoint(center, newZoom);
  }

  // helper functions, updateFn이 포함됨 -----------------------------------------
  /**
   * 캔버스의 중심을 기준으로 줌 스텝 * multiplier에 맞는 양만큼 줌
   *
   * @author 오지민 2023.02.19
   * @param multiplier 줌 스텝에 곱할 값
   * @param step 사전 정의된 줌 스텝
   */
  public zoom(multiplier: number, step: ZoomStep = 'NORMAL') {
    const oldZoom = this._canvas.getZoom();
    const newZoom = oldZoom + multiplier * this.getStep(step);
    this.zoomToCavnasCenter(newZoom);
    this._canvas.updateFn();
  }

  /**
   * 선택된 오브젝트를 확대하여 화면에 채운다.
   *
   * 1. 파라미터로 오브젝트가 넘어오면 해당 오브젝트를 확대한다.
   * 2. 파라미터로 오브젝트가 넘어오지 않으면 선택된 오브젝트를 확대한다.
   * 3. 활성화된 오브젝트가 없으면 아무것도 하지 않는다.
   *
   * @author 오지민 2023.02.19
   * @param object 크게 볼 오브젝트
   */
  public zoomToSelection(object?: fabric.Object) {
    const activeObject = object || this._canvas.getActiveObject();
    if (!activeObject) return;
    const centerPoint = activeObject.getCenterPoint();
    const newZoom =
      Math.min(this._canvas.width / activeObject.width, this._canvas.height / activeObject.height) *
      0.95;
    this._canvas.setZoom(newZoom);
    this._canvas.viewportTransform[4] = this._canvas.width / 2 - centerPoint.x * newZoom;
    this._canvas.viewportTransform[5] = this._canvas.height / 2 - centerPoint.y * newZoom;
    this._canvas.updateFn();
  }

  /**
   * 줌 레벨을 정규화한다.
   *
   * 줌 레벨은 최소 _zoomMin, 최대 _zoomMax로 제한한다.
   *
   * @author 오지민 2023.02.19
   * @param zoom 정규화할 줌 레벨
   * @returns 정규화된 줌 레벨
   */
  public normalizeZoom(zoom: number) {
    return Math.max(this._zoomMin, Math.min(this._zoomMax, zoom));
  }

  // private methods -------------------------------------------------------
  /**
   * 줌 스텝에 해당하는 숫자를 반환한다.
   *
   * @author 오지민 2023.02.19
   * @param step 문자열로 된 줌 스텝
   * @returns 줌 스텝에 해당하는 숫자
   */
  private getStep(step: ZoomStep) {
    let zoomStep = this._zoomStep;
    if (step === 'BIG') zoomStep = this._zoomBigStep;
    if (step === 'SMALL') zoomStep = this._zoomSmallStep;
    return zoomStep;
  }
}
