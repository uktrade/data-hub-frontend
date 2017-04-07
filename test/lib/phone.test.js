/* globals expect: true, describe: true, it: true, beforeEach: true */
const phone = require('../../src/lib/phone')

describe('Phone utility', function () {
  it('should format a correctly entered interational number', function () {
    const number = phone.formatPhone('+44', '07813 333222')
    expect(number).to.equal('+44 7813 333222')
  })
  it('should format a number with blank international code', function () {
    const number = phone.formatPhone('', '07813 333222')
    expect(number).to.equal('07813 333222')
  })
  it('should format a number with null international code', function () {
    const number = phone.formatPhone(null, '07813 333222')
    expect(number).to.equal('07813 333222')
  })
  it('should format a number with no 0 at the start, but has a country code', function () {
    const number = phone.formatPhone('+44', '7813 333222')
    expect(number).to.equal('+44 7813 333222')
  })
})
