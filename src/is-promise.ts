export const isPromise = (something: object): Boolean => Promise.resolve(something) === something;
