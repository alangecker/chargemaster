#!/usr/bin/env node
require('babel-register')();

const ChargeMaster = require('./src/ChargeMaster').default
const cli = require('./src/cli')
const helper = require('./src/helper')
const commandLineArgs = require('command-line-args')
const readline = require('readline')
require('colors')

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
  console.log('connecting to device...');
  const cm = getChargeMaster(options.device)


  cm.on('error', (err) => {
    console.log('\nERROR:', err);
    exit(1)
  })
  cm.on('finish', () => {
    console.log('\ndone.');
    exit()
  })
  let firstStatus = true
  cm.on('status', (info) => {
    const voltage = (info.OutVoltage/1000)
    const current = (info.Current/1000)
    const minutes = Math.floor(info.ChargeTimer/60)
    const seconds = info.ChargeTimer%60
    readline.clearLine(process.stdout)
    if(!firstStatus) {
      process.stdout.cursorTo(0)
      process.stdout.moveCursor(0,-5)
    } else {
      firstStatus = false
    }
    process.stdout.clearLine()
    process.stdout.write("Status:\t"+cm.getStateTitle().bold+'\n');

    process.stdout.clearLine()
    process.stdout.write("Time:\t"+(minutes+'m'+seconds+'s').bold+'\n');

    process.stdout.clearLine()
    process.stdout.write((voltage.toFixed(2)+' V').blue.bold+'\t')
    process.stdout.write((current.toFixed(2)+' A').cyan.bold+'\t')
    process.stdout.write(((voltage*current).toFixed(2)+' W').green.bold+'\t')
    process.stdout.write((info.ChargeMah+' mAh').magenta.bold+'\n')

    process.stdout.clearLine()
    process.stdout.write('Cells:\t')
    for(let i=1;i<=8;i++) {
      let cellVoltage = (info['CELL'+i]-2)/1000
      if(i == 5) process.stdout.write('\n\t')
      process.stdout.write((i+': ').grey+cellVoltage.toFixed(2)+'V ')
    }
    process.stdout.write('\n')


    // process.stdout.write(`${cm.getStateTitle()}\tTime: ${minutes}m${seconds}s\t${voltage.toFixed(2)} V\t${current.toFixed(2)} A\t${info.ChargeMah} mAh`);
  })
  console.log(`run mode '${options.mode}' for battery type '${options.type}'`);

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
