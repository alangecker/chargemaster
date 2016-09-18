export const CMD = {
  START_CHARGER: 5,
  STOP_CHARGER: 254,
  SYSTEM_SET_SAVE: 17,
  TAKE_DATA: 85,
  SYSTEM_FEED: 90,
  STATUS_FEED: 95,
  EN_BUZZ: 128,
  MACHINE_ID: 87,
  USB_UPDATE: 136
}
export const STATE = {
  RUNNING: 1,
  IDLE: 2,
  FINISH: 3,
  ERROR: 4
}



const LiPwmModes = [
  'charge',
  'discharge',
  'storage',
  'fastchg',
  'balance'
];
const NiPwmModes = [
  'charge',
  'autocharge',
  'discharge',
  'repeak',
  "CYCLE"
];
const PbPwmModes = [
  'charge',
  'discharge'
];


export const BattTypes =  {
  "LiPo": {
    id: 0,
    CellVoltage: 3200,
    EndVoltage: 4200,
    modes: LiPwmModes
  },
  "LiIon": {
    id: 1,
    CellVoltage: 3100,
    EndVoltage: 4100,
    modes: LiPwmModes
  },
  "LiFe": {
    id: 2,
    CellVoltage: 2800,
    EndVoltage: 3600,
    modes: LiPwmModes
  },
  "LiHv": {
    id:3,
    CellVoltage: 3000,
    EndVoltage: 4350,
    modes: LiPwmModes
  },
  "NiMH": {
    id:4,
    CellVoltage: 900,
    EndVoltage: 4,
    modes: NiPwmModes
  },
  "NiCd": {
    id:5,
    CellVoltage: 900,
    EndVoltage: 4,
    modes: NiPwmModes
  },
  "Pb":  {
    id:6,
    CellVoltage: 1800,
    EndVoltage: 0,
    modes: PbPwmModes
  }
}




export const ErrorCodes = {
  2048: "CONTROL FAIL",
  2304: "BREAK DWN!",
  4096: "INPUT FAIL",
  1280: "OVER TIME LIMIT",
  1536: "OVER CHARGE CAPACITY LIMIT",
  1792: "REVERSE POLARITY",
  512:  "EXT.TEMP TOO HI",
  768:  "DC IN TOO LOW",
  1024: "DC IN TOO HI",
  11: "CONNECTION BREAK",
  12: "CELL ERROR VOLTAGE INVALID",
  13: "BALANCE CONNECT ERROR",
  14: "NO BATTERY",
  15: "CELL NUMBER INCORRECT!",
  16: "Connect error, check main port",
  17: "Battery was full",
  18: "NOT NEED CHARGE",
  19: "CELL ERROR HIGH VOLTAGE",
  20: "CONNECTION BREAK",
  21: "CONNECTION BREAK",
  22: "CONNECTION BREAK",
  256:  "INT.TEMP TOO HI"
}




// unused, found in disassembled code
  // const DATA_END2 = 255;
  // const DATA_END1 = 255;
  //
  // const product_ID = 0;
  // const CHAGE_MOVDATA_ST = 4;
  // const CHAGE_MOVCMD_ST = 2;
  // const CHAGE_MOVSYS_ST = 5;
  // const UART_DATA_START = 15;
  // const SEND_DATA_ST = 4;
