#!/usr/bin/env node
require('babel-register')();

const ChargeMaster = require('./src/ChargeMaster').default
const cli = require('./src/cli')
const helper = require('./src/helper')
const commandLineArgs = require('command-line-args')

function exit(code=0, message) {
  if(message) console.log(message)
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
  const cm = getChargeMaster(options.device)
  console.log('stopping...');
  cm.stop()
  process.exit(0)

// charging,discharging,..
} else if(options.mode) {
  const cm = getChargeMaster(options.device)

  console.log(`${options.type}: ${options.mode}\n=============================================`.bold);

  cm.on('error', (err) => {
    exit(1, 'ERROR:', err);
  })
  cm.on('finish', () => {
    exit(0, 'done.');
  })
  cm.on('status', cli.printStatus)

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
