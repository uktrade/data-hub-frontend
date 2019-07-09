const {
  getReturnLink,
  isInteractionServiceForm,
} = require('~/src/apps/interactions/helpers')
const {
  INTERACTION_CONTEXTS,
} = require('../../../../src/apps/interactions/constants')

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

  describe('#isInteractionServiceForm', () => {
    context('interaction form values', () => {
      it('should return true', () => {
        expect(
          isInteractionServiceForm('service', INTERACTION_CONTEXTS[0])
        ).to.equal(true)
        expect(
          isInteractionServiceForm('service', INTERACTION_CONTEXTS[1])
        ).to.equal(true)
        expect(
          isInteractionServiceForm('service', INTERACTION_CONTEXTS[2])
        ).to.equal(true)
        expect(
          isInteractionServiceForm('service', INTERACTION_CONTEXTS[3])
        ).to.equal(true)
        expect(
          isInteractionServiceForm('service', INTERACTION_CONTEXTS[0])
        ).to.equal(true)
      })
    })

    context('non interaction form values', () => {
      it('should return false', () => {
        expect(
          isInteractionServiceForm('blah', INTERACTION_CONTEXTS[0])
        ).to.equal(false)
        expect(isInteractionServiceForm('service', 'some_context')).to.equal(
          false
        )
        expect(isInteractionServiceForm('', '')).to.equal(false)
        expect(isInteractionServiceForm('service', '')).to.equal(false)
        expect(
          isInteractionServiceForm('', INTERACTION_CONTEXTS[0])
        ).to.equal(false)
      })
    })
  })
})
