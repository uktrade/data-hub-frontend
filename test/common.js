const chai = require('chai')
const sinonChai = require('sinon-chai')

global.expect = chai.expect
global.sinon = require('sinon')
chai.use(sinonChai)
chai.config.truncateThreshold = 0

global.appFolder = process.cwd() + '/src'

process.setMaxListeners(0)
process.stdout.setMaxListeners(0)
