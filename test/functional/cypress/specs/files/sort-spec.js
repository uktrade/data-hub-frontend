import { companies } from '../../../../../src/lib/urls'
import { genericDocumentsListFaker } from '../../fakers/generic-documents'

describe('Files Collections Sort', () => {
  const genericDocumentsList = [...genericDocumentsListFaker(3)]
  const relatedObjectId = '4cd4128b-1bad-4f1e-9146-5d4678c6a018'
  const defaultSortApiUrl = `/api-proxy/v4/document/?related_object_id=${relatedObjectId}&limit=10&offset=0&sortby=-created_on`
  const oldestFirstSortApiUrl = `/api-proxy/v4/document/?related_object_id=${relatedObjectId}&limit=10&offset=0&sortby=created_on`

  context('Default sort', () => {
    beforeEach(() => {
      cy.intercept('GET', defaultSortApiUrl, {
        body: {
          count: genericDocumentsList.length,
          results: genericDocumentsList,
        },
      }).as('apiRequest')
      cy.visit(companies.files(relatedObjectId), {
        qs: { sortby: '-created_on' },
      })
    })

    it('should apply the default sort', () => {
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.url).to.include('sortby=-created_on')
      })
    })
  })

  context('When the user sorts the list', () => {
    beforeEach(() => {
      cy.intercept('GET', oldestFirstSortApiUrl, {
        body: {
          count: genericDocumentsList.length,
          results: genericDocumentsList,
        },
      }).as('apiRequest')
      cy.visit(companies.files(relatedObjectId), {
        qs: { sortby: 'created_on' },
      })
    })

    it('should have all sort options', () => {
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => [o.value, o.text])
        expect(sortOptions).to.deep.eq([
          ['-created_on', 'Recently created'],
          ['created_on', 'Oldest'],
        ])
      })
    })
  })
})
