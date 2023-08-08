import type {
  RawPresentationTextRegion,
  RawPresentationTextRegionProperties,
} from '@cublick/parser/models';
import { fabric } from 'fabric';
import { CanvasObject } from './fabric.canvas';

/**
 * 텍스트박스 오브젝트
 *
 * @author 오지민 2023.03.02
 * @warning set함수는 이 클래스 내부에서만 사용하고, 외부에서는 apply를 사용할 것
 */
export class TextBoxObject extends fabric.Textbox {
  public canvas: CanvasObject;

  // type setter getter
  public type: 'TEXT' = 'TEXT';

  // name setter getter
  public get name(): string {
    return this.text;
  }
  public set name(value: string) {
    this.set('text', value);
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

  // align setter getter
  public get align(): 'left' | 'center' | 'right' {
    return this.textAlign as 'left' | 'center' | 'right';
  }
  public set align(value: 'left' | 'center' | 'right') {
    this.set('textAlign', value);
  }

  // bold setter getter
  public get bold(): boolean {
    return this.fontWeight === 'bold';
  }
  public set bold(value: boolean) {
    this.set('fontWeight', value ? 'bold' : 'normal');
  }

  // italic setter getter
  public get italic(): boolean {
    return this.fontStyle === 'italic';
  }
  public set italic(value: boolean) {
    this.set('fontStyle', value ? 'italic' : 'normal');
  }

  // strikeThrough setter getter
  public get strikethrough(): boolean {
    return this.linethrough;
  }
  public set strikethrough(value: boolean) {
    this.set('linethrough', value);
  }

  // fontColor setter getter
  public get fontColor(): string {
    return this.fill as string;
  }
  public set fontColor(value: string) {
    this.set('fill', value);
  }

  // fontName setter getter
  public get fontName(): string {
    return this.fontFamily;
  }
  public set fontName(value: string) {
    this.set('fontFamily', value);
  }

  // others ---------------------------------------------------
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
   * 택스트박스 오브젝트의 속성을 Properties 형태로 반환하는 함수
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationTextRegionProperties
   * @warning 이 함수의 리턴타입은 큐브릭랜더러에 의존함.
   */
  public toProperties(): RawPresentationTextRegionProperties {
    return {
      align: this.align,
      alpha: 255,
      fontColor: this.fontColor,
      fontName: this.fontName,
      fontSize: this.fontSize * ((this.scaleX + this.scaleY) / 2),
      text: this.text,
      animation: {
        in: {
          delay: 0,
        },
        out: {
          delay: 0,
        },
      },
      caption: '',
      fontStyle: {
        bold: this.bold,
        italic: this.italic,
        underline: this.underline,
        strikethrough: this.strikethrough,
      },
      name: this.text,
      singleLine: false,
      shadowColor: '#00000000',
      shadowDX: 1,
      shadowDY: 1,
      shadowRadius: 1,
      strokeColor: null,
      strokeWidth: 0,
      textLineSpacing: 1.16,
      textEffect: {
        code: 'none',
        repeat: false,
        speed: 0,
      },
    };
  }
}
