const fixtures = require('../../fixtures/index.js')
const selectors = require('../../selectors/index.js')

describe('Companies subsidiaries', () => {
  context('when viewing subsidiaries for a Dun & Bradstreet company', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.oneListCorp.id}/subsidiaries`)
    })

    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Companies')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/companies')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.text', fixtures.company.oneListCorp.name)
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.attr', 'href', `/companies/${fixtures.company.oneListCorp.id}`)
      cy.get(selectors.breadcrumbs.item.byNumber(4)).should('have.text', 'Business details')
      cy.get(selectors.breadcrumbs.item.byNumber(4)).should('have.attr', 'href', `/companies/${fixtures.company.oneListCorp.id}/business-details`)
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Subsidiaries')
    })

    it('should not display the "Why can I not link a subsidiary?" archived details summary', () => {
      cy.get(selectors.companySubsidiaries().whyArchived).should('not.exist')
    })
  })

  context('when viewing subsidiaries for a Data Hub company', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.venusLtd.id}/subsidiaries`)
    })

    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Companies')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/companies')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.text', fixtures.company.venusLtd.name)
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.attr', 'href', `/companies/${fixtures.company.venusLtd.id}`)
      cy.get(selectors.breadcrumbs.item.byNumber(4)).should('have.text', 'Business details')
      cy.get(selectors.breadcrumbs.item.byNumber(4)).should('have.attr', 'href', `/companies/${fixtures.company.venusLtd.id}/business-details`)
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Subsidiaries')
    })

    it('should not display the "Why can I not link a subsidiary?" archived details summary', () => {
      cy.get(selectors.companySubsidiaries().whyArchived).should('not.exist')
    })
  })

  context('when viewing subsidiaries for an archived company', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.archivedLtd.id}/subsidiaries`)
    })

    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Companies')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/companies')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.text', fixtures.company.archivedLtd.name)
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.attr', 'href', `/companies/${fixtures.company.archivedLtd.id}`)
      cy.get(selectors.breadcrumbs.item.byNumber(4)).should('have.text', 'Business details')
      cy.get(selectors.breadcrumbs.item.byNumber(4)).should('have.attr', 'href', `/companies/${fixtures.company.archivedLtd.id}/business-details`)
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Subsidiaries')
    })

    it('should display the "Why can I not link a subsidiary?" archived details summary', () => {
      cy.get(selectors.companySubsidiaries().whyArchived).should('be.visible')
    })
  })
})
