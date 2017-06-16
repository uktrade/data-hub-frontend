const textFormatting = require('~/src/lib/text-formatting')

describe('Text formatting', function () {
  describe('title case', function () {
    it('should handle a regular sentence', function () {
      expect(textFormatting.titleCase('this is a test')).to.equal('This Is A Test')
    })
    it('should handle a null', function () {
      expect(textFormatting.titleCase()).to.be.null
    })
    it('should handle an empty string', function () {
      expect(textFormatting.titleCase('')).to.be.null
    })
    it('should ignore none strings', function () {
      expect(textFormatting.titleCase({ test: 'thing' })).to.be.null
    })
  })
  describe('new line to br', function () {
    it('should handle text with new lines', function () {
      expect(textFormatting.newlineToBr('one\ntwo\nthree')).to.equal('one<br/>two<br/>three')
    })
    it('should preserve text without newlines', function () {
      expect(textFormatting.newlineToBr('one two three')).to.equal('one two three')
    })
    it('should handle a null', function () {
      expect(textFormatting.newlineToBr()).to.be.null
    })
    it('should handle an empty string', function () {
      expect(textFormatting.newlineToBr('')).to.be.null
    })
    it('should ignore none strings', function () {
      expect(textFormatting.newlineToBr({ test: 'test' })).to.be.null
    })
  })
})
