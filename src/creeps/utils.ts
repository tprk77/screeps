// Copyright (c) 2018 Tim Perkins

/**
 * Creep role interface.
 */
export interface Role {
  ROLE_NAME: string;
  PART_TEMPLATE: BodyPartConstant[];
  PART_GROUPS: BodyPartConstant[][];
  REPEAT_PARTS: boolean;
  run: (creep: Creep) => void;
}

/**
 * Task interface, for running tasks. See also `runTasks`.
 */
interface Task {
  run: (creep: Creep) => boolean;
}

export function makeTask(lambda: (creep: Creep) => boolean): Task {
  return {
    run(creep: Creep): boolean {
      return lambda(creep);
    }
  };
}

export type FlagRetriever = (creep: Creep) => Flag|null;
export type TaskFromFlag = (flag: Flag) => Task;
export type WithFlagTask = (taskFromFlag: TaskFromFlag) => Task;

export function makeWithFlagTask(flagRetriever: FlagRetriever): WithFlagTask {
  return (taskFromFlag: TaskFromFlag) => {
    return {
      run(creep: Creep): boolean {
        const flag = flagRetriever(creep);
        if (flag) {
          return taskFromFlag(flag).run(creep);
        } else {
          return false;
        }
      }
    };
  };
}

/**
 * Tries to tasks in order, until one is eligible to run.
 */
export function runTasks(creep: Creep, tasks: (Task|null)[]) {
  _.some(tasks, (task) => task && task.run(creep));
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
