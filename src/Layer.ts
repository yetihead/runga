import { ExtendableHTMLCanvasElement } from './ExtendableHTMLCanvasElement.js';
import { DataType, RenderFunction, Size, SetDataFunction } from './types';

export interface LayerProps<Data extends DataType> {
  name: string;
  data: Data;
  render?: RenderFunction<Data>;
  children?: Layer<DataType>[];
  onRender?: () => void;
}

/**
 * Symbol keys are used to allow access to methods in parent-child relation,
 * but to hide from external code.
 */
const REQUEST_RENDER_KEY = Symbol('REQUEST_RENDER_KEY');
const RENDER_KEY = Symbol('RENDER_KEY');

export class Layer<Data extends DataType> extends ExtendableHTMLCanvasElement {
  #data: Data;
  #hasRequestedRender: boolean = false;
  #renderFunction?: RenderFunction<Data>;
  #onRender?: () => void;

  constructor(props: LayerProps<Data>) {
    super();

    this.#data = props.data;
    this.#onRender = props.onRender;
    this.#renderFunction = props.render;

    const children = props.children;
    if (children?.length) {
      this.append(...children);
    }

    this[REQUEST_RENDER_KEY]();
  }

  [RENDER_KEY] = (size: Size) => {
    if (!this.syncSize(size) && !this.#hasRequestedRender) {
      return;
    }

    const canvasCtx = this.getContext('2d');
    if (!canvasCtx) {
      return;
    }

    canvasCtx.clearRect(0, 0, this.width, this.height);

    for (const child of this.children) {
      if (child instanceof Layer) {
        child[RENDER_KEY](this);
        canvasCtx.drawImage(child, 0, 0);
      }
    }

    this.#renderFunction?.({
      data: this.#data,
      canvas: this,
    });

    this.#hasRequestedRender = false;
    this.#onRender?.();
  };

  [REQUEST_RENDER_KEY] = () => {
    if (this.#hasRequestedRender) {
      return;
    }

    this.#hasRequestedRender = true;

    if (this.parentElement instanceof Layer) {
      this.parentElement[REQUEST_RENDER_KEY]();
    } else {
      requestAnimationFrame(() => {
        this[RENDER_KEY](this);
      });
    }
  };

  public setData(arg: Data | SetDataFunction<Data>) {
    if (typeof arg === 'function') {
      this.#data = (arg as SetDataFunction<Data>)(this.#data);
    } else {
      this.#data = arg;
    }
    this[REQUEST_RENDER_KEY]();
  }

  public syncSize({ width, height }: Size): boolean {
    if (this.width === width && this.height === height) {
      return false;
    }
    this.width = width;
    this.height = height;
    this[REQUEST_RENDER_KEY]();
    return true;
  }
}
