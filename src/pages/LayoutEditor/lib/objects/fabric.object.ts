import { CanvasObject } from './fabric.canvas';
import { FrameObject } from './fabric.frame';
import { ImageObject } from './fabric.image';
import { ImageFrameObject } from './fabric.image_frame';
import { InputSourceObject } from './fabric.input_source';
import { TextBoxObject } from './fabric.textbox';
import { VideoObject } from './fabric.video';
import { WebPageObject } from './fabric.webpage';
import { WidgetObject } from './fabric.widget';
import { WorkArea } from './fabric.workarea';

// Fabric Object --------------------------------------------------------------
/**
 * @TODO 나중에 사용할 예정
 */
export interface IFabricObject {
  canvas: CanvasObject;
  apply<K extends keyof this>(key: K, value: this[K] | ((value: this[K]) => this[K])): this;
  commit(): void;
  toProperties(): any;
}

export type FabricObject =
  | WorkArea
  | TextBoxObject
  | ImageObject
  | VideoObject
  | FrameObject
  | ImageFrameObject
  | WebPageObject
  | InputSourceObject
  | WidgetObject;
