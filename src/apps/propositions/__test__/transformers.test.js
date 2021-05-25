const { assign } = require('lodash')
const mockProposition = require('../../../../test/unit/data/propositions/proposition.json')

const {
  transformPropositionResponseToForm,
  transformPropositionToListItem,
  transformPropositionResponseToViewRecord,
  transformPropositionListItemToHaveUrlPrefix,
} = require('../transformers')

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

  describe('#transformPropositionResponsetoViewRecord', () => {
    context('when provided a fully populated proposition', () => {
      beforeEach(() => {
        this.transformed =
          transformPropositionResponseToViewRecord(mockProposition)
      })

      it('should transform to display format', () => {
        expect(this.transformed).to.deep.equal({
          Scope: 'Scope 0',
          Status: 'Ongoing',
          'Date created': { type: 'date', name: '2018-05-09' },
          'Modified on': { type: 'date', name: '2018-05-03T09:49:03.038168Z' },
          Deadline: { type: 'date', name: '2018-05-20' },
          'Assigned to': {
            first_name: 'Joseph',
            last_name: 'Wright of Derby ',
            name: 'Joseph Wright of Derby',
            id: '14d9f881-4df4-421b-8181-874f9dc83b76',
          },
          'File 1': [
            'il_fullxfull.826924229_2xdo.jpg',
            {
              name: 'Download',
              url: '/investments/projects/65e77d82-8ebb-4ee7-b6ac-8c5945c512db/propositions/7d68565a-fc0e-422c-8ce3-df92cd40a64a/download/1a85b301-56ae-4073-97db-a42604c40bea',
            },
          ],
          'File 2': [
            'totally_not_a_virus.zip',
            {
              name: "The file didn't pass virus scanning, contact your administrator",
              type: 'error',
            },
          ],
          'File 3': [
            '780-rainbow-teacosy-1.jpg',
            {
              name: 'Download',
              url: '/investments/projects/65e77d82-8ebb-4ee7-b6ac-8c5945c512db/propositions/7d68565a-fc0e-422c-8ce3-df92cd40a64a/download/1eab8de6-0a9a-4152-95d0-a3eca9ef6a8f',
            },
          ],
        })
      })
    })

    context(
      'when provided an abandoned proposition and simple text as detail',
      () => {
        beforeEach(() => {
          mockProposition.status = 'Abandoned'
          mockProposition.details = 'the world is a stage'
          this.transformed =
            transformPropositionResponseToViewRecord(mockProposition)
        })

        it('should not transform it to a collection with only word objects', () => {
          expect(this.transformed.Details.value).to.deep.equal([
            { type: 'paragraph', value: 'the world is a stage' },
          ])
        })
      }
    )

    context(
      'when provided an abandoned proposition and a url with http as detail',
      () => {
        beforeEach(() => {
          mockProposition.status = 'Abandoned'
          mockProposition.details = 'http://the-world-is-a-stage'
          this.transformed =
            transformPropositionResponseToViewRecord(mockProposition)
        })

        it('should transform it to a collection with a single link object', () => {
          expect(this.transformed.Details.value).to.not.equal(
            'the world is a stage'
          )
          expect(this.transformed.Details.value).to.deep.equal([
            {
              type: 'link',
              value: {
                url: 'http://the-world-is-a-stage',
                name: 'http://the-world-is-a-stage',
              },
            },
          ])
        })
      }
    )

    context(
      'when provided an abandoned proposition and a url with http as detail ending with a new line',
      () => {
        beforeEach(() => {
          mockProposition.status = 'Abandoned'
          mockProposition.details = 'http://the-world-is-a-stage\n'
          this.transformed =
            transformPropositionResponseToViewRecord(mockProposition)
        })

        it('should transform it to a collection with a single link object', () => {
          expect(this.transformed.Details.value).to.deep.equal([
            {
              type: 'link',
              value: {
                url: 'http://the-world-is-a-stage',
                name: 'http://the-world-is-a-stage',
              },
            },
          ])
        })
      }
    )

    context(
      'when provided an abandoned proposition and a url with http as detail ending with a carriage return',
      () => {
        beforeEach(() => {
          mockProposition.status = 'Abandoned'
          mockProposition.details = 'http://bazzinga\r'
          this.transformed =
            transformPropositionResponseToViewRecord(mockProposition)
        })

        it('should transform it to a collection with a link object with http, and an empty word object', () => {
          expect(this.transformed.Details.value).to.deep.equal([
            {
              type: 'link',
              value: { url: 'http://bazzinga', name: 'http://bazzinga' },
            },
          ])
        })
      }
    )

    context(
      'when provided an abandoned proposition and a url with https as detail',
      () => {
        beforeEach(() => {
          mockProposition.status = 'Abandoned'
          mockProposition.details = 'https://and-we-are-the-actors'
          this.transformed =
            transformPropositionResponseToViewRecord(mockProposition)
        })

        it('should transform it to a collection with a link object with https', () => {
          expect(this.transformed.Details.value).to.deep.equal([
            {
              type: 'link',
              value: {
                url: 'https://and-we-are-the-actors',
                name: 'https://and-we-are-the-actors',
              },
            },
          ])
        })
      }
    )

    context(
      'when provided an abandoned proposition and a text that starts with a https url as detail',
      () => {
        beforeEach(() => {
          mockProposition.status = 'Abandoned'
          mockProposition.details =
            'https://world-is-a-stage and we are the actors'
          this.transformed =
            transformPropositionResponseToViewRecord(mockProposition)
        })

        it('should transform it to a collection with a link object for the url and a word object for the rest of the words in the string', () => {
          expect(this.transformed.Details.value).to.deep.equal([
            {
              type: 'link',
              value: {
                url: 'https://world-is-a-stage',
                name: 'https://world-is-a-stage',
              },
            },
            { type: 'paragraph', value: 'and we are the actors' },
          ])
        })
      }
    )

    context(
      'when provided an abandoned proposition and a text that starts has also some a urls as detail',
      () => {
        beforeEach(() => {
          mockProposition.status = 'Abandoned'
          mockProposition.details =
            'in this universe https://world-is-a-stage and we are the actors www.yahoo.com of the play http://third.link lorem ipsum'
          this.transformed =
            transformPropositionResponseToViewRecord(mockProposition)
        })

        it('should transform it to a collection with a link object for the url and a word object for the rest of the words in the string', () => {
          expect(this.transformed.Details.value).to.deep.equal([
            { type: 'paragraph', value: 'in this universe' },
            {
              type: 'link',
              value: {
                url: 'https://world-is-a-stage',
                name: 'https://world-is-a-stage',
              },
            },
            { type: 'paragraph', value: 'and we are the actors' },
            {
              type: 'link',
              value: {
                url: 'www.yahoo.com',
                name: 'www.yahoo.com',
              },
            },
            { type: 'paragraph', value: 'of the play' },
            {
              type: 'link',
              value: {
                url: 'http://third.link',
                name: 'http://third.link',
              },
            },
            { type: 'paragraph', value: 'lorem ipsum' },
          ])
        })
      }
    )

    context(
      'when provided an abandoned proposition and a text including an url with https as detail',
      () => {
        beforeEach(() => {
          mockProposition.status = 'Abandoned'
          mockProposition.details =
            'the world https://is-a-stage and we are the actors'
          this.transformed =
            transformPropositionResponseToViewRecord(mockProposition)
        })

        it('should transform it to a collection with a link object for the url and a word object for the rest of the words in the string', () => {
          expect(this.transformed.Details.value).to.deep.equal([
            { type: 'paragraph', value: 'the world' },
            {
              type: 'link',
              value: { url: 'https://is-a-stage', name: 'https://is-a-stage' },
            },
            { type: 'paragraph', value: 'and we are the actors' },
          ])
        })
      }
    )

    context(
      'when provided an abandoned proposition and a text including multiple urls as detail',
      () => {
        beforeEach(() => {
          mockProposition.status = 'Abandoned'
          mockProposition.details =
            'the world https://is-a-stage and we are the actors, find more quotes at http://padding-quotes#123 and put them here'
          this.transformed =
            transformPropositionResponseToViewRecord(mockProposition)
        })

        it('should transform it to a collection with two link objects for the urls and a word object for the rest of the words in the string', () => {
          expect(this.transformed.Details.value).to.deep.equal([
            { type: 'paragraph', value: 'the world' },
            {
              type: 'link',
              value: { url: 'https://is-a-stage', name: 'https://is-a-stage' },
            },
            {
              type: 'paragraph',
              value: 'and we are the actors, find more quotes at',
            },
            {
              type: 'link',
              value: {
                url: 'http://padding-quotes#123',
                name: 'http://padding-quotes#123',
              },
            },
            { type: 'paragraph', value: 'and put them here' },
          ])
        })
      }
    )
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
