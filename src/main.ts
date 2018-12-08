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
  const claimedRooms = _.filter(Game.rooms as {[roomName: string]: Room}, (room) => {
    return room.controller && room.controller.my;
  });
  // Run the colonies, one per claimed room
  for (const room of claimedRooms) {
    Colony.run(room);
  }
}
