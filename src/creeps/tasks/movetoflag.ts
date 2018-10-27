// Copyright (c) 2018 Tim Perkins

export class MoveToFlag {
  public static readonly FLAG_DISTANCE_THRESHOLD = 2;

  private _flag: Flag;

  constructor(flag: Flag) {
    this._flag = flag;
  }

  public static forFlag(flag: Flag|null): MoveToFlag|null {
    return flag ? new MoveToFlag(flag) : null;
  }

  public run(creep: Creep): boolean {
    if (creep.room !== this._flag.room
        || !creep.pos.inRangeTo(this._flag, MoveToFlag.FLAG_DISTANCE_THRESHOLD)) {
      creep.moveTo(this._flag, {visualizePathStyle: {stroke: "#ffffff"}});
      return true;
    } else {
      return false;
    }
  }
}

export class MoveToFlagRoom {
  private _flag: Flag;

  constructor(flag: Flag) {
    this._flag = flag;
  }

  public static forFlag(flag: Flag|null): MoveToFlagRoom|null {
    return flag ? new MoveToFlagRoom(flag) : null;
  }

  public run(creep: Creep): boolean {
    if (creep.room !== this._flag.room) {
      creep.moveTo(this._flag, {visualizePathStyle: {stroke: "#ffffff"}});
      return true;
    } else {
      return false;
    }
  }
}
