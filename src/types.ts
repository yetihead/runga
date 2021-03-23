export type DataType = Record<string, any>;

export type RenderContext<Data extends DataType> = {
  data: Data;
  canvas: HTMLCanvasElement;
};

export type RenderFunction<Data extends DataType> = (
  context: RenderContext<Data>
) => boolean;

export interface Size {
  width: number;
  height: number;
}

export type SetDataFunction<Data extends DataType> = (prevData: Data) => Data;
