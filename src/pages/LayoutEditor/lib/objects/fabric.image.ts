import {
  RawPresentation,
  RawPresentationImageRegionBaseProperties,
  RawPresentationImageRegionGoogledriveTypeProperties,
  RawPresentationImageRegionRemoteTypeProperties,
  RawPresentationImageRegionSdssTypeProperties,
} from '@cublick/parser/models';
import { fabric } from 'fabric';
import { CanvasObject } from './fabric.canvas';
import { ImageFrameObject } from './fabric.image_frame';

/**
 * 이미지 오브젝트의 기본 클래스, 모든 이미지와 관련된 오브젝트는 이 클래스를 상속받는다.
 *
 * @author 오지민 2023.03.02
 */
export class ImageBaseObject extends fabric.Image {
  public type: 'IMAGE' = 'IMAGE';
  public caption: string = '';
  public alpha: number = 255;
  public wrapContent: boolean = false;
  public mimeType: string = 'IMAGE';
  public name: string = '';
  public canvas: CanvasObject;

  constructor(element: HTMLImageElement, options?: fabric.IImageOptions) {
    super(element, options);
    /**
     * 정확히 뭘 하는 건지는 모르겠지만, 이걸 안하면
     * 이미지프레임을 이미지에 적용했을 때, 이미지리플레이스가 제대로 동작하지 않는 경우가 있음.
     */
    this.statefullCache = true;
    this.cacheProperties.push('element');
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
   * 이미지 오브젝트의 이미지를 교체하는 함수, 기존 이미지 오브젝트의 크기를 유지하면서 이미지를 교체한다.
   *
   * @author 오지민 2023.02.18
   * @param to 새로운 이미지를 담고있는 ImageObject
   * @returns this
   */
  public replaceImage(to: ImageObject) {
    const width = this.getScaledWidth();
    const height = this.getScaledHeight();
    this.setElement(to.getElement());
    this.setOptions({
      name: to.name,
      scaleX: width / this.width,
      scaleY: height / this.height,
    });
    return this;
  }

  /**
   * 이미지 오브젝트에 이미지프레임을 적용하는 함수, 기존 이미지 오브젝트의 크기를 유지하면서 이미지프레임을 적용한다.
   *
   * @author 오지민 2023.02.18
   * @param imageFrame 적용할 이미지프레임 오브젝트
   * @returns this
   */
  public applyImageFrame(imageFrame: ImageFrameObject) {
    imageFrame.set({
      left: -this.width / 2, // * -0.5,
      top: -this.height / 2, // * -0.5
      scaleX: this.width / imageFrame.width,
      scaleY: this.height / imageFrame.height,
      strokeWidth: 0,
    });
    this.clipPath = imageFrame;
    return this;
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
   * 이미지 오브젝트의 속성을 Properties 형태로 반환하는 함수
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
  protected toProperties(): RawPresentationImageRegionBaseProperties {
    return {
      alpha: this.alpha,
      caption: this.caption,
      wrapContent: this.wrapContent,
      mimeType: this.mimeType,
      name: this.name,
    };
  }

  /**
   * 이미지에 적용된 이미지프레임의 path를 큐브릭렌더러가 읽을 수 있도록 string으로 변환하는 함수
   *
   * @author 오지민 2023.03.03
   * @returns clipPath의 path를 string으로 변환한 값
   * @warning 이 함수의 리턴타입은 큐브릭랜더러에 의존함.
   * @usecase presentationHandler, 캔버스에서 프레젠테이션을 추출(export)할 때 사용
   */
  public exportClipPath(): string {
    return (this.clipPath as any)?.path.map((p: any) => p.join(' ')).join(' ') ?? '';
  }
}

// -------------------------------------------------------------------
/**
 * 로컬 이미지 오브젝트, 클라우드에 저장되어있는 이미지중, 자신이 업로드한 이미지
 *
 * @author 오지민 2023.03.02
 */
export class SDSSImageObject extends ImageBaseObject {
  public srcType: 'SDSS' = 'SDSS';
  public fileType: string;
  public md5: string;
  public id: string;

  /**
   * SDSSImageObject를 Properties형태로 변환하는 함수
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationImageRegionSdssTypeProperties
   * @warning 이 함수의 반환타입은 큐브릭랜더러에 의존함.
   * @usecase presentationHandler, 캔버스에서 프레젠테이션을 추출(export)할 때 사용
   */
  public toProperties(): RawPresentationImageRegionSdssTypeProperties {
    const baseProperties = super.toProperties();
    return {
      ...baseProperties,
      srcType: this.srcType,
      id: this.id,
      fileType: this.fileType,
      md5: this.md5,
      wrapContent: this.wrapContent,
    };
  }

  /**
   * SDSSImageObject를 AssetList형태로 변환하는 함수
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationAssetList의 일부분
   * @warning 이 함수의 반환타입은 큐브릭랜더러에 의존함.
   * @usecase presentationHandler, 캔버스에서 프레젠테이션을 추출(export)할 때 사용
   */
  public toAssetList = (): RawPresentation['assetList'] => {
    return [
      {
        id: this.id,
        fileType: this.fileType,
        md5: this.md5,
        name: this.name,
      },
    ];
  };
}

// -------------------------------------------------------------------
/**
 * 구글 드라이브 이미지 오브젝트, 구글 드라이브에서 가져온 이미지 오브젝트
 *
 * @author 오지민 2023.03.02
 */
export class GoogleDriveImageObject extends ImageBaseObject {
  public srcType: 'GOOGLE_DRIVE' = 'GOOGLE_DRIVE';
  public id: string;
  public srcLink: string;
  public thumnail: string;

  /**
   * GoogleDriveImageObject를 Properties형태로 변환하는 함수
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationImageRegionGoogledriveTypeProperties
   * @warning 이 함수의 반환타입은 큐브릭랜더러에 의존함.
   * @usecase presentationHandler, 캔버스에서 프레젠테이션을 추출(export)할 때 사용
   */
  public toProperties(): RawPresentationImageRegionGoogledriveTypeProperties {
    const baseProperties = super.toProperties();
    return {
      ...baseProperties,
      id: this.id,
      srcType: this.srcType,
      srcLink: this.srcLink,
      thumnail: this.thumnail,
    };
  }
}

// -------------------------------------------------------------------
/**
 * 원격 이미지 오브젝트, 클라우드에 저장되어 있는 이미지중, 자신이 업로드하지 않은 이미지 ( 기본으로 제공하는 이미지 )
 *
 * @author 오지민 2023.03.02
 */
export class RemoteImageObject extends ImageBaseObject {
  public srcType: 'REMOTE' = 'REMOTE';
  public srcLink: string;
  public thumnail: string;

  /**
   * RemoteImageObject를 Properties형태로 변환하는 함수
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationImageRegionRemoteTypeProperties
   * @warning 이 함수의 반환타입은 큐브릭랜더러에 의존함.
   * @usecase presentationHandler, 캔버스에서 프레젠테이션을 추출(export)할 때 사용
   */
  public toProperties(): RawPresentationImageRegionRemoteTypeProperties {
    const baseProperties = super.toProperties();
    return {
      ...baseProperties,
      srcType: this.srcType,
      srcLink: this.srcLink,
      thumnail: this.thumnail,
    };
  }
}

// -------------------------------------------------------------------
export type ImageObject = SDSSImageObject | GoogleDriveImageObject | RemoteImageObject;
