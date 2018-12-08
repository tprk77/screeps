// Copyright (c) 2018 Tim Perkins

declare interface CreepMemory {
  // General memory
  role: string;
  sourceId?: string;

  // Harvester memory
  harvesting: boolean;
  fullEnergyThreshold: number;

  // Upgrader memory
  upgrading: boolean;

  // Builder memory
  building: boolean;
  buildFlagName: string;

  // Waller memory
  walling: boolean;

  // Attacker memory
  attackFlagName: string;

  // Claimer memory
  claimFlagName: string;

  // Reserver memory
  reserveFlagNames: string[];
  currentReserveFlagName: string|null;
}
