import {CMD, BattTypes, ErrorCodes} from './constants'
import ChargeInfo from './ChargeInfo'

export default class Protocol {
  static generateRequest(cmd, data) {
    let c = new Buffer.alloc(65)
    let length = 3
    c[0] = 0x00
    c[1] = 0x0f // CMD.UART_DATA_START ?
    c[3] = cmd
    c[4] = 0x00

    // byte num1 = 0;
    // byte num3 = (byte) ((uint) (byte) ((uint) num1 + (uint) c[3]) + (uint) c[4]);
    let num3 = cmd
    let index1 = 5


    if(cmd <= 87)
    {
      switch (cmd)
      {
        case CMD.START_CHARGER:
          c[index1] = data.BattType.id;
          c[index1 + 1] = data.Cells;
          c[index1 + 2] = data.PwmMode
          c[index1 + 3] = parseInt(data.CCurrent / 256);
          c[index1 + 4] = parseInt(data.CCurrent % 256);
          c[index1 + 5] = parseInt(data.DCurrent / 256);
          c[index1 + 6] = parseInt(data.DCurrent % 256);
          c[index1 + 7] = parseInt(data.CellVoltage / 256);
          c[index1 + 8] = parseInt(data.CellVoltage % 256);
          c[index1 + 9] = parseInt(data.EndVoltage / 256);
          c[index1 + 10] = parseInt(data.EndVoltage % 256);

          if(data.PwmMode > 2 && (data.BattType == BattTypes.NiCd || data.BattType == BattTypes.NiMH)) {
            if(data.PwmMode == 3) {
              c[index1 + 11] = data.R_PeakCount
              c[index1 + 12] = 0x00
            } else if(data.PwmMode == 4) {
              c[index1 + 11] = data.CycleType;
              c[index1 + 12] = data.Cyc_count;
            }
          } else  {
            c[index1 + 11] = 0x00;
            c[index1 + 12] = 0x00;
          }
          c[index1 + 13] = parseInt(data.Trickle / 256);
          c[index1 + 14] = parseInt(data.Trickle % 256);
          c[index1 + 15] = 0x00;
          c[index1 + 16] = 0x00;
          c[index1 + 17] = 0x00;
          c[index1 + 18] = 0x00;
          for (let i = index1; i <= index1 + 18; ++i)
            num3 += c[i];
          length += 19
          index1 += 19
          break;
        case CMD.SYSTEM_SET_SAVE:
          // byte num5 = 0;
          // c[3] = CMD;
          // c[4] = data.cmd1;
          // c[5] = (byte) 0;
          // num3 = (byte) ((uint) (byte) ((uint) (byte) ((uint) num5 + (uint) c[3]) + (uint) c[4]) + (uint) c[5]);
          // index1 = 6;
          // switch (data.cmd1)
          // {
          //   case 0:
          //     c[index1++] = Convert.ToByte(data.CycleTime);
          //     num3 += c[index1 - 1];
          //     break;
          //   case 1:
          //     byte[] numArray1 = c;
          //     int index3 = index1;
          //     int num6 = 1;
          //     int num7 = index3 + num6;
          //     int num8 = (int) Convert.ToByte(data.TimeLimitEnable);
          //     numArray1[index3] = (byte) num8;
          //     byte num9 = (byte) ((uint) num3 + (uint) c[num7 - 1]);
          //     byte[] numArray2 = c;
          //     int index4 = num7;
          //     int num10 = 1;
          //     int num11 = index4 + num10;
          //     int num12 = (int) Convert.ToByte(data.TimeLimit / 256);
          //     numArray2[index4] = (byte) num12;
          //     byte num13 = (byte) ((uint) num9 + (uint) c[num11 - 1]);
          //     byte[] numArray3 = c;
          //     int index5 = num11;
          //     int num14 = 1;
          //     index1 = index5 + num14;
          //     int num15 = (int) Convert.ToByte(data.TimeLimit % 256);
          //     numArray3[index5] = (byte) num15;
          //     num3 = (byte) ((uint) num13 + (uint) c[index1 - 1]);
          //     break;
          //   case 2:
          //     byte[] numArray4 = c;
          //     int index6 = index1;
          //     int num16 = 1;
          //     int num17 = index6 + num16;
          //     int num18 = (int) Convert.ToByte(data.CapLimitEnable);
          //     numArray4[index6] = (byte) num18;
          //     byte num19 = (byte) ((uint) num3 + (uint) c[num17 - 1]);
          //     byte[] numArray5 = c;
          //     int index7 = num17;
          //     int num20 = 1;
          //     int num21 = index7 + num20;
          //     int num22 = (int) Convert.ToByte(data.CapLimit / 256);
          //     numArray5[index7] = (byte) num22;
          //     byte num23 = (byte) ((uint) num19 + (uint) c[num21 - 1]);
          //     byte[] numArray6 = c;
          //     int index8 = num21;
          //     int num24 = 1;
          //     index1 = index8 + num24;
          //     int num25 = (int) Convert.ToByte(data.CapLimit % 256);
          //     numArray6[index8] = (byte) num25;
          //     num3 = (byte) ((uint) num23 + (uint) c[index1 - 1]);
          //     break;
          //   case 3:
          //     byte[] numArray7 = c;
          //     int index9 = index1;
          //     int num26 = 1;
          //     int num27 = index9 + num26;
          //     int num28 = (int) Convert.ToByte(data.KeyBuzz);
          //     numArray7[index9] = (byte) num28;
          //     byte num29 = (byte) ((uint) num3 + (uint) c[num27 - 1]);
          //     byte[] numArray8 = c;
          //     int index10 = num27;
          //     int num30 = 1;
          //     index1 = index10 + num30;
          //     int num31 = (int) Convert.ToByte(data.SysBuzz);
          //     numArray8[index10] = (byte) num31;
          //     num3 = (byte) ((uint) num29 + (uint) c[index1 - 1]);
          //     break;
          //   case 5:
          //     c[index1++] = Convert.ToByte(data.TempLimit);
          //     num3 += c[index1 - 1];
          //     break;
          // }
          // num2 = num2 + index1 - 5;
          // break;
          break;
      }
    }


    c[2] = length;
    c[index1] = num3;
    c[index1+1] = 0xff;
    c[index1+2] = 0xff;
    return c;
  }

