const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const reqres = require('reqres')
const nock = require('nock')

chai.use(require('sinon-chai'))
chai.use(require('chai-as-promised'))
chai.use(require('chai-subset'))

// mocha globals
global.expect = chai.expect
global.sinon = sinon
global.proxyquire = proxyquire
global.nock = nock
global.rootPath = `${process.cwd()}`
global.rootPath = `${process.cwd()}`
global.globalReq = reqres.req()
global.globalRes = reqres.res()
global.sandbox = sinon.sandbox.create()

chai.config.truncateThreshold = 0

process.setMaxListeners(0)
process.stdout.setMaxListeners(0)
