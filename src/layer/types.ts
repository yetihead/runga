export type RenderFunctionResult<Data extends object> =
  | void
  | Partial<Data>
  | Promise<Partial<Data>>;

export type RenderFunctionParams<Data extends object> = {
  data: Partial<Data>;
  selfCanvas: HTMLCanvasElement;
  childrenCanvas: HTMLCanvasElement;
};

export type RenderFunction<Data extends object> = (
  params: RenderFunctionParams<Data>
) => RenderFunctionResult<Data>;

export type ConstructorParams<Data extends object> =
  | [RenderFunction<Data>]
  | [HTMLCanvasElement[]]
  | [RenderFunction<Data>, HTMLCanvasElement[]];
