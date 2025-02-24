const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')
const { assertGovReactTable } = require('../../../support/assertions')

describe('Lead advisers', () => {
  context('when viewing a non One List tier company', () => {
    beforeEach(() => {
      cy.visit(
        urls.companies.accountManagement.index(
          fixtures.company.marsExportsLtd.id
        )
      )
    })

    it('should render a meta title', () => {
      cy.title().should(
        'eq',
        'Account management - Mars Exports Ltd - Companies - DBT Data Hub'
      )
    })

    it('should display a header with the company name', () => {
      cy.contains('Lead ITA for Mars Exports Ltd')
    })
    it('should display help text for adding a lead adviser', () => {
      cy.contains(
        'This company record has no Lead International Trade Adviser (ITA).'
      )
      cy.contains(
        'You can add a Lead ITA. This will be visible to all Data Hub users.'
      )
    })
    it('should display a button to add a lead adviser', () => {
      cy.contains('Add a Lead ITA')
        .invoke('attr', 'href')
        .should(
          'eq',
          urls.companies.accountManagement.advisers.assign(
            fixtures.company.marsExportsLtd.id
          )
        )
    })
  })
  context(
    'when viewing a One List tier D - ITA company with an allocated Account manager',
    () => {
      beforeEach(() => {
        cy.visit(
          urls.companies.accountManagement.index(
            fixtures.company.oneListTierDita.id
          )
        )
      })

      const globalAccountManager =
        fixtures.company.oneListTierDita.one_list_group_global_account_manager

      it('should display a header with the company name', () => {
        cy.contains('Advisers on core team')
      })
      it('should render the global account manager table', () => {
        assertGovReactTable({
          element: '[data-test="lead-adviser-table"]',
          rows: [
            ['Team', 'Lead ITA', 'Email'],
            [
              globalAccountManager.dit_team.name,
              globalAccountManager.name,
              globalAccountManager.contact_email,
            ],
          ],
        })
      })
      it('should display a button to replace the Lead ITA', () => {
        cy.contains('Replace Lead ITA')
          .invoke('attr', 'href')
          .should(
            'eq',
            urls.companies.accountManagement.advisers.assign(
              fixtures.company.oneListTierDita.id
            )
          )
      })
      it('should display a button to remove the Lead ITA', () => {
        cy.contains('Remove Lead ITA')
          .invoke('attr', 'href')
          .should(
            'eq',
            urls.companies.accountManagement.advisers.remove(
              fixtures.company.oneListTierDita.id
            )
          )
      })
    }
  )
})
