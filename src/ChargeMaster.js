import HID from 'node-hid'
import EventEmitter from 'events'

import Protocol from './Protocol'
import ChargeData from './ChargeData'
import {bufferToArray} from './helper'
import {CMD,STATE,BattTypes,ErrorCodes} from './constants'

const UPDATE_INTERVAL = 1000


export default class ChargeMaster extends EventEmitter {
  constructor(vendorId, productId) {
    super()
    if(typeof vendorId == 'object' && !productId) {
      productId = vendorId[1]
      vendorId = vendorId[0]
    }

    this.BattType = null

    this.curPackets = {}
    this.curPacketsReply = []
    this.status = {
      workState: 2
    }

    this.device = new HID.HID(vendorId, productId)
    this.emit('connected')

    this.device.on('data', this.handleData.bind(this))
    this.device.on('error', this.handleHIDError.bind(this))

    setInterval(this.updateStatus.bind(this), UPDATE_INTERVAL)
  }

  /**
    handle binary data sent from device
  */
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

  /**
    handles error, which are sent from node-hid
  */
  handleHIDError(err) {
    this.emit('error', err)
  }

  /**
    sends command to device
  */
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


  /**
    get machine infomations
  */
  getMachineInfo() {
    return this.sendData(CMD.MACHINE_ID).then(Protocol.parseMachineInfo)
  }

  /**
    pulls current status from device, emit events on changes and
    saves status object to this.status
  */
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

  /**
    return current status object
  */
  getStatus() {
    return this.status
  }

  /**
    set battery type
  */
  setBattType(type) {
    this.BattType = BattTypes[type]
    if(!this.BattType) {
      throw new Error('invalid BattType')
    }
  }

  /**
    starts charging
  */
  charge(options={}) {
    if(!this.BattType) {
      throw new Error('you have to specify an BattType as first. check README for cm.setBattType()')
    }

    let cdata = new ChargeData;

    // set options
    cdata.setTypeDefaults(this.BattType)

    cdata.PwmMode = cdata.BattType.modes.indexOf('charge')
    if(cdata.PwmMode == -1) {
      throw new Error('charging is not possible for this BattType')
    }

    if(options.cells) cdata.setCells(options.cells)
    if(options.current) cdata.setCCurrent(options.current)
    if(options.cellVoltage) cdata.setCellVoltage(options.cellVoltage)
    if(options.endVoltage) cdata.setEndVoltage(options.endVoltage)


    // run
    return this.sendData(CMD.START_CHARGER, cdata)

  }


  /**
    starts discharging
  */
  discharge(options={}) {
    if(!this.BattType) {
      throw new Error('you have to specify an BattType as first. check README for cm.setBattType()')
    }

    let cdata = new ChargeData;

    // set options
    cdata.setTypeDefaults(this.BattType)

    cdata.PwmMode = cdata.BattType.modes.indexOf('discharge')
    if(cdata.PwmMode == -1) {
      throw new Error('charging is not possible for this BattType')
    }


    if(options.cells) cdata.setCells(options.cells)
    if(options.current) cdata.setDCurrent(options.current)
    if(options.cellVoltage) cdata.setCellVoltage(options.cellVoltage)

    // run
    return this.sendData(CMD.START_CHARGER, cdata)

  }


  /**
    stops charging/discharging
  */
  stop() {
    return this.sendData(CMD.STOP_CHARGER).then( () => {
      this.emit('stopped')
    })
  }

  /**
    get name of the current state
  */
  getStateTitle() {
    // TODO: does not retrieve name by value
    return Object.keys(STATE)[this.status.workState-1]
  }
}
