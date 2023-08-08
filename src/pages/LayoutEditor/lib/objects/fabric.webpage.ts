import { fabric } from 'fabric';
import { RawPresentationWebpageRegionProperties } from '@cublick/parser/models';
import { IFabricObject } from './fabric.object';
import { CanvasObject } from './fabric.canvas';

/**
 * 웹페이지 오브젝트의 기본 클래스, 모든 웹페이지와 관련된 오브젝트는 이 클래스를 상속받는다.
 *
 * @author 오지민 2023.03.02
 */
export class WebPageObject extends fabric.Image implements IFabricObject {
  public canvas: CanvasObject;
  public type: 'WEBPAGE' = 'WEBPAGE';
  public caption: string = '';
  public alpha: number = 255;
  public srcLink: string;
  public srcType: 'REMOTE' = 'REMOTE';

  // name getter
  get name() {
    return this.srcLink.replace('http://', '').replace('https://', '').replace('www.', '');
  }

  /**
   * 웹페이지 오브젝트의 속성을 변경하는 함수
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
   * 웹페이지 오브젝트의 속성을 Properties 형태로 반환하는 함수
   *
   * 1. WebPageObject를 상속받는 모든 클래스에서 이 함수를 오버라이드 해야한다.
   * 2. 오버라이드한 함수에서는 반드시 super.toProperties()를 호출해야한다.
   * 3. 오버라이드한 함수에서는 반드시 자신의 속성을 추가해야한다.
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationWebpageRegionProperties
   * @warning 이 함수의 리턴타입은 큐브릭랜더러에 의존함.
   * @usecase presentationHandler, 캔버스에서 프레젠테이션을 추출(export)할 때 사용
   */
  public toProperties(): RawPresentationWebpageRegionProperties {
    return {
      caption: this.caption,
      alpha: this.alpha,
      srcLink: this.srcLink,
      srcType: 'REMOTE',
    };
  }
}
