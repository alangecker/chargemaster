export default class ChargeInfo {
  constructor() {
    this.workState = 0x00
    this.errorCode = 0

    this.OutVoltage = 0 // mV
    this.Current = 0  // mA
    this.ChargeTimer = 0 // s
    this.ChargeMah = 0 // mAh
    this.ExtTemp = 0
    this.IntTemp = 0
    this.Intimpedance = 0
    this.CELL1 = 0
    this.CELL2 = 0
    this.CELL3 = 0
    this.CELL4 = 0
    this.CELL5 = 0
    this.CELL6 = 0
    this.CELL7 = 0
    this.CELL8 = 0


    // unused variables found in decompiled Voltcraft Chargemaster
    //   this.BattType = 0
    //   this.ChargeMode = 0
    //   this.ChargeState = 0
    //   this.ChargePhase = 0
    //   this.SystemError = 0
    //   this.ChargeError = 0
    //   this.PwmMode = 0
    //   this.DcInBox = 0
  }
}
