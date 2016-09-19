const getUsage = require('command-line-usage')

import {BattTypes} from './constants'
import ChargeData from './ChargeData'


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
