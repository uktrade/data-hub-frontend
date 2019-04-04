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
            {
              first_name: 'Joseph',
              last_name: 'Wright of Derby ',
              name: 'Joseph Wright of Derby',
              id: '14d9f881-4df4-421b-8181-874f9dc83b76',
            },
          'File 1':
            ['il_fullxfull.826924229_2xdo.jpg',
              {
                name: 'Download',
                url: '/investments/projects/65e77d82-8ebb-4ee7-b6ac-8c5945c512db/propositions/7d68565a-fc0e-422c-8ce3-df92cd40a64a/download/1a85b301-56ae-4073-97db-a42604c40bea',
              },
            ],
          'File 2':
            ['totally_not_a_virus.zip',
              {
                name: 'The file didn\'t pass virus scanning, contact your administrator',
                type: 'error',
              },
            ],
          'File 3':
            ['780-rainbow-teacosy-1.jpg',
              {
                name: 'Download',
                url: '/investments/projects/65e77d82-8ebb-4ee7-b6ac-8c5945c512db/propositions/7d68565a-fc0e-422c-8ce3-df92cd40a64a/download/1eab8de6-0a9a-4152-95d0-a3eca9ef6a8f',
              }],
        })
      })
    })

    context('when provided an abandoned proposition and simple text as detail', () => {
      beforeEach(() => {
        mockProposition.status = 'Abandoned'
        mockProposition.details = 'the world is a stage'
        this.transformed = transformPropositionResponseToViewRecord(mockProposition)
      })

      it('should not transform it to a url', () => {
        expect(this.transformed.Details).to.deep.equal('the world is a stage')
        expect(this.transformed.Details).to.not.deep.equal({
          name: 'http://the-world-is-a-stage',
          url: 'http://the-world-is-a-stage',
        })
      })
    })

    context('when provided an abandoned proposition and a url with http as detail', () => {
      beforeEach(() => {
        mockProposition.status = 'Abandoned'
        mockProposition.details = 'http://the-world-is-a-stage'
        this.transformed = transformPropositionResponseToViewRecord(mockProposition)
      })

      it('should transform it to a url', () => {
        expect(this.transformed.Details).to.not.deep.equal('the world is a stage')
        expect(this.transformed.Details).to.deep.equal({
          name: 'http://the-world-is-a-stage',
          url: 'http://the-world-is-a-stage',
        })
      })
    })

    context('when provided an abandoned proposition and a url with https as detail', () => {
      beforeEach(() => {
        mockProposition.status = 'Abandoned'
        mockProposition.details = 'https://and-we-are-the-actors'
        this.transformed = transformPropositionResponseToViewRecord(mockProposition)
      })

      it('should transform it to a url', () => {
        expect(this.transformed.Details).to.not.deep.equal('https://and-we-are-the-actors')
        expect(this.transformed.Details).to.deep.equal({
          name: 'https://and-we-are-the-actors',
          url: 'https://and-we-are-the-actors',
        })
      })
    })

    context('when provided an abandoned proposition and a text including a url with https as detail', () => {
      beforeEach(() => {
        mockProposition.status = 'Abandoned'
        mockProposition.details = 'the world is a stage, https://and-we-are-the-actors'
        this.transformed = transformPropositionResponseToViewRecord(mockProposition)
      })

      it('should not transform it to a url', () => {
        expect(this.transformed.Details).to.deep.equal('the world is a stage, https://and-we-are-the-actors')
        expect(this.transformed.Details).to.not.deep.equal({
          name: 'https://and-we-are-the-actors',
          url: 'https://and-we-are-the-actors',
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
