// Copyright (c) 2018 Tim Perkins

declare interface RoomMemory {
  // Colony creep names
  creepNames: string[];

  // Source IDs
  sourceIds: string[];

  // Miner creep names (Index corresponds to source)
  minerNameForSourceId: {[sourceId: string]: string|null};

  // TODO
  // reservedRoomNames: string[];
}
