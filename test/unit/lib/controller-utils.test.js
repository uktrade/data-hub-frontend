const {
  isBlank,
  isValidGuid,
  getDataLabels,
} = require('~/src/lib/controller-utils')

describe('isBlank', () => {
  it('should detects undefined variables', () => {
    let e
    expect(isBlank(e)).to.be.true
  })
  it('should detect passing an unknown key', () => {
    let e = {}
    expect(isBlank(e.x)).to.be.true
  })
  it('should detect an empty string', () => {
    expect(isBlank('')).to.be.true
  })
  it('should detect undefined', () => {
    expect(isBlank(undefined)).to.be.true
  })
  it('should know when it is sent a valid string', () => {
    expect(isBlank('test')).to.be.false
  })
  it('should know when it is sent a valid object', () => {
    expect(isBlank({ x: 1 })).to.be.false
  })
})

describe('isValidGuid: Check that a string is in a format of a valid GUID', () => {
  it('should return false when something other than string is provided', () => {
    expect(isValidGuid({})).to.be.false
    expect(isValidGuid(undefined)).to.be.false
  })

  it('should return false when a string is in invalid GUID format', () => {
    expect(isValidGuid('12345')).to.be.false
    expect(isValidGuid('hjkas-1279as-dhjaskj-12jasdlk-asdasa')).to.be.false
  })

  it('should return true when a string with in a valid GUID format', () => {
    expect(isValidGuid('12345abc-1234-abcd-12ab-123456abcdef')).to.be.true
  })
})

describe('#getDataLabels', () => {
  const mockData = {
    a: 'A',
    b: 'B',
  }

  const mockLabels = {
    a: 'Label A',
    b: 'Label B',
  }

  it('should return undefined if no data if given', () => {
    expect(getDataLabels(null)).to.be.undefined
  })

  it('should return same object if labels object is not given', () => {
    expect(getDataLabels(mockData)).to.deep.equal(mockData)
  })

  it('should return same object if labels object is not given', () => {
    expect(getDataLabels(mockData, mockLabels)).to.deep.equal({
      'Label A': 'A',
      'Label B': 'B',
    })
  })
})
