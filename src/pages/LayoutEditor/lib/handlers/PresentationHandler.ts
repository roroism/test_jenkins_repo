import IMG_WWW from '@app/resources/icons/www.png';
import { PresentationDesignData } from '@app/src/apis/presentation/presentationApi.model';
import { config } from '@app/src/config';
import { store } from '@app/src/store';
import { ARGBtoRGBA, createHexID, ImageLoader, RGBAtoARGB } from '@app/src/utils';
import type {
  RawPresentation,
  RawPresentationBaseRegion,
  RawPresentationFrameRegion,
  RawPresentationImageRegion,
  RawPresentationRegion,
  RawPresentationTextRegion,
  RawPresentationVectorGraphicRegion,
  RawPresentationVideoRegion,
  RawPresentationWebpageRegion,
  RawPresentationWidgetRegion,
  RawPresentationInputSourceRegion,
} from '@cublick/parser/models';
import axios from 'axios';
import { promised_fabric_loadSVGFromString, promised_fabric_loadSVGFromURL } from '../fabric.utils';
import { FrameObject } from '../objects/fabric.frame';
import { ImageObject, SDSSImageObject } from '../objects/fabric.image';
import { ImageFrameObject } from '../objects/fabric.image_frame';
import { InputSourceObject } from '../objects/fabric.input_source';
import { FabricObject } from '../objects/fabric.object';
import { TextBoxObject } from '../objects/fabric.textbox';
import { SDSSVideoObject, VideoObject, YoutubeVideoObject } from '../objects/fabric.video';
import { WebPageObject } from '../objects/fabric.webpage';
import { WidgetObject } from '../objects/fabric.widget';
import { WorkArea } from '../objects/fabric.workarea';
import { Handler } from './Handler';

const inputSourceTypeToAssetId = {
  CAMERA: '640588918f803d072034c1be',
  DVI: '640588918f803d072034c1bf',
  HDMI: '640588918f803d072034c1c2',
  PC: '640588918f803d072034c1c0',
  TEMPERATURE_CHECK: '640588918f803d072034c1c1',
  THERMO_CAMERA: '640588918f803d072034c1c3',
  TV: '640588928f803d072034c1c4',
};

export class PresentationHandler extends Handler {
  // import RawPresentation --------------------------------------------
  public importRawPresentation = async (
    rawPresentation: PresentationDesignData | RawPresentation
  ) => {
    await this.impotWorkArea(rawPresentation);

    const regions: RawPresentationRegion[] =
      typeof rawPresentation.regions === 'string'
        ? JSON.parse(rawPresentation.regions)
        : rawPresentation.regions;

    for (const region of regions) {
      await this.importRegion(region);
    }
  };

  private impotWorkArea = async (rawPresentation: RawPresentation) => {
    const object = new WorkArea()
      .apply('id', rawPresentation.id)
      .apply('name', rawPresentation.name)
      .apply('desc', rawPresentation.desc)
      .apply('width', rawPresentation.width)
      .apply('height', rawPresentation.height)
      .apply('ratio', rawPresentation.ratio)
      .apply('orientation', rawPresentation.orientation)
      .apply(
        'fill',
        rawPresentation.bgEnable && rawPresentation.bg.type === 'COLOR'
          ? rawPresentation.bg.id
          : '#FFFFFF'
      )
      .apply('categories', rawPresentation.categories) //익스포트할때 어딘가에 저장되어있는걸 가져오면댐
      .apply('styles', rawPresentation.styles)
      .apply('moods', rawPresentation.moods);

    this._canvas.add(object);
  };

  public importRegion = async (region: RawPresentationRegion) => {
    switch (region.type) {
      case 'TEXT':
        return this.importTextRegion(region);
      case 'IMAGE':
        return this.importImageRegion(region);
      case 'VIDEO':
        return this.importVideoRegion(region);
      case 'FRAME':
        return this.importFrameRegion(region);
      case 'VECTOR_GRAPHIC':
        return this.importVectorGraphicRegion(region);
      case 'WEBPAGE':
        return this.importWebpageRegion(region);
      case 'WIDGET':
        return this.importWidgetRegion(region);
      case 'INPUT_SOURCE':
        return this.importInputSourceRegion(region);
    }
  };

