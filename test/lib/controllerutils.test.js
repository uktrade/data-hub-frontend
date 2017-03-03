/* globals expect: true, describe: true, it: true */
const { isBlank } = require('../../src/lib/controllerutils')

describe('isBlank', function () {
  it('should detects undefined variables', function () {
    let e
    expect(isBlank(e)).to.be.true
  })
  it('should detect passing an unknown key', function () {
    let e = {}
    expect(isBlank(e.x)).to.be.true
  })
  it('should detect an empty string', function () {
    expect(isBlank('')).to.be.true
  })
  it('should detect undefined', function () {
    expect(isBlank(undefined)).to.be.true
  })
  it('should know when it is sent a valid string', function () {
    expect(isBlank('test')).to.be.false
  })
  it('should know when it is sent a valid object', function () {
    expect(isBlank({x: 1})).to.be.false
  })
})
