import {BaseCanvas} from './base-canvas';
import {Layer} from './layer';
import {RenderParams, Size} from './types';

/**
 * Scene is top-level entity of scene structure.
 * Scene must contain one layer at least
 */
export class Scene extends BaseCanvas {
	private _renderHasScheduled: boolean = false;
	private _renderWithResize: boolean = true;

	constructor(childNodes?: Layer<object>[]) {
		super();

		this._onChildrenRenderRequest(() => {
			this._scheduleRender();
		});

		if (childNodes) {
			this.append(...childNodes);
		}
	}

	render(params: RenderParams) {
		this._renderChildren(params);
		this._renderFunction({
			selfCanvas: this,
			childrenCanvas: this._childrenCanvas
		});
	}

	setSize({width, height}: Size) {
		this.width = width;
		this.height = height;

		this._scheduleRender(true);
	}

	private _scheduleRender(widthResize?: boolean) {
		if (widthResize) {
			this._renderWithResize = true;
		}

		if (this._renderHasScheduled) {
			return;
		}

		this._renderHasScheduled = true;

		requestAnimationFrame(() => {
			this.render({
				size: {
					width: this.width,
					height: this.height
				},
				isForceRender: this._renderWithResize
			});
			this._renderWithResize = false;
			this._renderHasScheduled = false;
		});
	}
}