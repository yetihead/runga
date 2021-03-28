import {BaseCanvas} from './base-canvas';
import {Layer} from './layer';
import {RenderParams} from './types';

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

		this.addEventListener('resize', () => {
			this._renderWithResize = true;
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

	private _scheduleRender() {
		if (this._renderHasScheduled) {
			return;
		}

		this._renderHasScheduled = true;

		const renderParams = {
			size: {
				width: this.width,
				height: this.height
			},
			isForceRender: this._renderWithResize
		};

		requestAnimationFrame(() => {
			this.render(renderParams);
			this._renderWithResize = false;
			this._renderHasScheduled = false;
		});
	}
}