const { getReturnLink } = require('../helpers')

describe('Interaction helpers', () => {
  describe('#getReturnLink', () => {
    context('when the return link exists', () => {
      it('should return the link', () => {
        const actual = getReturnLink({ returnLink: '/return' })
        expect(actual).to.equal('/return')
      })
    })

    context('when the return link does not exist', () => {
      it('should return the link', () => {
        const actual = getReturnLink(null)
        expect(actual).to.equal('/interactions')
      })
    })
  })
})
