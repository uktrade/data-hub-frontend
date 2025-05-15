import { companies } from '../../../../../src/lib/urls'
import { companyFaker } from '../../fakers/companies'
import { genericDocumentListFaker } from '../../fakers/generic-documents'

describe('Files Collections Sort', () => {
  const genericDocumentsList = [...genericDocumentListFaker(3)]
  const company = companyFaker()
  const defaultSortApiUrl = `/api-proxy/v4/document/?related_object_id=${company.id}&limit=10&offset=0&sortby=-created_on`
  const oldestFirstSortApiUrl = `/api-proxy/v4/document/?related_object_id=${company.id}&limit=10&offset=0&sortby=created_on`

  context('Default sort', () => {
    beforeEach(() => {
      cy.intercept('GET', defaultSortApiUrl, {
        body: {
          count: genericDocumentsList.length,
          results: genericDocumentsList,
        },
      }).as('apiRequest')
      cy.visit(companies.files.index(company.id), {
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
      cy.visit(companies.files.index(company.id), {
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
