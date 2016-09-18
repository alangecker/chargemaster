# chargemaster #
Control various SkyRC, Voltcraft,.. battery charger with javascript/nodejs


#### What works
  - charging
  - discharging
  - status info
  - read device info

#### What does not work
  - change programs
  - change system options
  - update firmeware

#### Tested devices
  - Voltcraft Ultimate 1000W


## Warning!
very early version! Bugs can inflame your batteries! Use at your own risk! Neither me or other contributors will take responsibility for damages.


## Usage as CLI Tool
```bash
$ git clone https://github.com/alangecker/chargemaster.git
$ cd chargemaster
$ npm install

# help
$ ./cli.js --help

# example
$ sudo ./cli.js --type LiIon --mode charge --cells 7 --ccurrent 0.5


```
## Usage as npm module
```
$ npm install chargemaster
```
```js
var ChargeMaster = require('chargemaster');
```
## API



#### new ChargeMaster(vendorId, deviceId)
  connects to Charger over USB. You can get the vendorId and deviceId with ```$ lsusb```
  ```js
  var cm = new ChargeMaster(0x0000, 0x0001);
  ```

#### cm.getStatus()
gets current status as ChargeInfo instance

##### Example Response
  ```js
    ChargeInfo {
      workState: 1,
      errorCode: 0,
      OutVoltage: 4008, // mV
      Current: 0, // mA
      ChargeTimer: 4, // s
      ChargeMah: 0, // mAh
      ExtTemp: 0,
      IntTemp: 22,
      Intimpedance: 0,
      CELL1: 6,
      CELL2: 5,
      CELL3: 5,
      CELL4: 6,
      CELL5: 5,
      CELL6: 5,
      CELL7: 5,
      CELL8: 5
}
  ```
#### cm.charge(Object|ChargeData cdata) ```Promise```
starts charging. Pass options as an Object
##### Example Options
```js
{
    BattType: 'LiIon', // LiPo, LiIon, LiFe, LiHv, NiMH, NiCd, Pb
    Cells: 1,
    PwmMode: 'charge',
    CCurrent: 100, // mA
    DCurrent: 100, // mA
    CellVoltage: 0, // mV
    EndVoltage: 0, // mV
    R_PeakCount: 1,
    CycleType: 1,
    Cyc_count: 1,
    Trickle: 0
}
```

####  cm.getMachineInfo() ```Promise```
  gets details about the charger
##### Example Response
```js
{
    machineId: '100069',
    coreType: '',
    upgradeType: 1,
    isEncrypted: false,
    customerId: 4,
    languageId: 0,
    softwareVersion: 1.06,
    hardwareVersion: 1,
    reserved: 0,
    mctype: 0,
    checksum: 195
}
```

#### Event: "connected"
#### Event: "status"
- ```info``` object with a lot of status informations

#### Event: "started"
#### Event: "stopped"
#### Event: "finish"
#### Event: "error"
- ```error``` the error object


## Example
```js
const ChargeMaster = require('chargemaster');

const cm = new ChargeMaster(0x0000, 0x0001);

cm.on('error', (err) => {
  console.log('Error:', err);
});

cm.getMachineInfo().then( (info) => {
  console.log(`MachineId: ${info.machineId}\nFirmware: ${info.softwareVersion}`);
});

cm.charge({
  BattType: 'LiIon',
  PwmMode: 'charge',
  CCurrent: 1000 // mA
});
```

## License
####The MIT License (MIT)
Copyright (c) 2016 Andreas Langecker

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
