export const isPromise = (something: object): Boolean => {
  return Promise.resolve(something) === something;
};
