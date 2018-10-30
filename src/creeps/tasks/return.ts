// Copyright (c) 2018 Tim Perkins

export class Return {

  public static run(creep: Creep): boolean {
    const spawn = Game.spawns.Spawn1;
    if (creep.room !== spawn.room) {
      creep.moveTo(spawn, {visualizePathStyle: {stroke: "#ffffff"}});
      return true;
    } else {
      return false;
    }
  }
}
