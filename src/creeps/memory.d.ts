// Copyright (c) 2018 Tim Perkins

declare interface CreepMemory {
  // General memory
  role: string;
  sourceId?: string;

  // Mutli-purpose state tracking
  working: boolean;

  // Mutli-purpose flags
  alphaFlagName: string|null;
  betaFlagName: string|null;
  gammaFlagName: string|null;

  // Possible candidate flags
  alphaCandidateFlagNames: string[];
  betaCandidateFlagNames: string[];
  gammaCandidateFlagNames: string[];
}
