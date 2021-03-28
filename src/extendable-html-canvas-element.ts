/**
 * An instance of HTMLCanvasElement can't be created with 'new HTMLCanvasElement()'
 * DOM nodes (include canvas) can be created by 'document.createElement(...)'.
 * It makes impossible to extend HTMLCanvasElement directly and create an instance with the 'new' operator.
 *
 * You can extend this class, which creates canvas by using 'document.createElement()' under the hood
 */
export const ExtendableHTMLCanvasElement = (function() {
	function ExtendableHTMLCanvasElement () {
		const thisNode = document.createElement('CANVAS');
		Object.setPrototypeOf(thisNode, Object.getPrototypeOf(this));
		return thisNode;
	};

	ExtendableHTMLCanvasElement.prototype = HTMLCanvasElement.prototype;

	// @ts-ignore
	return ExtendableHTMLCanvasElement as typeof HTMLCanvasElement
})();
