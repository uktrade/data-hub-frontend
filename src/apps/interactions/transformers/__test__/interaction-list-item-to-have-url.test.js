const transformInteractionListItemToHaveUrlPrefix = require('../interaction-list-item-to-have-url')
const mockInteraction = require('../../../../../test/unit/data/interactions/search-interaction.json')

describe('#transformInteractionListItemToHaveUrlPrefix', () => {
  context('when there is a leading forward slash', () => {
    it('should set the URL prefix without a leading forward slash', () => {
      const actualInteraction =
        transformInteractionListItemToHaveUrlPrefix('/url')(mockInteraction)
      const expectedInteraction = { ...mockInteraction, urlPrefix: 'url/' }

      expect(actualInteraction).to.deep.equal(expectedInteraction)
    })
  })

  context('when there is not a leading forward slash', () => {
    it('should set the complete URL prefix', () => {
      const actualInteraction =
        transformInteractionListItemToHaveUrlPrefix('url')(mockInteraction)
      const expectedInteraction = { ...mockInteraction, urlPrefix: 'url/' }

      expect(actualInteraction).to.deep.equal(expectedInteraction)
    })
  })

  context('when there is not a return link', () => {
    it('should not set the complete URL prefix', () => {
      const actualInteraction =
        transformInteractionListItemToHaveUrlPrefix(undefined)(mockInteraction)
      expect(actualInteraction).to.deep.equal(mockInteraction)
    })
  })
})
