const { getReturnLink } = require('~/src/apps/interactions/helpers')

describe('Interaction helpers', () => {
  describe('#getReturnLink', () => {
    context('when the return link exists', () => {
      beforeEach(() => {
        this.actual = getReturnLink({ returnLink: '/return' })
      })

      it('should return the link', () => {
        expect(this.actual).to.equal('/return')
      })
    })

    context('when the return link does not exist', () => {
      beforeEach(() => {
        this.actual = getReturnLink(null)
      })

      it('should return the link', () => {
        expect(this.actual).to.equal('/interactions')
      })
    })
  })
})
