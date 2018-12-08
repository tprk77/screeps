// Copyright (c) 2018 Tim Perkins

export const MY_USERNAME: string = (() => {
  const controller = _.find(Game.structures, (structure) => {
    return structure.structureType === STRUCTURE_CONTROLLER;
  }) as StructureController;
  return controller.owner.username;
})();

/**
 * Tries to get a value, or initializes it with the initializer.
 */
export function getOrInitialize<T>(obj: object, path: string, initializer: () => T): T {
  let value = _.get(obj, path) as T;
  if (value == null) {
    value = initializer();
    _.set(obj, path, value);
  }
  return value;
}
