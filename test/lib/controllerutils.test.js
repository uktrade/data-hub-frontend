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
  it('Should return multiple errors when presented with an array of errors', function () {
    const source = [
      {
        'detail': 'Required',
        'source': {
          'pointer': '/data/attributes/subject'
        }
      },
      {
        'detail': 'Required',
        'source': {
          'pointer': '/data/attributes/notes'
        }
      },
      {
        'detail': "{'data': {'type': 'ServiceDeliveryStatus'}} has no key id",
        'source': {
          'pointer': '/data/relationships/status'
        }
      },
      {
        'detail': "{'data': {'type': 'Contact'}} has no key id",
        'source': {
          'pointer': '/data/relationships/contact'
        }
      },
      {
        'detail': "{'data': {'type': 'Service'}} has no key id",
        'source': {
          'pointer': '/data/relationships/service'
        }
      },
      {
        'detail': "{'data': {'type': 'Team'}} has no key id",
        'source': {
          'pointer': '/data/relationships/dit_team'
        }
      },
      {
        'detail': "{'data': {'type': 'Sector'}} has no key id",
        'source': {
          'pointer': '/data/relationships/sector'
        }
      },
      {
        'detail': "{'data': {'type': 'UKRegion'}} has no key id",
        'source': {
          'pointer': '/data/relationships/uk_region'
        }
      },
      {
        'detail': "{'data': {'type': 'Country'}} has no key id",
        'source': {
          'pointer': '/data/relationships/country_of_interest'
        }
      }
    ]
    const actual = transformV2Errors(source)
    expect((Object.keys(actual)).length).to.equal(9)
    expect(actual.subject).to.be.defined
    expect(actual.notes).to.be.defined
    expect(actual.status).to.be.defined
    expect(actual.contact).to.be.defined
    expect(actual.service).to.be.defined
    expect(actual.dit_team).to.be.defined
    expect(actual.sector).to.be.defined
    expect(actual.uk_region).to.be.defined
    expect(actual.country_of_interest).to.be.defined
  })
  it('Should match keys not specially defined', function () {
    const source = [
      {
        'detail': "{'data': {'type': 'Foo'}} has no key id",
        'source': {
          'pointer': '/data/relationships/foo'
        }
      }
    ]
    const actual = transformV2Errors(source)
    expect(actual.foo).to.be.defined
  })
})
