// Copyright (c) 2018 Tim Perkins

import {Role} from "../creeps/utils";

export {Role};

/**
 * Population targets by role.
 */
export interface RolePopulations {
  [roleName: string]: {population: number, atLevel?: number};
}

/**
 * Generate a creep name based on its role.
 */
export function generateCreepName(role: Role, tick: number): string {
  return _.capitalize(_.camelCase(role.ROLE_NAME)) + "_" + tick;
}

/**
 * Generate some creep memory based on its role.
 */
export function generateMemory(role: Role): CreepMemory {
  return {role: role.ROLE_NAME} as CreepMemory;
}

/**
 * Get the total cost of some parts.
 *
 * @param parts The parts to get the cost of.
 * @return The cost of all the parts.
 */
export function getPartsCost(parts: BodyPartConstant[]): number {
  return _.sum(parts, (part) => BODYPART_COST[part]);
}

/**
 * Find a collection of parts below a certain energy budget.
 *
 * @param energy The energy budget. The cost of all parts shall not exceed this number.
 * @param partGroups Any number of part groups to collect into the result. Each group is added to
 * the result as a single unit. The groups are added in reverse order. The first group may be
 * repeated in the result, according to the option.
 * @param repeatGroup If true, repeat the first group if possible. True by default.
 * @param minGroup If true, always return at least the last group, even if the cost of this group is
 * greater than the energy budget. (Don't return an empty result.) True by default.
 * @return The array of parts.
 *
 * **Example**
 *
 * Calling the following function:
 *
 *     getPartsForEnergy(X, [G, F], [E, D], [C, B, A])
 *
 * Could produce any of the following results:
 *
 *     [G, F, ..., G, F, E, D, C, B, A] // repeatGroup = true
 *     [G, F, E, D, C, B, A]
 *     [E, D, C, B, A]
 *     [C, B, A]
 *     [] // minGroup = false, Energy is below minimum cost!
 */
export function getPartsForEnergy(energy: number, partGroups: BodyPartConstant[][],
                                  repeatGroup: boolean = true,
                                  minGroup = true): BodyPartConstant[] {
  const parts: BodyPartConstant[] = [];
  let cost: number = 0;
  let partGroup: BodyPartConstant[]|null = null;
  let partGroupCost: number|null = null;
  // Loop trough all part groups in reverse
  for (let pgIndex = partGroups.length - 1; pgIndex >= 0; pgIndex--) {
    const maybePartGroup = partGroups[pgIndex];
    // Check for empty groups and stop early
    if (maybePartGroup.length) {
      partGroup = maybePartGroup;
      partGroupCost = getPartsCost(partGroup);
    } else {
      partGroup = null;
      partGroupCost = null;
      break;
    }
    // Check the cost against the budget
    if (cost + partGroupCost <= energy) {
      cost += partGroupCost;
      parts.push(...partGroup);
    } else {
      break;
    }
  }
  // Maybe add some more groups
  if (partGroup && partGroupCost) {
    if (minGroup && !parts.length) {
      // Add the min group if necessary
      parts.push(...partGroup);
    } else if (repeatGroup) {
      // Try to repeat the last part group
      while (cost + partGroupCost <= energy) {
        cost += partGroupCost;
        parts.push(...partGroup);
      }
    }
  }
  // Only use up to 50 parts
  return parts.slice(-50);
}

/**
 * Arrange parts according to a template.
 *
 * @param partTemplate The array of unique parts, determining the order of the result.
 * @param jumbledParts The parts to reorder according to the template.
 * @return The reordered parts.
 */
export function arrangeParts(partTemplate: BodyPartConstant[],
                             jumbledParts: BodyPartConstant[]): BodyPartConstant[] {
  const parts: BodyPartConstant[] = [];
  const partGroupings = _.groupBy(jumbledParts, _.identity);
  // Add the parts in the template
  for (const part of partTemplate) {
    parts.push(...partGroupings[part]);
    delete partGroupings[part];
  }
  // Add the parts not in the template
  const preParts: BodyPartConstant[] = [];
  for (const part in partGroupings) {
    preParts.push(...partGroupings[part]);
  }
  return preParts.concat(parts);
}

/**
 * Finds the best body possible for the given cost.
 *
 * @param energy The energy budget. The cost of all parts shall not exceed this number.
 * @param partTemplate The array of unique parts, determining the order of the result.
 * @param partGroups Any number of part groups to collect into the result. Each group is added to
 * the result as a single unit. The groups are added in reverse order. The first group may be
 * repeated in the result, according to the option.
 * @param repeatGroup If true, repeat the first group if possible. True by default.
 * @param minGroup If true, always return at least the last group, even if the cost of this group is
 * greater than the energy budget. (Don't return an empty result.) True by default.
 * @return The array of parts.
 */
export function getBestPartsForEnergy(energy: number, partTemplate: BodyPartConstant[],
                                      partGroups: BodyPartConstant[][], repeatGroup: boolean = true,
                                      minGroup = true): BodyPartConstant[] {
  return arrangeParts(partTemplate, getPartsForEnergy(energy, partGroups, repeatGroup, minGroup));
}
