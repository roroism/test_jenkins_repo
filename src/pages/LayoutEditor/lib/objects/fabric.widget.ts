import { RawPresentationWidgetRegionProperties } from '@cublick/parser/models';
import { fabric } from 'fabric';
import { CanvasObject } from './fabric.canvas';
import { IFabricObject } from './fabric.object';
import { RawPresentation } from '@cublick/parser/models';
import { WidgetInstance } from '@app/src/apis/widget/widgetApi.model';

export class WidgetObject extends fabric.Image implements IFabricObject {
  public type: 'WIDGET' = 'WIDGET';
  /** Caption of region. */
  public caption: string = '';
  /** Region alpha (transparency, 0 - 255) */
  public alpha: number = 255;
  /** Widget instant ID. */
  public id: string;
  /** Widget instant name. */
  public name: string = '';
  /**
   * Stringified object of widget instant data.
   * @dependent widgetApi.modelt.ts에 정의되어 있는 WidgetInstance타입
   */
  public data: string;
  /** 오브젝트가 속해있는 캔버스 ( 타입추론를 위해 필요함 ) */
  public canvas: CanvasObject;

  // lock setter getter
  public get lock(): boolean {
    return this.lockMovementX;
  }
  public set lock(value: boolean) {
    this.set('lockMovementX', value);
    this.set('lockMovementY', value);
    this.set('lockRotation', value);
    this.set('lockScalingX', value);
    this.set('lockScalingY', value);
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

  /**
   * 위젯 오브젝트의 속성을 Properties 형태로 반환하는 함수
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationTextRegionProperties
   * @warning 이 함수의 리턴타입은 큐브릭랜더러에 의존함.
   */
  public toProperties(): RawPresentationWidgetRegionProperties {
    return {
      id: this.id,
      name: this.name,
      data: this.data,
      caption: this.caption,
      alpha: this.alpha,
    };
  }

  /**
   * WidgetObject를 AssetList형태로 변환하는 함수
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationAssetList의 일부분
   * @warning 이 함수의 반환타입은 큐브릭랜더러에 의존함.
   * @usecase presentationHandler, 캔버스에서 프레젠테이션을 추출(export)할 때 사용
   */
  public toAssetList = (): RawPresentation['assetList'] => {
    const widgetInstance = JSON.parse(this.data) as WidgetInstance;
    return widgetInstance?.assets || [];
  };
}