  private importInputSourceRegion = async (region: RawPresentationInputSourceRegion) => {
    const authToken = store.getState().appAuth.token;
    const assetId = inputSourceTypeToAssetId[region.properties.inputSourceType];
    const src = config.EXTERNAL.CUBLICK.ASSET.THUMBNAIL(assetId, authToken);
    const element = await ImageLoader.load(src);
    const object = new InputSourceObject(element) //
      .apply('left', region.x)
      .apply('top', region.y)
      .apply('scaleX', region.width / element.naturalWidth)
      .apply('scaleY', region.height / element.naturalHeight)
      .apply('lock', region.lock)
      .apply('angle', region.rotate)
      .apply('inputSourceType', region.properties.inputSourceType);

    this._canvas.add(object);
  };

  private importWidgetRegion = async (region: RawPresentationWidgetRegion) => {
    const authToken = store.getState().appAuth.token;
    const src = config.EXTERNAL.CUBLICK.WIDGET.THUMBNAIL(region.properties.id, authToken);
    const element = await ImageLoader.load(src);
    const object = new WidgetObject(element)
      .apply('left', region.x)
      .apply('top', region.y)
      .apply('scaleX', region.width / element.naturalWidth)
      .apply('scaleY', region.height / element.naturalHeight)
      .apply('lock', region.lock)
      .apply('angle', region.rotate)
      .apply('alpha', region.properties.alpha)
      .apply('caption', region.properties.caption)
      .apply('name', region.properties.name)
      .apply('id', region.properties.id)
      .apply('data', region.properties.data);

    this._canvas.add(object);
  };

  private importTextRegion = async (region: RawPresentationTextRegion) => {
    const object = new TextBoxObject(region.properties.text) //
      .apply('left', region.x)
      .apply('top', region.y)
      .apply('width', region.width)
      .apply('height', region.height)
      .apply('angle', region.rotate)
      .apply('align', region.properties.align)
      .apply('underline', region.properties.fontStyle.underline)
      .apply('bold', region.properties.fontStyle.bold)
      .apply('italic', region.properties.fontStyle.italic)
      .apply('strikethrough', region.properties.fontStyle.strikethrough)
      .apply('fontSize', +region.properties.fontSize)
      .apply('fontColor', ARGBtoRGBA(region.properties.fontColor))
      .apply('fontName', region.properties.fontName);

    this._canvas.add(object);
  };

  private importImageRegion = async (region: RawPresentationImageRegion) => {
    const token = store.getState().appAuth.token;

    if (region.properties.srcType === 'SDSS') {
      const src = config.EXTERNAL.CUBLICK.ASSET.THUMBNAIL(region.properties.id, token);
      const element = await ImageLoader.load(src);
      const object = new SDSSImageObject(element) //
        .apply('left', region.x)
        .apply('top', region.y)
        .apply('scaleX', region.width / element.naturalWidth)
        .apply('scaleY', region.height / element.naturalHeight)
        .apply('lock', region.lock)
        .apply('angle', region.rotate)
        .apply('alpha', region.properties.alpha)
        .apply('caption', region.properties.caption)
        .apply('wrapContent', region.properties.wrapContent)
        .apply('fileType', region.properties.fileType)
        .apply('md5', region.properties.md5)
        .apply('mimeType', region.properties.mimeType)
        .apply('name', region.properties.name)
        .apply('id', region.properties.id);

      this._canvas.add(object);

      if (region.clipPath) {
        object.applyImageFrame(new ImageFrameObject(region.clipPath));
      }
    }
  };

