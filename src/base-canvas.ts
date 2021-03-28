import {ExtendableHTMLCanvasElement} from './extendable-html-canvas-element';
import {syncSize} from './sync-size';
import {RenderParams} from './types';
import {RENDER_REQUEST_EVENT_NAME} from './constants';

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

	protected _renderChildren({size, isForceRender}: RenderParams) {
		if (isForceRender) {
			syncSize(this._childrenCanvas, size);
		}

		const children2dContext = this._childrenCanvas.getContext('2d');
		children2dContext.clearRect(0, 0, this._childrenCanvas.width, this._childrenCanvas.height);

		this.childNodes.forEach((node) => {
			if (node instanceof BaseCanvas) {
				node.render({size, isForceRender});
				children2dContext.drawImage(node, 0, 0);
			}
		});
	}

	protected _renderFunction({selfCanvas, childrenCanvas}: RenderFunctionParams) {
		const ctx = selfCanvas.getContext('2d');
		ctx.clearRect(0, 0, selfCanvas.width, selfCanvas.height);
		ctx.drawImage(childrenCanvas, 0, 0);
	}

	protected _onChildrenRenderRequest(handler: (e: Event) => void) {
		this.addEventListener(RENDER_REQUEST_EVENT_NAME, (e) => {
			if (e.target === this) {
				return;
			}

			handler(e);
		});
	}

	abstract render(params: RenderParams): void;
}
