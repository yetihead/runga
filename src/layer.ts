import {BaseCanvas} from './base-canvas';
import {syncSize} from './sync-size';
import {RENDER_REQUEST_EVENT_NAME} from './constants';
import {RenderParams} from './types';

type RenderFunction<Data extends object> = (params: {
	data: Data;
	selfCanvas: HTMLCanvasElement;
	childrenCanvas: HTMLCanvasElement;
}) => void;

type Params<Data extends object> =
	[RenderFunction<Data>]|
	[HTMLCanvasElement[]]|
	[RenderFunction<Data>, HTMLCanvasElement[]]

/**
 * Layer of a scene can contain othe child layers
 * or render image by itself.
 */
export class Layer<Data extends object> extends BaseCanvas {
	private _hasRequestedRender = true;
	private _isFirstRender = true;
	private _data: Data;

	constructor(...params: Params<Data>) {
		super();

		let renderFunction: RenderFunction<Data>;
		let childNodes: HTMLCanvasElement[];

		switch (params.length) {
			case 1:
				if (typeof params[0] === 'function') {
					[renderFunction] = params;
				} else {
					[childNodes] = params;
				}
				break;
			case 2:
				[renderFunction, childNodes] = params;
		}

		if (renderFunction) {
			this._renderFunction = renderFunction;
		}

		if (childNodes) {
			this.append(...childNodes);
		}

		this._onChildrenRenderRequest((e) => {
			e.stopPropagation();
			this._requestRender();
		});
	}

	private _requestRender() {
		this._hasRequestedRender = true;
		this.dispatchEvent(
			new CustomEvent(RENDER_REQUEST_EVENT_NAME, {bubbles: true})
		);
	}

	setData(data: Partial<Data>) {
		this._data = {
			...this._data,
			...data
		};

		this._requestRender();
	}

	render({size, isForceRender}: RenderParams) {
		const needToRedraw = isForceRender || this._isFirstRender;
		this._isFirstRender = false;

		if (needToRedraw) {
			syncSize(this, size);
		}

		this._renderChildren({size, isForceRender});

		if (needToRedraw || this._hasRequestedRender) {
			this._hasRequestedRender = false;
			this._renderFunction.call(undefined, {
				data: this._data,
				selfCanvas: this,
				childrenCanvas: this._childrenCanvas
			});
		}
	}
}
