import urls from '../../../../../src/lib/urls'

const companySearchEndpoint = '/api-proxy/v4/search/company'

describe('Contact Collections Sort', () => {
  context('Default sort', () => {
    before(() => {
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit(urls.companies.index())
    })

    it('should apply the default sort', () => {
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('modified_on:desc')
      })
    })

    it('should have all sort options', () => {
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => [o.value, o.text])
        expect(sortOptions).to.deep.eq([
          ['modified_on:desc', 'Recently updated'],
          ['modified_on:asc', 'Least recently updated'],
          ['name:asc', 'Company A-Z'],
          ['latest_interaction_date:desc', 'Last interaction date'],
        ])
      })
    })
  })

  context('User sort', () => {
    const element = '[data-test="sortby"] select'

    beforeEach(() => {
      cy.intercept('POST', companySearchEndpoint).as('apiRequest')
      cy.visit('/companies?page=1')
      cy.wait('@apiRequest')
    })

    it('should sort by "Recently updated"', () => {
      cy.get(element).select('modified_on:desc')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('modified_on:desc')
      })
    })

    it('should sort by "Least recently updated"', () => {
      cy.get(element).select('modified_on:asc')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('modified_on:asc')
      })
    })

    it('should sort by "Company A-Z"', () => {
      cy.get(element).select('name:asc')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('name:asc')
      })
    })

    it('should sort by "Last interaction date"', () => {
      cy.get(element).select('latest_interaction_date:desc')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('latest_interaction_date:desc')
      })
    })
  })
})
