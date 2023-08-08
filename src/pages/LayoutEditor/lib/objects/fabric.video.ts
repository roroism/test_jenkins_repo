import {
  RawPresentation,
  RawPresentationVideoRegionGoogledriveTypeProperties,
  RawPresentationVideoRegionRemoteTypeProperties,
  RawPresentationVideoRegionSdssTypeProperties,
  RawPresentationVideoRegionYoutubeTypeProperties,
} from '@cublick/parser/models';
import { fabric } from 'fabric';
import { ImageFrameObject } from './fabric.image_frame';

/**
 * 비디오 오브젝트의 기본 클래스, 모든 비디오와 관련된 오브젝트는 이 클래스를 상속받는다.
 *
 * @author 오지민 2023.03.02
 */
export class VideoBaseObject extends fabric.Image {
  public type: 'VIDEO' = 'VIDEO';

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
   * 비디오 오브젝트에 이미지프레임을 적용하는 함수, 기존 비디오 오브젝트의 크기를 유지하면서 이미지프레임을 적용한다.
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
   * 오브젝트의 속성을 변경하는 함수
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
   * 비디오에 적용된 이미지프레임의 path를 큐브릭렌더러가 읽을 수 있도록 string으로 변환하는 함수
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

// ----------------------------------------------------------------
/**
 * 로컬 비디오 오브젝트, 클라우드에 저장되어있는 비디오중, 자신이 업로드한 비디오
 *
 * @author 오지민 2023.03.02
 */
export class SDSSVideoObject extends VideoBaseObject {
  public srcType: 'SDSS' = 'SDSS';
  public fileType: string;
  public id: string;
  public md5: string;
  public repeat: boolean = false;
  public mute: boolean = false;

  /**
   * SDSSVideoObject를 Properties형태로 변환하는 함수
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationVideoRegionSdssTypeProperties
   * @warning 이 함수의 반환타입은 큐브릭랜더러에 의존함.
   * @usecase presentationHandler, 캔버스에서 프레젠테이션을 추출(export)할 때 사용
   */
  public toProperties = (): RawPresentationVideoRegionSdssTypeProperties => {
    return {
      id: this.id,
      fileType: this.fileType,
      srcType: 'SDSS',
      md5: this.md5,
      mute: this.mute,
      repeat: this.repeat,
    };
  };

  /**
   * SDSSVideoObject를 AssetList형태로 변환하는 함수
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

// ----------------------------------------------------------------
/**
 * 유튜브 비디오 오브젝트, 유튜브에서 가져온 비디오 오브젝트
 *
 * @author 오지민 2023.03.02
 */
export class YoutubeVideoObject extends VideoBaseObject {
  public srcType: 'YOUTUBE' = 'YOUTUBE';
  public id: string;
  public srcLink: string;
  public repeat: boolean = false;
  public mute: boolean = false;

  public get name(): string {
    return this.id;
  }
  public set name(value: string) {
    this.id = value;
  }

  /**
   * YoutubeVideoObject를 Properties형태로 변환하는 함수
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationVideoRegionYoutubeTypeProperties
   * @warning 이 함수의 반환타입은 큐브릭랜더러에 의존함.
   * @usecase presentationHandler, 캔버스에서 프레젠테이션을 추출(export)할 때 사용
   */
  public toProperties = (): RawPresentationVideoRegionYoutubeTypeProperties => {
    return {
      id: this.id,
      srcType: 'YOUTUBE',
      mute: this.mute,
      repeat: this.repeat,
      srcLink: this.srcLink,
    };
  };
}

// ----------------------------------------------------------------
/**
 * 구글 드라이브 비디오 오브젝트, 구글 들라이브에서 가져온 비디오 오브젝트
 *
 * @author 오지민 2023.03.02
 */
export class GoogleDriveVideoObject extends VideoBaseObject {
  public srcType: 'GOOGLE_DRIVE' = 'GOOGLE_DRIVE';
  public id: string;
  public srcLink: string;
  public repeat: boolean = false;
  public mute: boolean = false;

  /**
   * GoogleDriveVideoObject를 Properties형태로 변환하는 함수
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationVideoRegionGoogledriveTypeProperties
   * @warning 이 함수의 반환타입은 큐브릭랜더러에 의존함.
   * @usecase presentationHandler, 캔버스에서 프레젠테이션을 추출(export)할 때 사용
   */
  public toProperties = (): RawPresentationVideoRegionGoogledriveTypeProperties => {
    return {
      id: this.id,
      srcType: 'GOOGLE_DRIVE',
      mute: this.mute,
      repeat: this.repeat,
      srcLink: this.srcLink,
    };
  };
}

// ----------------------------------------------------------------
/**
 * 원격 비디오 오브젝트, 클라우드에 저장되어 있는 비디오중, 자신이 업로드하지 않은 비디오 ( 기본으로 제공하는 비디오 )
 *
 * @author 오지민 2023.03.02
 */
export class RemoteVideoObject extends VideoBaseObject {
  public srcType: 'REMOTE' = 'REMOTE';
  public srcLink: string;
  public repeat: boolean = false;
  public mute: boolean = false;

  /**
   * GoogleDriveVideoObject를 Properties형태로 변환하는 함수
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationVideoRegionRemoteTypeProperties
   * @warning 이 함수의 반환타입은 큐브릭랜더러에 의존함.
   * @usecase presentationHandler, 캔버스에서 프레젠테이션을 추출(export)할 때 사용
   */
  public toProperties = (): RawPresentationVideoRegionRemoteTypeProperties => {
    return {
      srcType: 'REMOTE',
      mute: this.mute,
      repeat: this.repeat,
      srcLink: this.srcLink,
    };
  };
}

// ----------------------------------------------------------------
export type VideoObject =
  | SDSSVideoObject
  | YoutubeVideoObject
  | GoogleDriveVideoObject
  | RemoteVideoObject;
