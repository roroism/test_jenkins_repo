import { fabric } from 'fabric';
import { Category } from '../../LayoutEditorMain/GlobalToolbar/DesignPropertyDialog';
import { RawPresentation } from '@cublick/parser/models';

export class WorkArea extends fabric.Rect {
  public type: 'WORKAREA' = 'WORKAREA';
  public id: string;
  public name: string;
  public desc: string;
  public fill: string;
  public tags: string[] = [];
  public categories: Category[] = [];
  public styles: { styleId: string; styleName: string }[] = [];
  public moods: { moodId: string; moodName: string }[] = [];
  /**
   * number:number
   */
  public ratio: string;
  public orientation: 'LANDSCAPE' | 'PORTRAIT';
  public assetList: RawPresentation['assetList'];

  constructor(options?: fabric.IRectOptions) {
    super(options);
    this.selectable = false;
    this.hoverCursor = 'default';
    this.shadow = new fabric.Shadow({
      color: 'rgba(0,0,0,0.2)',
      blur: 10,
    });
  }

  /**
   * 이미지 오브젝트의 속성을 변경하는 함수
   *
   * @author 오지민 2023.03.02
   * @param key 변경하려고 하는 키
   * @param value 변경하려고 하는 값
   * @returns this
   * @warning fabric에서 제공하는 set함수 대신 이 함수를 사용해야한다.
   */
  public apply<K extends keyof this>(key: K, value: this[K] | ((value: this[K]) => this[K])) {
    if (!value) return this;
    this[key] = value instanceof Function ? value(this[key]) : value;
    this.dirty = true;
    return this;
  }

  /**
   * 오브젝트 내부의 변경사항을 적용하는 함수, 캔버스의 이벤트를 발생시키고, 모든 오브젝트를 다시 랜더링한다.
   *
   * @author 오지민 2023.03.02
   */
  public commit() {
    this.canvas.fire('object:modified');
    this.canvas.renderAll();
  }
}
