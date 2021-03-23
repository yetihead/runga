/**
 * An instance of HTMLCanvasElement can't be created with 'new HTMLCanvasElement()'
 * DOM nodes (including canvas) can be created by 'document.createElement(...)'.
 * It makes impossible to extend HTMLCanvasElement directly and create an instance with the 'new' operator.
 *
 * You can extend this class, which creates canvas by using 'document.createElement()' under the hood
 */
export const ExtendableHTMLCanvasElement = (function () {
  function ExtendableHTMLCanvasElement(this: object) {
    const thisNode = document.createElement('CANVAS');
    Object.setPrototypeOf(thisNode, Object.getPrototypeOf(this));
    return thisNode;
  }

  ExtendableHTMLCanvasElement.prototype = HTMLCanvasElement.prototype;

  return ExtendableHTMLCanvasElement as unknown as typeof HTMLCanvasElement;
})();