  private importVideoRegion = async (region: RawPresentationVideoRegion) => {
    const token = store.getState().appAuth.token;

    if (region.properties.srcType === 'SDSS') {
      const src = config.EXTERNAL.CUBLICK.ASSET.THUMBNAIL(region.properties.id, token);
      const element = await ImageLoader.load(src);
      const object = new SDSSVideoObject(element) //
        .apply('left', region.x)
        .apply('top', region.y)
        .apply('scaleX', region.width / element.naturalWidth)
        .apply('scaleY', region.height / element.naturalHeight)
        .apply('lock', region.lock)
        .apply('angle', region.rotate)
        .apply('id', region.properties.id)
        .apply('fileType', region.properties.fileType)
        .apply('md5', region.properties.md5)
        .apply('mute', region.properties.mute)
        .apply('repeat', region.properties.repeat);
      // .apply('name', region.properties.name);

      this._canvas.add(object);

      if (region.clipPath) {
        object.applyImageFrame(new ImageFrameObject(region.clipPath));
      }
    }

    if (region.properties.srcType === 'YOUTUBE') {
      const proxyURL = config.EXTERNAL.CUBLICK.SERVICES.PROXY;
      const src = region.properties.srcLink;
      let element: HTMLImageElement = ImageLoader.cache.get(src);
      if (!element) {
        const res = await axios.get<Blob>(`${proxyURL}?url=${src}`, { responseType: 'blob' });
        element = await ImageLoader.load(URL.createObjectURL(res.data));
        ImageLoader.setCache(src, element);
      }

      const object = new YoutubeVideoObject(element) //
        .apply('left', region.x)
        .apply('top', region.y)
        .apply('scaleX', region.width / element.naturalWidth)
        .apply('scaleY', region.height / element.naturalHeight)
        .apply('lock', region.lock)
        .apply('angle', region.rotate)
        .apply('id', region.properties.id)
        .apply('srcLink', region.properties.srcLink)
        .apply('mute', region.properties.mute)
        .apply('repeat', region.properties.repeat);

      this._canvas.add(object);

      if (region.clipPath) {
        object.applyImageFrame(new ImageFrameObject(region.clipPath));
      }
    }
  };

  private importFrameRegion = async (region: RawPresentationFrameRegion) => {
    const { objects } = await promised_fabric_loadSVGFromString(region.properties.data);
    const tempObject = objects[0].toObject(['d', 'fill', 'stroke', 'strokeWidth', 'path']);

    const object = new FrameObject(tempObject.d)
      .apply('path', tempObject.path)
      .apply('name', region.properties.name)
      .apply('fillColor', region.properties.fillColor)
      .apply('lineColor', region.properties.lineColor)
      .apply('lineDepth', region.properties.lineDepth)
      .apply('linePattern', region.properties.linePattern as any)
      .apply('oriWidth', region.properties.oriWidth)
      .apply('oriHeight', region.properties.oriHeight)
      .apply('shapeType', region.properties.shapeType)
      .apply('left', region.x)
      .apply('top', region.y)
      .apply('width', 512)
      .apply('height', 512)
      .apply('scaleX', region.width / region.properties.oriWidth)
      .apply('scaleY', region.height / region.properties.oriHeight)
      .apply('angle', region.rotate)
      .apply('lock', region.lock)
      .apply('alpha', region.properties.alpha)
      .apply('caption', region.properties.caption)
      .apply('wrapContent', region.properties.wrapContent);

    this._canvas.add(object);
  };

  private importVectorGraphicRegion = async (region: RawPresentationVectorGraphicRegion) => {
    const { objects } = await promised_fabric_loadSVGFromURL(region.properties.srcLink);
    const object = objects[0].toObject(['d', 'path', 'fill']);
    const imageFrameObject = new ImageFrameObject(object.d)
      .apply('left', region.x)
      .apply('top', region.y)
      .apply('angle', region.rotate)
      .apply('scaleX', region.width / region.properties.oriWidth)
      .apply('scaleY', region.height / region.properties.oriHeight)
      .apply('caption', region.properties.caption)
      .apply('alpha', region.properties.alpha)
      .apply('wrapContent', region.properties.wrapContent)
      .apply('id', region.properties.id)
      .apply('name', region.properties.name)
      .apply('srcLink', region.properties.srcLink)
      .apply('oriWidth', region.properties.oriWidth)
      .apply('oriHeight', region.properties.oriHeight)
      .apply('fill', object.fill);

    this._canvas.add(imageFrameObject);
  };

  public importWebpageRegion = async (region: RawPresentationWebpageRegion) => {
    const element = await ImageLoader.load(IMG_WWW);
    const webpageObject = new WebPageObject(element)
      .apply('left', region.x)
      .apply('top', region.y)
      .apply('angle', region.rotate)
      .apply('scaleX', region.width / element.naturalWidth)
      .apply('scaleY', region.height / element.naturalHeight)
      .apply('srcLink', region.properties.srcLink);

    this._canvas.add(webpageObject);
  };

