const { assign } = require('lodash')
const mockProposition = require('../../../../test/unit/data/propositions/proposition.json')

const {
  transformPropositionToListItem,
  transformPropositionListItemToHaveUrlPrefix,
} = require('../transformers')

describe('Proposition transformers', () => {
  describe('#transformPropositionToListItem', () => {
    context('when the source is a proposition', () => {
      beforeEach(() => {
        mockProposition.kind = 'proposition'
        this.transformed = transformPropositionToListItem(mockProposition)
      })

      it('should transform data from proposition response to list item', () => {
        expect(this.transformed).to.deep.equal({
          id: '7d68565a-fc0e-422c-8ce3-df92cd40a64a',
          type: 'proposition',
          name: 'Game-changing Proposition',
          scope: 'scope 0',
          meta: [
            { label: 'Type', type: 'badge', value: 'Ongoing' },
            { label: 'Deadline', value: '2018-05-20', type: 'date' },
            { label: 'Created On', value: '2018-05-09', type: 'date' },
            {
              label: 'Adviser',
              value: {
                first_name: 'Joseph',
                id: '14d9f881-4df4-421b-8181-874f9dc83b76',
                last_name: 'Wright of Derby ',
                name: 'Joseph Wright of Derby',
              },
            },
          ],
        })
      })
    })
  })

  describe('#transformPropositionListItemToHaveUrlPrefix', () => {
    context('when there is a leading forward slash', () => {
      it('should set the URL prefix without a leading forward slash', () => {
        const actualProposition =
          transformPropositionListItemToHaveUrlPrefix('/url')(mockProposition)
        const expectedProposition = assign({}, mockProposition, {
          urlPrefix: 'url',
        })

        expect(actualProposition).to.deep.equal(expectedProposition)
      })
    })

    context('when there is not a leading forward slash', () => {
      it('should set the complete URL prefix', () => {
        const actualProposition =
          transformPropositionListItemToHaveUrlPrefix('url')(mockProposition)
        const expectedProposition = assign({}, mockProposition, {
          urlPrefix: 'url',
        })

        expect(actualProposition).to.deep.equal(expectedProposition)
      })
    })

    context('when there is not a return link', () => {
      it('should not set the complete URL prefix', () => {
        const actualProposition =
          transformPropositionListItemToHaveUrlPrefix(undefined)(
            mockProposition
          )
        const expectedProposition = assign({}, mockProposition)

        expect(actualProposition).to.deep.equal(expectedProposition)
      })
    })
  })
})
