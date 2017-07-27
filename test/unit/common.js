const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const reqres = require('reqres')

chai.use(require('sinon-chai'))
chai.use(require('chai-as-promised'))

// mocha globals
global.expect = chai.expect
global.sinon = sinon
global.proxyquire = proxyquire
global.rootPath = `${process.cwd()}`
global.rootPath = `${process.cwd()}`
global.globalReq = reqres.req()
global.globalRes = reqres.res()

chai.config.truncateThreshold = 0

process.setMaxListeners(0)
process.stdout.setMaxListeners(0)
