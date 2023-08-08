import { CanvasObject } from '../objects/fabric.canvas';

export abstract class Handler {
  _canvas: CanvasObject;

  constructor(canvas: CanvasObject) {
    this._canvas = canvas;
  }
}
