import {BattTypes} from '../src/constants'
import ChargeData from '../src/ChargeData'


it("should set EndVoltage to 4,1V", (done) => {
  const cdata = new ChargeData()
  cdata.setTypeDefaults(BattTypes.LiIon)
  expect(cdata.EndVoltage).toEqual(4100)
  done()
})
