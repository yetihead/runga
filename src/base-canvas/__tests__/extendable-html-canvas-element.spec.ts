import { ExtendableHTMLCanvasElement } from '../extendable-html-canvas-element';

describe('ExtendableHTMLCanvasElement', () => {
  it('should create instance using `document.createElement method`', () => {
    const spy = jest
      .spyOn(global.document, 'createElement')
      .mockReturnValue({} as HTMLCanvasElement);

    new ExtendableHTMLCanvasElement();

    expect(spy).toBeCalledWith('CANVAS');

    spy.mockClear();
  });

  it('should be the same object which was returned from `createElement`', () => {
    const theNewCanvas = {};

    const spy = jest
      .spyOn(global.document, 'createElement')
      .mockReturnValue(theNewCanvas as HTMLCanvasElement);

    const instance = new ExtendableHTMLCanvasElement();

    expect(instance).toBe(theNewCanvas);

    spy.mockClear();
  });

  it('should has right proto', () => {
    const spy = jest
      .spyOn(global.document, 'createElement')
      .mockReturnValue({} as HTMLCanvasElement);

    const instance = new ExtendableHTMLCanvasElement();

    expect(
      ExtendableHTMLCanvasElement.prototype !== Object.getPrototypeOf(instance)
    ).toBeTruthy();

    spy.mockClear();
  });
});
