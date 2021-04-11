import { ExtendableHTMLCanvasElement } from './extendable-html-canvas-element';
import { syncSize } from './sync-size';
import { RenderParams } from './types';

type RenderFunctionParams = {
  selfCanvas: HTMLCanvasElement;
  childrenCanvas: HTMLCanvasElement;
};

/**
 * BaseCanvas implements base behavior of canvas node which can be rendered on a scene.
 * @extends ExtendableHTMLCanvasElement (HTMLCanvasElement)
 */
export abstract class BaseCanvas extends ExtendableHTMLCanvasElement {
  protected _childrenCanvas: HTMLCanvasElement;

  constructor() {
    super();
    this._childrenCanvas = document.createElement('canvas');
  }

  requestRender() {
    const parent = this.parentElement;

    if (!parent) {
      return;
    }

    this._onRequestRender();

    if (parent instanceof BaseCanvas) {
      parent.requestRender();
    }
  }

  protected _renderChildren({ size, isForceRender }: RenderParams) {
    if (isForceRender) {
      syncSize(this._childrenCanvas, size);
    }

    const children2dContext = this._childrenCanvas.getContext('2d');
    if (children2dContext) {
      children2dContext.clearRect(
        0,
        0,
        this._childrenCanvas.width,
        this._childrenCanvas.height
      );
      this.childNodes.forEach((node) => {
        if (node instanceof BaseCanvas) {
          node.render({ size, isForceRender });
          children2dContext.drawImage(node, 0, 0);
        }
      });
    }
  }

  protected _renderFunction({
    selfCanvas,
    childrenCanvas,
  }: RenderFunctionParams): any {
    const ctx = selfCanvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, selfCanvas.width, selfCanvas.height);
      ctx.drawImage(childrenCanvas, 0, 0);
    }
  }

  protected abstract _onRequestRender(): void;

  abstract render(params: RenderParams): void;
}