  // export Design -----------------------------------------------------
  public exportRawPresentation = () => {
    const objects = this._canvas.getObjects();
    const workarea = this._canvas.elementHandler.getWorkArea();
    const rawPresentation = this.exportBaseRawPresentation(workarea);

    for (const object of objects) {
      const region = this.exportRegion(object);
      if (!region) continue;
      rawPresentation.regions.push(region);

      const partialAssetList = this.generateAssetList(object);
      if (partialAssetList.length === 0) continue;
      rawPresentation.assetList.push(...partialAssetList);
    }

    return rawPresentation;
  };

  public exportStyles = () => {
    const workarea = this._canvas.elementHandler.getWorkArea();
    return workarea.styles;
  };

  public exportMoods = () => {
    const workarea = this._canvas.elementHandler.getWorkArea();
    return workarea.moods;
  };

  private exportBaseRawPresentation = (workarea: WorkArea): RawPresentation => {
    return {
      id: workarea.id,
      name: workarea.name,
      code: workarea.name,
      desc: workarea.desc,
      regions: [],
      bg: {
        //zkxprhfl sjgdjdigka
        type: 'COLOR',
        id: workarea.fill,
      },
      bgEnable: true,
      bgAudio: {
        isRepeat: false,
        audios: [],
      },
      bgAudioEnable: false,
      width: workarea.width,
      height: workarea.height,
      ratio: workarea.ratio,
      categories: workarea.categories,
      orientation: workarea.orientation,
      accessRight: 0,
      lock: false,
      assetList: [],
      rules: [],
      sensors: {
        barcode: { enable: false },
        irRemote: { enable: false },
        nfc: { enable: false },
        photoelectric: { enable: false },
      },
      updatedDate: new Date().toString(),
      createdDate: new Date().toString(),
      isGridTpl: false,
      payLevelAccess: 'FREE',
      isSystem: true,
      isPrivate: false,
      viewCounts: 0,
      tags: [],
      status: 'DEACTIVATED',
      multiVision: {
        multiVision: false,
      },
    };
  };

  public exportRegion = (object: FabricObject): RawPresentationRegion => {
    switch (object.type) {
      case 'IMAGE':
        return this.exportImageRegion(object);
      case 'VIDEO':
        return this.exportVideoRegion(object);
      case 'TEXT':
        return this.exportTextRegion(object);
      case 'WEBPAGE':
        return this.exportWebpageRegion(object);
      case 'FRAME':
        return this.exportFrameRegion(object);
      case 'VECTOR_GRAPHIC':
        return this.exportVectorGraphicRegion(object);
      case 'WIDGET':
        return this.exportWidgetRegion(object);
      case 'INPUT_SOURCE':
        return this.exportInputSourceRegion(object);
      default:
        return null;
    }
  };

  public generateBaseRegion = (object: FabricObject): RawPresentationBaseRegion => {
    const zOrder = this._canvas.getObjects().indexOf(object);
    const id = createHexID(24);
    return {
      id: id,
      zOrder: zOrder,
      targetID: id,
      slideEffect: 0,
      slideTime: 0,
      x: object.left,
      y: object.top,
      width: object.getScaledWidth(),
      height: object.getScaledHeight(),
      rotate: object.angle,
      lock: object.lockMovementX,
      bg: {
        type: 'COLOR',
        id: RGBAtoARGB(object.fill as string),
      },
      events: [],
    };
  };

  private exportInputSourceRegion(object: InputSourceObject): RawPresentationInputSourceRegion {
    const baseRegion = this.generateBaseRegion(object);
    const type = object.type;
    const properties = object.toProperties();
    return { ...baseRegion, type, properties };
  }

  private exportWidgetRegion(object: WidgetObject): RawPresentationWidgetRegion {
    const baseRegion = this.generateBaseRegion(object);
    const type = object.type;
    const properties = object.toProperties();
    return { ...baseRegion, type, properties };
  }

  private exportVectorGraphicRegion(object: ImageFrameObject): RawPresentationVectorGraphicRegion {
    const baseRegion = this.generateBaseRegion(object);
    const type = object.type;
    const properties = object.toProperties();
    return { ...baseRegion, type, properties };
  }

