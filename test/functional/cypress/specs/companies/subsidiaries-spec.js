const { assertBreadcrumbs } = require('../../support/assertions')
const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

describe('Companies subsidiaries', () => {
  context('when viewing subsidiaries for a Dun & Bradstreet company', () => {
    beforeEach(() => {
      cy.visit(
        urls.companies.subsidiaries.index(fixtures.company.oneListCorp.id)
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
        [fixtures.company.oneListCorp.name]: urls.companies.detail(
          fixtures.company.oneListCorp.id
        ),
        'Business details': urls.companies.businessDetails(
          fixtures.company.oneListCorp.id
        ),
        Subsidiaries: null,
      })
    })

    it('should not display the "Why can I not link a subsidiary?" archived details summary', () => {
      cy.get(selectors.companySubsidiaries().whyArchived).should('not.exist')
    })
  })

  context('when viewing subsidiaries for a Data Hub company', () => {
    beforeEach(() => {
      cy.visit(urls.companies.subsidiaries.index(fixtures.company.venusLtd.id))
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
        [fixtures.company.venusLtd.name]: urls.companies.detail(
          fixtures.company.venusLtd.id
        ),
        'Business details': urls.companies.businessDetails(
          fixtures.company.venusLtd.id
        ),
        Subsidiaries: null,
      })
    })

    it('should not display the "Why can I not link a subsidiary?" archived details summary', () => {
      cy.get(selectors.companySubsidiaries().whyArchived).should('not.exist')
    })
  })

  context('when viewing subsidiaries for an archived company', () => {
    beforeEach(() => {
      cy.visit(
        urls.companies.subsidiaries.index(fixtures.company.archivedLtd.id)
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Companies: urls.companies.index(),
        [fixtures.company.archivedLtd.name]: urls.companies.detail(
          fixtures.company.archivedLtd.id
        ),
        'Business details': urls.companies.businessDetails(
          fixtures.company.archivedLtd.id
        ),
        Subsidiaries: null,
      })
    })

    it('should display the "Why can I not link a subsidiary?" archived details summary', () => {
      cy.get(selectors.companySubsidiaries().whyArchived).should('be.visible')
    })
  })

  context(
    'when viewing a company which is a D&B Global Ultimate and Global HQ at the same time',
    () => {
      beforeEach(() => {
        cy.visit(
          urls.companies.subsidiaries.index(
            fixtures.company.dnBGlobalUltimateAndGlobalHq.id
          )
        )
      })

      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: urls.dashboard.index(),
          Companies: urls.companies.index(),
          [fixtures.company.dnBGlobalUltimateAndGlobalHq.name]:
            urls.companies.detail(
              fixtures.company.dnBGlobalUltimateAndGlobalHq.id
            ),
          'Business details': urls.companies.businessDetails(
            fixtures.company.dnBGlobalUltimateAndGlobalHq.id
          ),
          Subsidiaries: null,
        })
      })

      it('should render the helper text', () => {
        cy.get('p').should(
          'contain',
          'This hierarchy information is manually recorded (linked) by Data Hub users. ' +
            'This means it can be different from the Dun & Bradstreet hierarchy, ' +
            'which in the future will replace this manually recorded information.'
        )
      })
    }
  )
})
