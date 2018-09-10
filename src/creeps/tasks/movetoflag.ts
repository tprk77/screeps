// Copyright (c) 2018 Tim Perkins

export class MoveToFlag {
  private static readonly FLAG_DISTANCE_THRESHOLD = 2;

  private flag: Flag;

  constructor(flag: Flag) {
    this.flag = flag;
  }

  public static forFlag(flag: Flag|null): MoveToFlag|null {
    return flag ? new MoveToFlag(flag) : null;
  }

  public run(creep: Creep): boolean {
    if (creep.room !== this.flag.room
        || !creep.pos.inRangeTo(this.flag, MoveToFlag.FLAG_DISTANCE_THRESHOLD)) {
      creep.moveTo(this.flag, {visualizePathStyle: {stroke: "#ffffff"}});
      return true;
    } else {
      return false;
    }
  }
}

export class MoveToFlagRoom {
  private flag: Flag;

  constructor(flag: Flag) {
    this.flag = flag;
  }

  public static forFlag(flag: Flag|null): MoveToFlagRoom|null {
    return flag ? new MoveToFlagRoom(flag) : null;
  }

  public run(creep: Creep): boolean {
    if (creep.room !== this.flag.room) {
      creep.moveTo(this.flag, {visualizePathStyle: {stroke: "#ffffff"}});
      return true;
    } else {
      return false;
    }
  }
}