  private exportFrameRegion(object: FrameObject): RawPresentationFrameRegion {
    const baseRegion = this.generateBaseRegion(object);
    const type = object.type;
    const properties = object.toProperties();
    return { ...baseRegion, type, properties };
  }

  private exportWebpageRegion(object: WebPageObject): RawPresentationWebpageRegion {
    const baseRegion = this.generateBaseRegion(object);
    const type = object.type;
    const properties = object.toProperties();
    return { ...baseRegion, type, properties };
  }

  private exportImageRegion = (object: ImageObject): RawPresentationImageRegion => {
    const baseRegion = this.generateBaseRegion(object);
    const properties = object.toProperties();
    const type = object.type;
    const clipPath = object.exportClipPath();
    return { ...baseRegion, type, properties, clipPath };
  };

  private exportVideoRegion = (object: VideoObject): RawPresentationVideoRegion => {
    const baseRegion = this.generateBaseRegion(object);
    const type = object.type;
    const properties = object.toProperties();
    const clipPath = object.exportClipPath();
    return { ...baseRegion, type, properties, clipPath };
  };

  private exportTextRegion = (object: TextBoxObject): RawPresentationTextRegion => {
    const baseRegion = this.generateBaseRegion(object);
    const type = object.type;
    const properties = object.toProperties();
    return { ...baseRegion, type, properties };
  };

  // geenrate assetList -----------------------------------------------------
  private generateAssetList = (object: FabricObject): RawPresentation['assetList'] => {
    switch (object.type) {
      case 'IMAGE':
        return this.generateImageAssetList(object);
      case 'VIDEO':
        return this.generateVideoAssetList(object);
      case 'WIDGET':
        return this.generateWidgetAssetList(object);
      default:
        return [];
    }
  };

  private generateImageAssetList(object: ImageObject): RawPresentation['assetList'] {
    if (object.srcType === 'SDSS') {
      return object.toAssetList();
    }
    return [];
  }

  private generateVideoAssetList(object: VideoObject): RawPresentation['assetList'] {
    if (object.srcType === 'SDSS') {
      return object.toAssetList();
    }
    return [];
  }

  private generateWidgetAssetList(object: WidgetObject): RawPresentation['assetList'] {
    return object.toAssetList();
  }

  // generate Thumbnail -----------------------------------------------------
  /**
   * 캔버스의 작업영역을 240px의 세로로 맞춘 dataUrl을 반환하는 함수
   *
   * @author 오지민 2023.02.21
   * @usecase 썸네일 생성을 위한 기초값 생성
   * @returns 현재 캔버스의 작업영역을 240px의 세로로 맞춘 dataUrl
   */
  private exportAsDataUrl = () => {
    // workarea 가져오기
    const workarea = this._canvas.elementHandler.getWorkArea();
    // 현재의 viewportTransform을 임시로 저장
    const viewportTransformCache = [...this._canvas.viewportTransform];
    // 현재의 줌을 작업영역의 세로 240px에 맞추기
    const zoomToHeight240 = 240 / workarea.height;
    // 뷰포트를 줌에 맞춰 변경 및 0,0에 맞춤, [4] = 0, [5] = 0
    this._canvas.viewportTransform = [zoomToHeight240, 0, 0, zoomToHeight240, 0, 0];

    // dataUrl 생성
    const dataUrl = this._canvas.toDataURL({
      format: 'jpeg',
      width: workarea.width * zoomToHeight240,
      height: 240,
    });

    // 뷰포트를 원래대로 되돌리기
    this._canvas.viewportTransform = viewportTransformCache;

    return dataUrl;
  };

  /**
   * dataURL을 File로 변환하는 helper함수
   *
   * @author 오지민 2023.02.12
   * @param dataUrl File로 변환할 dataUrl
   * @param fileName File의 이름
   * @returns dataUrl을 File로 변환한 결과
   */
  private dataURLtoFile = (dataUrl: string, fileName: string) => {
    let arr = dataUrl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], fileName, { type: mime });
  };

  /**
   * 썸네일 파일을 만드는 함수
   *
   * @author 오지민 2023.02.21
   * @returns thumbnail 파일
   */
  public generateThumbnail = () => {
    const dataUrl = this.exportAsDataUrl();
    const thumbnail = this.dataURLtoFile(dataUrl, '_thumbnail.png');
    return thumbnail;
  };
}
