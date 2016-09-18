import {CMD, BattTypes} from '../src/constants'
import Protocol from '../src/Protocol'
import ChargeData from '../src/ChargeData'


function hexToBuffer(str, length=65) {
  let buf = Buffer.alloc(length);
  (new Buffer(str, 'hex')).copy(buf)
  return buf
}



it("should generate valid Requests", (done) => {

  // TODO: add tests for:
  //   SYSTEM_SET_SAVE: 17,
  //   TAKE_DATA: 85,
  //   STATUS_FEED: 95,
  //   EN_BUZZ: 128,
  //   USB_UPDATE: 136

  expect(Protocol.generateRequest(CMD.MACHINE_ID))
  .toEqual(hexToBuffer('000f03570057ffff'))

  expect(Protocol.generateRequest(CMD.SYSTEM_FEED))
  .toEqual(hexToBuffer('000f035a005affff'))

  expect(Protocol.generateRequest(CMD.STOP_CHARGER))
  .toEqual(hexToBuffer('000f03fe00feffff'))


  let cdata = new ChargeData()
  cdata.CCurrent = 1500
  cdata.setTypeDefaults(BattTypes.LiIon)
  expect(Protocol.generateRequest(CMD.START_CHARGER, cdata))
  .toEqual(hexToBuffer('000f16050001010005dc00640c1c1004000000000000000088ffff'))


  done()
})



it("should slice responses correctly", (done) => {

  // MACHINE_ID
  const machineIdRes = hexToBuffer('000f14570000313030303639010000040001060100c357ffff000500050005000500050005010001ffffffff')
  const sliced = Protocol.sliceResponse(machineIdRes);
  expect(sliced).toEqual(new Buffer('00313030303639010000040001060100c3', 'hex'))


  done()
})


it("should parse correctly", (done) => {

  // MACHINE_ID
  const machineInfo = new Buffer('00313030303639010000040001060100c3', 'hex')
  expect(Protocol.parseMachineInfo(machineInfo)).toEqual({
    machineId: '100069',
    coreType: '', // TODO: coreType parsing
    upgradeType: 1,
    isEncrypted: false,
    customerId: 4,
    languageId: 0,
    softwareVersion: 1.06,
    hardwareVersion: 1,
    reserved: 0,
    mctype: 0,
    checksum: 195
  })



  done()

})
