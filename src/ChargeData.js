export default class ChargeData {
  constructor() {
    this.BattType = 0;
    this.Cells = 1;
    this.PwmMode = 0;
    this.CCurrent = 100; // mA
    this.DCurrent = 100; // mA
    this.CellVoltage = 0; // mV
    this.EndVoltage = 0; // mV
    this.R_PeakCount = 1;
    this.CycleType = 1;
    this.Cyc_count = 1;
    this.Trickle = 0;



    // unused variables found in decompiled Voltcraft Chargemaster
    //  this.ChangeBattType = 0;
    //  this.CycleTime = 0;
    //  this.TimeLimitEnable = false;
    //  this.TimeLimit = 0;
    //  this.CapLimitEnable = false;
    //  this.CapLimit = 0;
    //  this.TempLimit = 0;
    //  this.KeyBuzz = false;
    //  this.SysBuzz = false;
    //  this.InDClow = 0;
    //  this.Voltage = 0;
    //  this.CELL1 = 0;
    //  this.CELL2 = 0;
    //  this.CELL3 = 0;
    //  this.CELL4 = 0;
    //  this.CELL5 = 0;
    //  this.CELL6 = 0;
    //  this.CELL7 = 0;
    //  this.CELL8 = 0;
    //  this.cmd1 = 0;
  }
  setTypeDefaults(type) {
    this.BattType = type
    this.CellVoltage = type.CellVoltage
    this.EndVoltage = type.EndVoltage
  }

  getModeName() {
    return this.BattType.modes[this.PwmMode];
  }
}
