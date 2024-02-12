import urls from '../../../../../src/lib/urls'
import { assertUrl } from '../../support/assertions'

const interactionsSearchEndpoint = '/api-proxy/v3/search/interaction'

describe('Interactions Collections Sort', () => {
  context('Default sort', () => {
    beforeEach(() => {
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.visit(urls.interactions.index())
    })

    it('should apply the default sort', () => {
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('date:desc')
      })
    })

    it('should have all sort options', () => {
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => ({
          value: o.value,
          label: o.label,
        }))
        expect(sortOptions).to.deep.eq([
          { value: 'date:desc', label: 'Recently created' },
          { value: 'company.name', label: 'Company name A-Z' },
          { value: 'subject', label: 'Subject A-Z' },
        ])
      })
    })
  })

  context('User sort', () => {
    const element = '[data-test="sortby"] select'

    beforeEach(() => {
      cy.intercept('POST', interactionsSearchEndpoint).as('apiRequest')
      cy.visit(`${urls.interactions.index()}?page=1`)
      cy.wait('@apiRequest')
    })

    it('should sort by "Recently created"', () => {
      cy.get(element).select('Recently created')
      assertUrl('sortby=date:desc')
    })

    it('should sort by "Company name A-Z"', () => {
      cy.get(element).select('Company name A-Z')
      assertUrl('sortby=company.name')
    })

    it('should sort by "Subject A-Z"', () => {
      cy.get(element).select('Subject A-Z')
      assertUrl('sortby=subject')
    })
  })
})
