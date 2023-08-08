import { fabric } from 'fabric';
import { RawPresentationInputSourceRegionProperties } from '@cublick/parser/models';

/**
 * 인풋소스 오브젝트
 *
 * @author 오지민 2023.03.02
 * @warning set함수는 이 클래스 내부에서만 사용하고, 외부에서는 apply를 사용할 것
 */
export class InputSourceObject extends fabric.Image {
  public type: 'INPUT_SOURCE' = 'INPUT_SOURCE';
  public inputSourceType: string;

  // name getter
  public get name(): string {
    return this.inputSourceType;
  }

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
   */
  public apply<K extends keyof this>(key: K, value: this[K] | ((value: this[K]) => this[K])) {
    if (!value) return this;
    this[key] = value instanceof Function ? value(this[key]) : value;
    return this;
  }

  /**
   * 오브젝트 내부의 변경사항을 적용하는 함수, 캔버스의 이벤트를 발생시키고, 모든 오브젝트를 다시 랜더링한다.
   *
   * @author 오지민 2023.03.01
   */
  public commit() {
    this.canvas.fire('object:modified');
    this.canvas.renderAll();
  }

  /**
   * 인풋소스 오브젝트의 속성을 Properties 형태로 반환하는 함수
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationInputSourceRegionProperties
   * @warning 이 함수의 리턴타입은 큐브릭랜더러에 의존함.
   */
  public toProperties(): RawPresentationInputSourceRegionProperties {
    return {
      inputSourceType: this.inputSourceType,
    };
  }
}
