import { fabric } from 'fabric';
import { RawPresentationVectorGraphicRegionProperties } from '@cublick/parser/models';
import { ImageObject } from './fabric.image';
import { CanvasObject } from './fabric.canvas';
import { VideoObject } from './fabric.video';

export class ImageFrameObject extends fabric.Path {
  public type: 'VECTOR_GRAPHIC' = 'VECTOR_GRAPHIC';
  public caption: string = '';
  public alpha: number = 255;
  public wrapContent: boolean = false;
  public id: string;
  public name: string;
  public oriHeight: number = 0;
  public oriWidth: number = 0;
  public srcLink: string;
  public srcType: 'SDSS' | 'GOOGLE_DRIVE' | 'REMOTE' = 'SDSS';

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
   * 이미지프레임에 이미지를 적용하는 함수, 기존 이미지프레임 오브젝트의 크기를 유지하면서 이미지을 적용한다.
   *
   * @author 오지민 2023.02.18
   * @param image 적용할 이미지오브젝트 ( 아직 캔버스에 렌더링되지 않은 이미지 오브젝트 )
   * @returns 적용된 이미지오브젝트
   */
  public applyImage(image: ImageObject, canvas: CanvasObject) {
    image.setOptions({
      left: this.left,
      top: this.top,
      scaleX: this.getScaledWidth() / image.width,
      scaleY: this.getScaledHeight() / image.height,
    });
    canvas.undoRedoHandler.lockArea(() => {
      this.canvas.add(image);
      this.canvas.moveTo(image, this.canvas.getObjects().indexOf(this));
      this.canvas.remove(this);
    });
    return image.applyImageFrame(this);
  }

  /**
   * 이미지프레임에 비디오를 적용하는 함수, 기존 이미지프레임 오브젝트의 크기를 유지하면서 비디오를 적용한다.
   *
   * @author 오지민 2023.02.18
   * @param image 적용할 이미지오브젝트 ( 아직 캔버스에 렌더링되지 않은 이미지 오브젝트 )
   * @returns 적용된 이미지오브젝트
   */
  public applyVideo(image: VideoObject, canvas: CanvasObject) {
    image.setOptions({
      left: this.left,
      top: this.top,
      scaleX: this.getScaledWidth() / image.width,
      scaleY: this.getScaledHeight() / image.height,
    });
    canvas.undoRedoHandler.lockArea(() => {
      this.canvas.add(image);
      this.canvas.moveTo(image, this.canvas.getObjects().indexOf(this));
      this.canvas.remove(this);
    });
    return image.applyImageFrame(this);
  }

  /**
   * ImageFrameObject를 Properties형태로 변환하는 함수
   *
   * @author 오지민 2023.03.02
   * @returns RawPresentationVectorGraphicRegionProperties
   * @warning 이 함수의 반환타입은 큐브릭랜더러에 의존함.
   * @usecase presentationHandler, 캔버스에서 프레젠테이션을 추출(export)할 때 사용
   */
  public toProperties(): RawPresentationVectorGraphicRegionProperties {
    return {
      caption: this.caption,
      alpha: this.alpha,
      wrapContent: this.wrapContent,
      id: this.id,
      name: this.name,
      oriHeight: this.oriHeight,
      oriWidth: this.oriWidth,
      srcLink: this.srcLink,
      srcType: this.srcType,
    };
  }
}
