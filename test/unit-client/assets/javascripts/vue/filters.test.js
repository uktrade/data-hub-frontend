const { highlight } = require('../../../../../assets/javascripts/vue/filters')

describe('#Highlight', () => {
  context('when I search for a single character', () => {
    const str = 'Mike Brodin'
    it('should highlight the single character if the search was set in uppercase', () => {
      expect(highlight(str, 'M')).to.equal(
        "<span class='highlight'>M</span>ike Brodin"
      )
    })
    it('should highlight a single character if the search was set in lowercase', () => {
      expect(highlight(str, 'm')).to.equal(
        "<span class='highlight'>M</span>ike Brodin"
      )
    })
  })
  context('when I search for a two characters', () => {
    const str = 'Mike Brodin'
    it('should highlight two characters if the search was set in uppercase', () => {
      expect(highlight(str, 'MI')).to.equal(
        "<span class='highlight'>Mi</span>ke Brodin"
      )
    })
    it('should highlight two characters if the search was set in lowercase', () => {
      expect(highlight(str, 'mi')).to.equal(
        "<span class='highlight'>Mi</span>ke Brodin"
      )
    })
  })
  context('when I search for a character from the last name', () => {
    const str = 'Mike Brodin'
    it('should highlight the character in the last name', () => {
      expect(highlight(str, 'B')).to.equal(
        "Mike <span class='highlight'>B</span>rodin"
      )
    })
  })
  context('when I search for a character or word that has no result', () => {
    const str = 'Mike Brodin'
    it('should return the str with no highlighting', () => {
      expect(highlight(str, 'Z')).to.equal('Mike Brodin')
      expect(highlight(str, 'Foo')).to.equal('Mike Brodin')
    })
  })
})
