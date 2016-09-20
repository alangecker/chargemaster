const getUsage = require('command-line-usage')

import {STATE,BattTypes} from './constants'
import ChargeData from './ChargeData'
const readline = require('readline')
require('colors')


export const optionDefinitions = [
  {
    name: 'device',
    description: 'the USB device',
    type: String,
    alias: 'd',
    typeLabel: 'vendorId:productId'
  },
  {
    name: 'type',
    description: 'Type of the battery',
    type: String,
    alias: 't',
    typeLabel: 'LiPo|LiIon|LiFe|LiHv|NiMH|NiCd|Pb'
  },
  {
    name: 'mode',
    description: `Charging/Discharging mode (see list below)`,
    type: String,
    defaultValue: 'charge',
    alias: 'm',
    typeLabel: 'charge|discharge|...'
  },
  {
    name: 'cells',
    description: `Number of cells in series`,
    alias: 'c',
    typeLabel: '1'
  },
  {
    name: 'current',
    description: `Current for (dis-)charging`,
    type: String,
    typeLabel: '0.1'
  },
  {
    name: 'endVoltage',
    description: 'maximum voltage',
    type: String,
    typeLabel: '4.1'
  },
  {
    name: 'stop',
    description: `stop all activity`,
    type: Boolean
  },
  {
    name: 'status',
    description: `show current status`,
    type: Boolean
  },
  {
    name: 'help',
    description: `show this help`,
    type: Boolean
  }
]



export function showUsage() {
  console.log(getUsage([
    {
      header: 'Options',
      optionList: optionDefinitions
    },
    {
      header: 'Modes',
      content: [
        {name:'charge', summary: 'Charging the battery without balancer connection'},
        {name:'discharge', summary: 'Discharging the battery'},

        {'name':'\n= LiPo/LiIon/LiFe/LiHv only'},
        {name:'storage', summary: 'Charging/Discharging the battery until a certain voltage value is reached'},
        {name:'fastchg', summary: 'Fast charging the battery'},
        {name:'balance', summary: 'Charging the battery with  balancer connection'},

        {'name':'\n= NiMH/NiCd only'},
        {name:'repeak', summary: 'Repeated recharge of a full battery'},
        {name:'cycle', summary: 'Multiple charge/discharge cycles or discharge/charge cycles'}

      ]
    },
    {
      header: 'Links',
      content: 'Project home: [underline]{https://github.com/alangecker/chargemaster}'
    }
  ]))
}

let firstStatus = true
export function printStatus(info) {
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
    process.stdout.write("Status:\t"+Object.keys(STATE)[info.workState-1].bold+'\n');

    process.stdout.clearLine()
    process.stdout.write("Time:\t"+(minutes+'m'+seconds+'s').bold+'\n');

    process.stdout.clearLine()
    process.stdout.write("Values:\t")
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
}
