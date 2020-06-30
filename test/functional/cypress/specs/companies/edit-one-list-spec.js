const {
  assertLocalHeader,
  assertBreadcrumbs,
  assertFieldRadios,
} = require('../../support/assertions')

const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const metadataTiers = require('../../../../sandbox/fixtures/metadata/one-list-tier.json')
const urls = require('../../../../../src/lib/urls')

describe('Edit One List', () => {
  context('when viewing the "Edit One List" page', () => {
    const testCompany = fixtures.company.oneListCorp
    before(() => {
      cy.visit(urls.companies.editOneList(testCompany.id))
    })

    it('should render the header', () => {
      assertLocalHeader(`Add or edit ${testCompany.name} One List information`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [testCompany.name]: urls.companies.detail(testCompany.id),
        'Edit One List information': null,
      })
    })
  })

  context('when editing details of an existing One List company', () => {
    const testCompany = fixtures.company.oneListCorp

    before(() => {
      cy.visit(urls.companies.editOneList(testCompany.id))
    })

    it('should render One List tier options with tier pre-selected', () => {
      metadataTiers.forEach((tier) => {
        cy.get(selectors.companyEditOneList.tierField).contains(tier.name)
      })

      cy.get(selectors.companyEditOneList.tierField).contains(
        'Not on the One List'
      )

      cy.get(selectors.companyEditOneList.tierField).then((element) => {
        assertFieldRadios({
          element,
          label: 'Company One List tier',
          optionsCount: 8,
          value: testCompany.one_list_group_tier.name,
        })
      })
    })

    it('should have the account manager pre-selected', () => {
      cy.contains('Continue').click()

      cy.get(selectors.companyEditOneList.globalAccountManagerField).contains(
        testCompany.one_list_group_global_account_manager.name
      )
    })

    it('should submit updated data', () => {
      cy.get(
        selectors.companyEditOneList.globalAccountManagerField
      ).selectTypeaheadOption('shawn')

      cy.contains('Holly Collins')
        .next()
        .click({ force: true })

      cy.get(selectors.companyEditOneList.coreTeamFieldText).should(
        'not.contain',
        'Holly Collins'
      )

      cy.get(selectors.companyEditOneList.coreTeamField).selectTypeaheadOption(
        'leroy'
      )

      cy.contains('Submit').click()

      cy.location('pathname').should(
        'eq',
        urls.companies.businessDetails(testCompany.id)
      )
    })
  })

  context(
    'when editing details of a company that is not currently on One List',
    () => {
      const testCompany = fixtures.company.minimallyMinimalLtd

      before(() => {
        cy.visit(urls.companies.editOneList(testCompany.id))
      })

      it('should not have a tier pre-selected', () => {
        cy.get('input[checked]').should('not.exist')
      })

      it('should not have an account manager pre-listed', () => {
        cy.contains('Tier A - Strategic Account').click()
        cy.contains('Continue').click()

        cy.get(selectors.companyEditOneList.globalAccountManagerField).contains(
          '-- Select adviser --'
        )
      })

      it('should not have a core team pre-listed', () => {
        cy.get(selectors.companyEditOneList.coreTeamFieldText).contains(
          '-- Select adviser --'
        )
      })

      it('should submit updated data', () => {
        cy.get(selectors.companyEditOneList.globalAccountManagerField)
          .selectTypeaheadOption('shawn')
          .contains('Shawn Cohen')

        cy.contains('Submit').click()

        cy.location('pathname').should(
          'eq',
          urls.companies.businessDetails(testCompany.id)
        )
      })
    }
  )

  context('when removing a company from One List tiers', () => {
    const testCompany = fixtures.company.oneListCorp

    before(() => {
      cy.visit(urls.companies.editOneList(testCompany.id))
    })

    it('should submit the form without manager information stage', () => {
      cy.contains('Not on the One List').click()

      cy.contains('Submit').click()

      cy.location('pathname').should(
        'eq',
        urls.companies.businessDetails(testCompany.id)
      )
    })
  })
})
