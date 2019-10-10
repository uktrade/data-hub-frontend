import { assertBreadcrumbs } from '../../support/assertions'

const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('Companies subsidiaries', () => {
  context('when viewing subsidiaries for a Dun & Bradstreet company', () => {
    before(() => {
      cy.visit(`/companies/${fixtures.company.oneListCorp.id}/subsidiaries`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        [fixtures.company.oneListCorp.name]: `/companies/${fixtures.company.oneListCorp.id}`,
        'Business details': `/companies/${fixtures.company.oneListCorp.id}/business-details`,
        'Subsidiaries': null,
      })
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
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        [fixtures.company.venusLtd.name]: `/companies/${fixtures.company.venusLtd.id}`,
        'Business details': `/companies/${fixtures.company.venusLtd.id}/business-details`,
        'Subsidiaries': null,
      })
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
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        [fixtures.company.archivedLtd.name]: `/companies/${fixtures.company.archivedLtd.id}`,
        'Business details': `/companies/${fixtures.company.archivedLtd.id}/business-details`,
        'Subsidiaries': null,
      })
    })

    it('should display the "Why can I not link a subsidiary?" archived details summary', () => {
      cy.get(selectors.companySubsidiaries().whyArchived).should('be.visible')
    })
  })
})
