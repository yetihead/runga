import { Size } from './types';

export const syncSize = <T extends Size>(target: T, size: Size): T => {
  target.width = size.width;
  target.height = size.height;

  return target;
};
