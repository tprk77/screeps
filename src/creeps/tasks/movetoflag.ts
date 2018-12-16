// Copyright (c) 2018 Tim Perkins

export class MoveToFlag {

  public static readonly DEFAULT_FLAG_RANGE = 2;

  private _flag: Flag;
  private _flagRange: number;

  private constructor(flag: Flag, flagRange: number) {
    this._flag = flag;
    this._flagRange = flagRange;
  }

  public static forFlag(flag: Flag, flagRange: number = MoveToFlag.DEFAULT_FLAG_RANGE): MoveToFlag {
    return new MoveToFlag(flag, flagRange);
  }

  public run(creep: Creep): boolean {
    if (creep.room !== this._flag.room || !creep.pos.inRangeTo(this._flag, this._flagRange)) {
      creep.moveTo(this._flag, {visualizePathStyle: {stroke: "#ffffff"}});
      return true;
    } else {
      return false;
    }
  }
}

export class MoveToFlagRoom {

  private _flag: Flag;

  private constructor(flag: Flag) {
    this._flag = flag;
  }

  public static forFlag(flag: Flag): MoveToFlagRoom {
    return new MoveToFlagRoom(flag);
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
