import {BaseCanvas} from './base-canvas';
import {syncSize} from './sync-size';
import {isPromise} from './is-promise';
import {RENDER_REQUEST_EVENT_NAME} from './constants';
import {RenderParams} from './types';

type RenderFunctionResultType<Data extends object> = undefined|Partial<Data>|Promise<Partial<Data>>;

type RenderFunctionParams<Data extends object> = {
	data: Partial<Data>;
	selfCanvas: HTMLCanvasElement;
	childrenCanvas: HTMLCanvasElement;
};

type RenderFunction<Data extends object> = (params: RenderFunctionParams<Data>) => RenderFunctionResultType<Data>;

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
	private _data: Partial<Data> = {};

	constructor(...params: Params<Data>) {
		super();

		let renderFunction: RenderFunction<Data>|undefined;
		let childNodes: HTMLCanvasElement[]|undefined;

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

	protected _renderFunction(params: RenderFunctionParams<Data>) {
		return super._renderFunction.call(this, params);
	};

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
			const result: RenderFunctionResultType<Data> = this._renderFunction.call(undefined, {
				data: this._data,
				selfCanvas: this,
				childrenCanvas: this._childrenCanvas
			});

			if (!result) {
				return;
			}

			if (isPromise(result)) {
				// @ts-ignore
				result.then((data) => this.setData(data));
				return;
			}

			// @ts-ignore
			this.setData(result);
		}
	}
}
