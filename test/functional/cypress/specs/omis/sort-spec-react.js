import { omis } from '../../../../../src/lib/urls'

const searchEndpoint = '/api-proxy/v3/search/order'

describe('Order Collections Sort', () => {
  context('Default sort', () => {
    before(() => {
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(omis.react.index())
    })

    it('should apply the default sort', () => {
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('created_on:desc')
      })
    })

    it('should have all sort options', () => {
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => ({
          value: o.value,
          label: o.label,
        }))
        expect(sortOptions).to.deep.eq([
          { value: 'created_on:desc', label: 'Recently created' },
          { value: 'created_on:asc', label: 'Oldest' },
          { value: 'modified_on:desc', label: 'Recently updated' },
          { value: 'modified_on:asc', label: 'Least recently updated' },
          { value: 'delivery_date:asc', label: 'Earliest delivery date' },
          { value: 'delivery_date:desc', label: 'Latest delivery date' },
        ])
      })
    })
  })

  context('User sort', () => {
    const element = '[data-test="sortby"] select'

    beforeEach(() => {
      cy.intercept('POST', searchEndpoint).as('apiRequest')
      cy.visit(omis.react.index())
      cy.wait('@apiRequest')
    })

    it('should sort by "Recently created"', () => {
      cy.get(element).select('Recently created')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('created_on:desc')
      })
    })

    it('should sort by "Oldest"', () => {
      cy.get(element).select('Oldest')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('created_on:asc')
      })
    })

    it('should sort by "Recently updated"', () => {
      cy.get(element).select('Recently updated')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('modified_on:desc')
      })
    })

    it('should sort by "Least recently updated"', () => {
      cy.get(element).select('Least recently updated')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('modified_on:asc')
      })
    })

    it('should sort by "Earliest delivery date"', () => {
      cy.get(element).select('Earliest delivery date')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('delivery_date:asc')
      })
    })

    it('should sort by "Latest delivery date"', () => {
      cy.get(element).select('Latest delivery date')
      cy.wait('@apiRequest').then(({ request }) => {
        expect(request.body.sortby).to.equal('delivery_date:desc')
      })
    })
  })
})
