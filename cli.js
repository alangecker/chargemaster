#!/usr/bin/env node
require('babel-register')();

const ChargeMaster = require('./src/ChargeMaster').default
const cli = require('./src/cli')
const helper = require('./src/helper')


const options = cli.parseArguments()

function exit() {
    process.kill(process.pid, 'SIGKILL')
}

switch(options.do) {
  case 'help':
    cli.showUsage()
    break
  case 'charge':
    console.log('connecting...');
    const cm = new ChargeMaster(options.device ? options.device : helper.findCharger())


    cm.on('error', (err) => {
      console.log('\nERROR:', err);
      exit()
    })
    cm.on('finish', () => {
      console.log('\ndone.');
      exit()
    })

    cm.on('status', (info) => {
      const voltage = (info.OutVoltage/1000)
      const current = (info.Current/1000)
      process.stdout.write(`${cm.getStateTitle()}\tTime: ${info.ChargeTimer}s\t${voltage.toFixed(2)} V\t${current.toFixed(2)} A\t${info.ChargeMah} mAh\r`);
    })
    console.log(`run in mode '${options.cdata.getModeName()}'`);
    cm.charge(options.cdata)

    if(options.nowatch) {
      process.nextTick(exit)
    }


    break;
  case 'stop':
    console.log('connecting...');
    const cm2 = new ChargeMaster(options.device ? options.device : helper.findCharger())
    console.log('stopping...');
    cm2.stop()
    process.exit()
}
