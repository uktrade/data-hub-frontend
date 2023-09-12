const { isValidGuid } = require('../controller-utils')

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
