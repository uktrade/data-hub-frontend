global.chai = require('chai').use(require('sinon-chai'))
global.expect = global.chai.expect
global.sinon = require('sinon')
global.appFolder = process.cwd() + '/src'

process.setMaxListeners(0)
process.stdout.setMaxListeners(0)
