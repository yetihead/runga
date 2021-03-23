import { vitest, describe, expect, it } from 'vitest';
import { ExtendableHTMLCanvasElement } from '../ExtendableHTMLCanvasElement';

describe('ExtendableHTMLCanvasElement', () => {
  it('should create instance using `document.createElement method`', () => {
    const spy = vitest
      .spyOn(global.document, 'createElement')
      .mockReturnValue({} as HTMLCanvasElement);

    new ExtendableHTMLCanvasElement();

    expect(spy).toBeCalledWith('CANVAS');

    spy.mockClear();
  });

  it('should be the same object which was returned from `createElement`', () => {
    const theNewCanvas = {};

    const spy = vitest
      .spyOn(global.document, 'createElement')
      .mockReturnValue(theNewCanvas as HTMLCanvasElement);

    const instance = new ExtendableHTMLCanvasElement();

    expect(instance).toBe(theNewCanvas);

    spy.mockClear();
  });

  it('should have correct prototype', () => {
    const spy = vitest
      .spyOn(global.document, 'createElement')
      .mockReturnValue({} as HTMLCanvasElement);

    const instance = new ExtendableHTMLCanvasElement();

    expect(
      ExtendableHTMLCanvasElement.prototype === Object.getPrototypeOf(instance)
    ).toBeTruthy();

    spy.mockClear();
  });
});
