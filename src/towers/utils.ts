// Copyright (c) 2018 Tim Perkins

/*
 * Get a the memory of a tower.
 */
export function getTowerMemory(tower: StructureTower): TowerMemory {
  if (tower.room.memory.towers[tower.id] == null) {
    tower.room.memory.towers[tower.id] = {} as TowerMemory;
  }
  return tower.room.memory.towers[tower.id];
}