  static sliceResponse(res) {
    if(res.length < 7 || res[2] > res.length) {
      return Buffer.alloc(1)
    }

    // TODO: test checksum

    switch (res[3]) {
      case CMD.TAKE_DATA:
      case CMD.SYSTEM_FEED:
      case CMD.MACHINE_ID:
        return res.slice(5, res[2]+2)

      case CMD.STOP_CHARGER:
        return Buffer.alloc(2)

      default:
        return Buffer.alloc(1)
    }
  }
  static isReplyData(res) {
    return (res[1] == 0xf0 && res[2] == 0xff && res[3] == 0xff)
  }

  static parseMachineInfo(res) {
    res = res.slice(1)
    return {
      machineId: res.slice(0,6).toString(),
      coreType: '', // TODO
      upgradeType: res[6],
      isEncrypted: !!res[7],
      customerId: res[8] * 256 + res[9],
      languageId: res[10],
      softwareVersion: res[11] + res[12]/100.0,
      hardwareVersion: res[13],
      reserved: res[14],
      mctype: res[14],
      checksum: res[15]
    }
  }

  static parseTakeData(res) {
    let chargeInfo = new ChargeInfo
    chargeInfo.workState = res[0]

    if(chargeInfo.workState == 4) {
      chargeInfo.errorCode = res[1] * 256 + res[2];
      return chargeInfo
    } else {
      let index = -1

      chargeInfo.ChargeMah = res[index+2] * 256 + res[index+3];
      chargeInfo.ChargeTimer = res[index+4] * 256 + res[index+5];
      chargeInfo.OutVoltage = res[index+6] * 256 + res[index+7];
      chargeInfo.Current = res[index+8] * 256 + res[index+9];
      chargeInfo.ExtTemp = res[index+10];
      chargeInfo.IntTemp = res[index+11];
      chargeInfo.Intimpedance = res[index+12] * 256 + res[index+13];

      index += 14

      chargeInfo.CELL1 = res[index+0] * 256 + res[index+1];
      chargeInfo.CELL2 = res[index+2] * 256 + res[index+3];
      chargeInfo.CELL3 = res[index+4] * 256 + res[index+5];
      chargeInfo.CELL4 = res[index+6] * 256 + res[index+7];
      chargeInfo.CELL5 = res[index+8] * 256 + res[index+9];
      chargeInfo.CELL6 = res[index+10] * 256 + res[index+11];


      chargeInfo.CELL7 = res[index+12] * 256 + res[index+13];
      chargeInfo.CELL8 = res[index+14] * 256 + res[index+15];

      return chargeInfo
    }
  }

}
