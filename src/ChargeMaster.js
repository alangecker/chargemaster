import HID from 'node-hid'
import EventEmitter from 'events'

import Protocol from './Protocol'
import ChargeData from './ChargeData'
import {CMD,STATE,BattTypes,ErrorCodes} from './constants'

const UPDATE_INTERVAL = 1000

function bufferToArray(buf) {
  let arr = []
  for(let i=0;i<buf.length;i++) {
    arr.push(buf[i])
  }
  return arr
}


export default class ChargeMaster extends EventEmitter {
  constructor(vendorId, productId) {
    super()
    if(typeof vendorId == 'object' && !productId) {
      productId = vendorId[1]
      vendorId = vendorId[0]
    }

    this.BattTypes = BattTypes
    this.curPackets = {}
    this.curPacketsReply = []
    this.status = {
      workState: 2
    }

    this.device = new HID.HID(vendorId, productId)
    this.emit('connected')

    this.device.on('data', this.handleData.bind(this))
    this.device.on('error', this.handleError.bind(this))

    setInterval(this.updateStatus.bind(this), UPDATE_INTERVAL)
  }


  handleData(data) {
    let shifted = Buffer.alloc(data.length+1)
    data.copy(shifted, 1)

    if(Protocol.isReplyData(shifted)) {
      // TODO: find out whats in ReplyData-Packet
      const cb = this.curPacketsReply.shift()
      cb()
      return
    }

    const cmd = shifted[3]
    const body = Protocol.sliceResponse(shifted)
    const cb = this.curPackets[cmd]
    if(cb) {
      this.curPackets[cmd] = undefined
      cb(body)
    } else {
      this.emit('error', `got packet without sending request (cmd: ${cmd})`)
    }

  }


  handleError(err) {
    this.emit('error', err)
  }


  sendData(cmd, data) {
    return new Promise( (resolve,reject) => {
      const s = Protocol.generateRequest(cmd, data)
      this.device.write(bufferToArray(s))

      if(cmd == CMD.START_CHARGER || cmd == CMD.STOP_CHARGER) {
        // resolve when an replydata packet is recieved
        this.curPacketsReply.push(resolve)
      } else {
        // resolve on direct respone with same command byte
        this.curPackets[cmd] = resolve
      }
    })
  }

  getMachineInfo() {
    return this.sendData(CMD.MACHINE_ID).then(Protocol.parseMachineInfo)
  }

  updateStatus() {
    return this.sendData(CMD.TAKE_DATA)
    .then(Protocol.parseTakeData)
    .then( (res) => {
      switch(res.workState) {
        case STATE.RUNNING:
          if(this.status.workState != STATE.RUNNING) {
            this.emit('started')
          }
          break;

        case STATE.IDLE:
          if(this.status.workState == STATE.RUNNING) {
            this.emit('stopped')
          }
          break;

        case STATE.FINISH:
          if(this.status.workState == STATE.RUNNING) {
            this.emit('stopped')
            this.emit('finish')
          }
          break;

        case STATE.ERROR:
          const errorMessage = ErrorCodes[res.errorCode]
          if(this.status.workState == STATE.RUNNING) {
            this.emit('stopped')
          }
          if(this.status.workState != STATE.ERROR) {
            this.emit('error', errorMessage)
          }
          break;

        default:
          throw new Error('unknown state '+res.workState)
      }
      this.status = res
      this.emit('status', res)
    })
  }
  charge(cdata) {
    if(!(cdata instanceof ChargeData)) {

      // converting strings to integers and checks
      if(typeof cdata.BattType == 'string') {
        cdata.BattType = BattTypes[cdata.BattType]
      }
      if(!cdata.BattType) {
        throw new Error('BattType is required')
      }
      if(typeof cdata.PwmMode == 'string') {
        cdata.PwmMode = cdata.BattType.modes.indexOf(cdata.PwmMode)
      }
      if(typeof cdata.PwmMode != 'number' || cdata.PwmMode < 0) {
        throw new Error('invalid PwmMode')
      }

      // copy all options to ChargeData object
      let obj = new ChargeData;
      obj.setTypeDefaults(cdata.BattType)

      for(let key in cdata) {
        if(key != 'BattType') obj[key] = cdata[key]
      }
      cdata = obj
    }


    return this.sendData(CMD.START_CHARGER, cdata)
  }

  stop() {
    return this.sendData(CMD.STOP_CHARGER).then( () => {
      this.emit('stopped')
    })
  }
  getStatus() {
    return this.status
  }
  getStateTitle() {
    // TODO: does not retrieve name by value
    return Object.keys(STATE)[this.status.workState-1]
  }

}
