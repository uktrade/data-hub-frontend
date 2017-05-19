const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

chai.use(require('sinon-chai'))
chai.use(require('chai-as-promised'))

// mocha globals
global.expect = chai.expect
global.sinon = sinon
global.proxyquire = proxyquire
global.root = `${process.cwd()}`

chai.config.truncateThreshold = 0

process.setMaxListeners(0)
process.stdout.setMaxListeners(0)
