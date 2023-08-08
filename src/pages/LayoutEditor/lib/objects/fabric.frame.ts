import { fabric } from 'fabric';
import { RawPresentationFrameRegionProperties } from '@cublick/parser/models';

export class FrameObject extends fabric.Path {
  public type: 'FRAME' = 'FRAME';
  public name: string = '';
  public caption: string = '';
  public alpha: number = 255;
  public wrapContent: boolean = false;
  public fillPattern: string = '';
  public oriWidth: number = 0;
  public oriHeight: number = 0;
  public shapeType: 'FREE' | 'RECT' | 'TRIANGLE' | 'ELLIPSE' | 'LINE' = 'FREE';

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

  // lineDepth setter getter
  public get lineDepth(): number {
    return this.strokeWidth;
  }
  public set lineDepth(value: number) {
    this.set('strokeWidth', value);
  }

  // fillColor setter getter
  public get fillColor(): string {
    return this.fill as string;
  }
  public set fillColor(value: string) {
    this.set('fill', value);
  }

  // linePattern setter getter
  // default: 'SOLID'
  public get linePattern(): 'DOTTED' | 'DASHED' | 'SOLID' | 'DOUBLE' {
    return this.strokeDashArrayToLinePattern(this.strokeDashArray);
  }
  public set linePattern(value: 'DOTTED' | 'DASHED' | 'SOLID' | 'DOUBLE') {
    this.set('strokeDashArray', this.linePatternToStrokeDashArray(value));
  }

  // lineColor setter getter
  public get lineColor(): string {
    return this.stroke as string;
  }
  public set lineColor(value: string) {
    this.set('stroke', value);
  }

  /**
   * 프레임 오브젝트의 속성을 변경하는 함수
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
   * 프레임 오브젝트의 속성을 Properties 형태로 반환하는 함수
   *
   * 1. ImageBaseObject를 상속받는 모든 클래스에서 이 함수를 오버라이드 해야한다.
   * 2. 오버라이드한 함수에서는 반드시 super.toProperties()를 호출해야한다.
   * 3. 오버라이드한 함수에서는 반드시 자신의 속성을 추가해야한다.
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationImageRegionBaseProperties
   * @warning 이 함수의 리턴타입은 큐브릭랜더러에 의존함.
   * @usecase presentationHandler, 캔버스에서 프레젠테이션을 추출(export)할 때 사용
   */
  public toProperties = (): RawPresentationFrameRegionProperties => {
    return {
      name: this.name,
      caption: this.caption,
      alpha: this.alpha,
      wrapContent: this.wrapContent,
      fillColor: this.fillColor,
      fillPattern: this.fillPattern,
      lineColor: this.lineColor,
      lineDepth: this.lineDepth,
      linePattern: this.linePattern,
      oriWidth: this.oriWidth,
      oriHeight: this.oriHeight,
      shapeType: this.shapeType,
      data: this.toSVG().replace('translate', ''),
    };
  };

  private linePatternToStrokeDashArray = (linePattern: typeof this.linePattern) => {
    switch (linePattern) {
      case 'DOTTED':
        return [5, 5];
      case 'DASHED':
        return [10, 5];
      case 'DOUBLE':
      case 'SOLID':
      default:
        return [0, 0];
    }
  };
  public strokeDashArrayToLinePattern = (strokeDashArray: number[]) => {
    switch (strokeDashArray?.join(',')) {
      case '5,5':
        return 'DOTTED';
      case '10,5':
        return 'DASHED';
      case '0,0':
      default:
        return 'SOLID';
    }
  };
}
