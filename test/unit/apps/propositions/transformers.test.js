const { assign } = require('lodash')
const mockProposition = require('~/test/unit/data/propositions/proposition.json')

const {
  transformPropositionResponseToForm,
  transformPropositionToListItem,
  transformPropositionResponseToViewRecord,
  transformPropositionListItemToHaveUrlPrefix,
} = require('~/src/apps/propositions/transformers')

describe('Proposition transformers', () => {
  describe('#transformPropositionResponseToForm', () => {
    context('when the source is a proposition', () => {
      beforeEach(() => {
        this.transformed = transformPropositionResponseToForm(mockProposition)
      })

      it('should transform data from proposition response to form', () => {
        expect(this.transformed).to.deep.equal({
          id: '7d68565a-fc0e-422c-8ce3-df92cd40a64a',
          name: 'Game-changing Proposition',
          scope: 'scope 0',
          adviser: '14d9f881-4df4-421b-8181-874f9dc83b76',
          deadline: { day: '20', month: '05', year: '2018' },
          investment_project: '65e77d82-8ebb-4ee7-b6ac-8c5945c512db',
        })
      })
    })
  })

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
          meta:
            [ { label: 'Type', type: 'badge', value: 'Ongoing' },
              { label: 'Deadline', value: '2018-05-20', type: 'date' },
              { label: 'Created On', value: '2018-05-09', type: 'date' },
              { label: 'Adviser',
                value: {
                  first_name: 'Joseph',
                  id: '14d9f881-4df4-421b-8181-874f9dc83b76',
                  last_name: 'Wright of Derby ',
                  name: 'Joseph Wright of Derby',
                },
              },
            ],
        },
        )
      })
    })
  })

  describe('#transformPropositionResponsetoViewRecord', () => {
    context('when provided a fully populated proposition', () => {
      beforeEach(() => {
        this.transformed = transformPropositionResponseToViewRecord(mockProposition)
      })

      it('should transform to display format', () => {
        expect(this.transformed).to.deep.equal({
          Scope: 'Scope 0',
          Status: 'Ongoing',
          'Date created': { type: 'date', name: '2018-05-09' },
          'Modified on': { type: 'date', name: '2018-05-03T09:49:03.038168Z' },
          Deadline: { type: 'date', name: '2018-05-20' },
          'Assigned to':
            { first_name: 'Joseph',
              last_name: 'Wright of Derby ',
              name: 'Joseph Wright of Derby',
              id: '14d9f881-4df4-421b-8181-874f9dc83b76' },
          Details: {
            url: undefined,
            name: undefined,
          },
        })
      })
    })
  })

  describe('#transformPropositionListItemToHaveUrlPrefix', () => {
    context('when there is a leading forward slash', () => {
      it('should set the URL prefix without a leading forward slash', () => {
        const actualProposition = transformPropositionListItemToHaveUrlPrefix('/url')(mockProposition)
        const expectedProposition = assign({}, mockProposition, { urlPrefix: 'url' })

        expect(actualProposition).to.deep.equal(expectedProposition)
      })
    })

    context('when there is not a leading forward slash', () => {
      it('should set the complete URL prefix', () => {
        const actualProposition = transformPropositionListItemToHaveUrlPrefix('url')(mockProposition)
        const expectedProposition = assign({}, mockProposition, { urlPrefix: 'url' })

        expect(actualProposition).to.deep.equal(expectedProposition)
      })
    })

    context('when there is not a return link', () => {
      it('should not set the complete URL prefix', () => {
        const actualProposition = transformPropositionListItemToHaveUrlPrefix(undefined)(mockProposition)
        const expectedProposition = assign({}, mockProposition)

        expect(actualProposition).to.deep.equal(expectedProposition)
      })
    })
  })
})
