require('babel-register')();

const Jasmine = require('jasmine')

const jasmine = new Jasmine()
jasmine.loadConfigFile('spec/jasmine.json')
jasmine.execute()
