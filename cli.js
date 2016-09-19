#!/usr/bin/env node
require('babel-register')();

const ChargeMaster = require('./src/ChargeMaster').default
const cli = require('./src/cli')
const helper = require('./src/helper')
const commandLineArgs = require('command-line-args')


function exit(code=0) {
  process.exitCode = code
  process.kill(process.pid, 'SIGKILL')
}

function getChargeMaster(device) {
  if(device) {
    const parsed = options.device.split(':').map( (a) => parseInt(a, 16))
    if(parsed) {
      throw new Error('invalid device string')
    }
    return new ChargeMaster(parsed)
  } else {
    return new ChargeMaster(helper.findCharger())
  }
}


const options = commandLineArgs(cli.optionDefinitions)

// help
if(options.help || process.argv.length < 3) {
  cli.showUsage()

// stop
} else if(options.stop) {
  console.log('connecting...');
  const cm = getChargeMaster(options.device)
  console.log('stopping...');
  cm.stop()
  process.exit(0)

// charging,discharging,..
} else if(options.mode) {
  console.log('connecting...');
  const cm = getChargeMaster(options.device)


  cm.on('error', (err) => {
    console.log('\nERROR:', err);
    exit(1)
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
  console.log(`run mode '${options.mode}'`);

  cm.setBattType(options.type)
  switch(options.mode) {
    case 'charge':
      cm.charge(options)
      break
    case 'discharge':
      cm.discharge(options)
      break
    default:
      throw new Error(`mode '${options.mode}' does not exist or is not fully implemented`)
  }

}
