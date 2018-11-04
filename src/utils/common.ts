// Copyright (c) 2018 Tim Perkins

/**
 * Tries to get a value, or initializes it with the initializer.
 */
export function getOrInitialize<Memory, T>(obj: object, path: string, initializer: () => T): T {
  let value = _.get(obj, path) as T;
  if (value == null) {
    value = initializer();
    _.set(obj, path, value);
  }
  return value;
}
