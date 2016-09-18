const getUsage = require('command-line-usage')
const commandLineArgs = require('command-line-args')

import {BattTypes} from './constants'
import ChargeData from './ChargeData'


const optionDefinitions = [
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
    name: 'ccurrent',
    description: `Current for charging`,
    type: String,
    typeLabel: '0.1'
  },
  {
    name: 'dcurrent',
    description: `Current for discharging`,
    type: String,
    typeLabel: '0.1'
  },
  {
    name: 'endvoltage',
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



export function parseArguments() {
  const options = commandLineArgs(optionDefinitions)
  // show help?
  if(options.help || process.argv.length < 3) {
    return {
      do: 'help'
    }
  }
  if(options.stop) {
    return {
      do: 'stop'
    }
  }
  // device
  if(options.device) {
    res.device = options.device.split(':').map( (a) => parseInt(a, 16))
    if(res.device.length != 2) {
      throw new Error('invalid device string')
    }
  }

  let res = {
    do: 'charge',
    cdata: new ChargeData()
  };

  if(options.stop) {
    return {
      do: 'stop',
      device: res.device
    }
  }
  // type
  if(!options.type) {
    throw new Error('no battery type given')
  }
  const BattType = BattTypes[options.type]
  if(!BattType) {
    throw new Error('invalid battery type')
  }
  res.cdata.setTypeDefaults(BattType)

  // mode
  res.cdata.PwmMode = BattType.modes.indexOf(options.mode)
  if(res.cdata.PwmMode == -1) {
    throw new Error('invalid mode')
  }

  // cells
  if(options.cells) {
    res.cdata.Cell = parseInt(options.cells)
  }

  // ccurrent
  if(options.ccurrent) {
    res.cdata.CCurrent = parseFloat(options.ccurrent)*1000
  }

  // dcurrent
  if(options.dcurrent) {
    res.cdata.DCurrent = parseFloat(options.dcurrent)*1000
  }

  // endvoltage
  if(options.endvoltage) {
    res.cdata.EndVoltage = parseFloat(options.endvoltage)*1000
  }
  return res;
}
