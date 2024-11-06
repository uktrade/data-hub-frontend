import fixtures from '../../fixtures'
import urls from '../../../../../src/lib/urls'
import { assertGovReactTable } from '../../support/assertions'

const company = fixtures.company.oneListCorp
const globalAccountManager = company.one_list_group_global_account_manager

const coreTeamResponse = {
  adviser: {
    name: 'Travis Greene',
    ditTeam: {
      name: 'IST - Sector Advisory Services',
      ukRegion: {
        name: 'London',
      },
      country: {
        name: 'United Kingdom',
      },
    },
  },
  isGlobalAccountManager: true,
}

describe('One List core team', () => {
  context('when viewing a One List Tier company', () => {
    beforeEach(() => {
      cy.visit(urls.companies.accountManagement.index(company.id))
    })

    it('should render the heading', () => {
      cy.get('[data-test=core-team-heading]')
        .should('exist')
        .should('have.text', 'Advisers on the core team')
    })

    it('should render the subheading', () => {
      cy.get('[data-test=core-team-subheading]')
        .should('exist')
        .should(
          'have.text',
          'This is an account managed company on the One List (Tier A - Strategic Account)'
        )
    })

    it('should render the global account manager table', () => {
      assertGovReactTable({
        element: '[data-test="global-acc-manager-table"]',
        rows: [
          ['Team', 'Location', 'Global Account Manager', 'Email'],
          [
            globalAccountManager.dit_team.name,
            globalAccountManager.dit_team.uk_region.name,
            globalAccountManager.name,
            globalAccountManager.contact_email,
          ],
        ],
      })
    })

    it('should render the advisers table', () => {
      assertGovReactTable({
        element: '[data-test="advisers-table"]',
        rows: [
          ['Team', 'Location', 'Adviser on core team', 'Email'],
          [
            'Heart of the South West LEP',
            'United Kingdom',
            'Holly Collins',
            'holly@example.net',
          ],
          [
            'IG - Specialists - Knowledge Intensive Industry',
            'London',
            'Jenny Carey',
            '-',
          ],
        ],
      })
    })

    it('should render the details section', () => {
      cy.get('[data-test=core-team-details]')
        .click()
        .should('exist')
        .contains(
          'Need to find out more, or edit the One List tier information?For more information, or if you need to change the One List tier or account management team for this company, go to the Intranet (opens in new tab) or email'
        )
    })
  })

  context('when viewing a One List Tier company with no advisers', () => {
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/company/${company.id}/one-list-group-core-team`,
        {
          body: [coreTeamResponse],
        }
      ).as('apiRequest')
      cy.visit(urls.companies.accountManagement.index(company.id))
      cy.wait('@apiRequest')
    })

    it('should only render the global account manager table', () => {
      assertGovReactTable({
        element: '[data-test="global-acc-manager-table"]',
        rows: [
          ['Team', 'Location', 'Global Account Manager', 'Email'],
          [
            globalAccountManager.dit_team.name,
            globalAccountManager.dit_team.uk_region.name,
            globalAccountManager.name,
            '-',
          ],
        ],
      })
      cy.get('[data-test=advisers-table]').should('not.exist')
    })
  })
})
