import {isPromise} from './is-promise';

import {
	BaseCanvas,
	syncSize,
	RenderParams
} from '../base-canvas';

import {
	RenderFunction,
	RenderFunctionParams,
	RenderFunctionResult,
	ConstructorParams
} from './types';

/**
 * Layer of a scene can contain othe child layers
 * or render image by itself.
 */
export class Layer<Data extends object> extends BaseCanvas {
	private _hasRequestedRender = true;
	private _isFirstRender = true;
	private _data: Partial<Data> = {};

	constructor(...params: ConstructorParams<Data>) {
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
	}

	protected _onRequestRender() {
		this._hasRequestedRender = true;
	}

	protected _renderFunction(params: RenderFunctionParams<Data>) {
		return super._renderFunction.call(this, params);
	};

	setData(data: Partial<Data>) {
		this._data = {
			...this._data,
			...data
		};

		this.requestRender();
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
			const result: RenderFunctionResult<Data> = this._renderFunction.call(undefined, {
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
