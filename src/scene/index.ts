import {Layer} from '../layer';
import {
	BaseCanvas,
	RenderParams,
	Size
} from '../base-canvas';

/**
 * Scene is top-level entity of Runga scene structure.
 * Scene must contain one layer at least.
 */
export class Scene extends BaseCanvas {
	private _renderingHasScheduled: boolean = false;
	private _renderWithResize: boolean = true;

	constructor(childNodes?: Layer<object>[]) {
		super();

		if (childNodes) {
			this.append(...childNodes);
		}

		this._scheduleRender();
	}

	protected _onRequestRender() {
		this._scheduleRender();
	}

	render(params: RenderParams) {
		this._renderChildren(params);
		this._renderFunction({
			selfCanvas: this,
			childrenCanvas: this._childrenCanvas
		});
	}

	/**
	 * Use this method instead properies `width` and `height`
	 * to change size of all canvas of the scene
	 * @param {number} width
	 * @param {number} height
	 */
	setSize({width, height}: Size) {
		this.width = width;
		this.height = height;

		this._scheduleRender(true);
	}

	/**
	 * Schedule rendering the next frame
	 * @param {boolean} widthResize - reset size to all children
	 * @returns 
	 */
	private _scheduleRender(widthResize?: boolean) {
		if (widthResize) {
			this._renderWithResize = true;
		}

		if (this._renderingHasScheduled) {
			return;
		}

		this._renderingHasScheduled = true;

		requestAnimationFrame(() => {
			const isForceRender = this._renderWithResize;
			this._renderWithResize = false;
			this._renderingHasScheduled = false;
			this.render({
				size: {
					width: this.width,
					height: this.height
				},
				isForceRender
			});
		});
	}
}