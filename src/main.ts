// Copyright (c) 2018 Tim Perkins

import {Colony} from "./colonies/colony";

/**
 * The main loop!
 */
export function loop() {
  console.log("Current game tick is " + Game.time);
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
  // Find all controlled and claimed rooms
  const claimedRooms = _.filter(Game.rooms, (room) => {
    if (room.controller) {
      return room.controller.my && room.controller.level > 0;
    } else {
      return false;
    }
  });
  // Run the colonies, one per claimed room
  for (const room of claimedRooms) {
    Colony.run(room);
  }
}
