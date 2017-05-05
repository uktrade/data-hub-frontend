/* globals expect: true, describe: true, it: true */
/* eslint no-unused-expressions: 0 */
const { isBlank, transformV2Errors } = require('../../src/lib/controllerutils')

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

describe('transformV2Errors: Formatting V2 service delivery endpoint errors', function () {
  it('Should warn if the Service Delivery triple does not exist', function () {
    const source = [
      {
        'detail': 'This combination of service and service provider does not exist.',
        'source': {
          'pointer': '/data/relationships/service'
        }
      }
    ]
    const actual = transformV2Errors(source)
    expect(actual.Alert).to.exist
    expect(actual.Alert).to.equal('This combination of service and service provider does not exist.')
  })
})
