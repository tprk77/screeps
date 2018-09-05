// Copyright (c) 2018 Tim Perkins

interface Task {
  run: (creep: Creep) => boolean;
}

/**
 * Tries to tasks in order, until one is eligible to run.
 */
export function runTasks(creep: Creep, tasks: (Task|null)[]) {
  _.some(tasks, (task) => task && task.run(creep));
}

/**
 * Tries to get a value from memory, or sets it with the initializer.
 */
export function getOrSetMemory<T>(creep: Creep, memoryPath: string, initializer: () => T): T {
  _.set(creep.memory, memoryPath, initializer());
  return _.get(creep.memory, memoryPath);
}

/**
 * Gets the energy a creep can harvest without dropping any.
 *
 * TODO: Consider boosted parts!
 */
export function getEnergyPerHarvest(creep: Creep): number {
  const numWorkParts = _.filter(creep.body, (part) => part.type === WORK).length;
  return HARVEST_POWER * numWorkParts;
}

/**
 * Gets the energy a creep can harvest without dropping any.
 */
export function getNoDropEnergyCapacity(creep: Creep, energyPerHarvest?: number): number {
  if (!energyPerHarvest) {
    energyPerHarvest = getEnergyPerHarvest(creep);
  }
  return creep.carryCapacity - (creep.carryCapacity % energyPerHarvest);
}

/**
 * If the creep has this much energy or more, it can't harvest again without dropping energy.
 */
export function getNoDropEnergyThreshold(creep: Creep): number {
  const energyPerHarvest = getEnergyPerHarvest(creep);
  const noDropEnergyCapacity = getNoDropEnergyCapacity(creep, energyPerHarvest);
  return noDropEnergyCapacity - energyPerHarvest + 1;
}
