import HID from 'node-hid'


const knownChargers = [
  /**
    - Voltcraft Ultimate 1000W
    - SkyRC iMax B6
  */
  [0x0000, 0x0001]


];

export function bufferToArray(buf) {
  let arr = []
  for(let i=0;i<buf.length;i++) {
    arr.push(buf[i])
  }
  return arr
}

export function findCharger() {
  const devices = HID.devices()
  for(let device of devices) {
    for(let charger of knownChargers) {
      if(device.vendorId == charger[0] && device.productId == charger[1]) {
        return charger
      }
    }
  }
  return false
}
