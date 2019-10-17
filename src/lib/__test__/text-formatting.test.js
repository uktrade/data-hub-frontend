const textFormatting = require('~/src/lib/text-formatting')

describe('Text formatting', () => {
  describe('new line to br', () => {
    it('should handle text with new lines', () => {
      expect(textFormatting.newlineToBr('one\ntwo\nthree')).to.equal('one<br/>two<br/>three')
    })
    it('should preserve text without newlines', () => {
      expect(textFormatting.newlineToBr('one two three')).to.equal('one two three')
    })
    it('should handle a null', () => {
      expect(textFormatting.newlineToBr()).to.be.null
    })
    it('should handle an empty string', () => {
      expect(textFormatting.newlineToBr('')).to.be.null
    })
    it('should ignore none strings', () => {
      expect(textFormatting.newlineToBr({ test: 'test' })).to.be.null
    })
  })
})
