const { getReturnLink, isInteractionServiceForm } = require('../helpers')
const {
  INTERACTION_CONTEXTS,
} = require('../../../../src/apps/interactions/constants')

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

  describe('#isInteractionServiceForm', () => {
    context('matching interaction form context values', () => {
      it('should return true', () => {
        expect(isInteractionServiceForm(INTERACTION_CONTEXTS[0])).to.equal(true)
        expect(isInteractionServiceForm(INTERACTION_CONTEXTS[1])).to.equal(true)
        expect(isInteractionServiceForm(INTERACTION_CONTEXTS[2])).to.equal(true)
        expect(isInteractionServiceForm(INTERACTION_CONTEXTS[3])).to.equal(true)
        expect(isInteractionServiceForm(INTERACTION_CONTEXTS[0])).to.equal(true)
      })
    })

    context('non matching interaction form values', () => {
      it('should return false', () => {
        expect(isInteractionServiceForm('some_context')).to.equal(false)
        expect(isInteractionServiceForm(undefined)).to.equal(false)
        expect(isInteractionServiceForm('')).to.equal(false)
        expect(isInteractionServiceForm(null)).to.equal(false)
      })
    })
  })
})
