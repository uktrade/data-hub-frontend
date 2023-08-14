const fixtures = require('../../../fixtures')
const urls = require('../../../../../../src/lib/urls')

const assertTable = ({ element, rows }) => {
  cy.get(element).as('table').find('th')

  cy.get('@table')
    .find('tbody')
    .find('tr')
    .each((el, i) => {
      cy.wrap(el)
        .children()
        .each((el, j) => {
          cy.wrap(el).should('have.text', rows[i][j])
        })
    })
}

describe('Lead advisers', () => {
  context('when viewing a non One List tier company', () => {
    before(() => {
      cy.visit(urls.companies.detail(fixtures.company.marsExportsLtd.id))
      cy.get('#tab-advisers').click()
    })

    it('should render a meta title', () => {
      cy.title().should(
        'eq',
        'Lead adviser - Mars Exports Ltd - Companies - DBT Data Hub'
      )
    })

    it('should display the "Lead Adviser" tab in the navigation', () => {
      cy.get('#tab-advisers').should('contain', 'Lead adviser')
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
          urls.companies.accountManagement.assign(
            fixtures.company.marsExportsLtd.id
          )
        )
    })
  })
  context('when viewing a One List Tier company', () => {
    before(() => {
      cy.visit(urls.companies.detail(fixtures.company.oneListCorp.id))
    })

    it('should display the "Core team" tab in the navigation', () => {
      cy.get('#tab-advisers').should('contain', 'Core team')
    })
  })
  context(
    'when viewing a One List tier D - ITA company with an allocated Account manager',
    () => {
      before(() => {
        cy.visit(urls.companies.detail(fixtures.company.oneListTierDita.id))
        cy.get('#tab-advisers').click()
      })

      const globalAccountManager =
        fixtures.company.oneListTierDita.one_list_group_global_account_manager

      it('should have a link to the Lead adviser tab', () => {
        cy.contains('View Lead adviser')
          .invoke('attr', 'href')
          .should(
            'eq',
            urls.companies.accountManagement.index(
              fixtures.company.oneListTierDita.id
            )
          )
      })
      it('should display the "Lead Adviser" tab in the navigation', () => {
        cy.get('#tab-advisers').should('contain', 'Lead adviser')
      })
      it('should display a header with the company name', () => {
        cy.contains("Lead ITA for Ian's Camper Vans Ltd")
      })
      it('should render the global account manager table', () => {
        assertTable({
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
            urls.companies.accountManagement.assign(
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
