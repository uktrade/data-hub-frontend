import { faker } from '../../../../sandbox/utils/random'
import { companyFaker } from '../../fakers/companies'
import { userFaker } from '../../fakers/users'
import objectiveListFaker, { objectiveFaker } from '../../fakers/objective'
import { adviserFaker } from '../../fakers/advisers'
import {
  formatDate,
  DATE_FORMAT_COMPACT,
} from '../../../../../src/client/utils/date-utils'
import {
  assertCompanyBreadcrumbs,
  assertGovReactTable,
  assertRequestUrl,
} from '../../support/assertions'

const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const companyId = fixtures.company.allActivitiesCompany.id

const company = fixtures.company.oneListCorp
const companyTierD = fixtures.company.oneListTierDita
const globalAccountManager = company.one_list_group_global_account_manager

const coreTeamResponse = {
  adviser: {
    name: 'Travis Greene',
    contactEmail: 'travis@example.net',
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

const assertBreadcrumbs = (company) => {
  assertCompanyBreadcrumbs(
    company.name,
    urls.companies.detail(company.id),
    'Account management'
  )
}

describe('Company account management', () => {
  const companyWithStrategy = companyFaker({
    name: 'Best Ever Company',
    strategy: 'ABC',
    id: companyId,
    modifiedBy: userFaker(),
    modifiedOn: faker.date.past(),
  })

  const objectives = objectiveListFaker((length = 3))
  const noBlockersObjective = objectiveFaker({ has_blocker: false })
  const archivedObjective = objectiveFaker({ archived: true })

  context('When visiting the account management page with a strategy', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/company/${companyId}`,
        companyWithStrategy
      ).as('companyApi')
      cy.visit(urls.companies.accountManagement.index(companyId))
      cy.wait('@companyApi')
    })

    assertBreadcrumbs(fixtures.company.allActivitiesCompany)

    it('should display the strategy heading', () => {
      cy.get('h3').contains('Strategy')
    })

    it('should display the edit history details link', () => {
      cy.get('[data-test="edit-history-link"]').should(
        'have.attr',
        'href',
        urls.companies.editHistory.index(companyId)
      )
    })

    it('should display the updated by information', () => {
      cy.get('[data-test="last-updated-strategy-details"] > span')
        .eq(0)
        .contains(
          `Last updated by ${companyWithStrategy.modifiedBy.name}: ${formatDate(
            companyWithStrategy.modifiedOn,
            DATE_FORMAT_COMPACT
          )}. `
        )
    })

    it('should display the edit strategy link', () => {
      cy.get('[data-test="edit-strategy-link"]').should(
        'have.attr',
        'href',
        urls.companies.accountManagement.strategy.edit(companyId)
      )
    })
  })

  context(
    'When visiting the account management page without a strategy',
    () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
          `/api-proxy/v4/company/${companyId}`,
          companyFaker({
            name: 'Best Ever Company',
            strategy: undefined,
            id: companyId,
          })
        ).as('companyApi')
        cy.visit(urls.companies.accountManagement.index(companyId))
        cy.wait('@companyApi')
      })

      assertBreadcrumbs(fixtures.company.allActivitiesCompany)

      it('should display the strategy heading', () => {
        cy.get('h3').contains('Strategy')
      })

      it('should display the add strategy button', () => {
        cy.get('[data-test="add-strategy-button"]').should(
          'have.attr',
          'href',
          urls.companies.accountManagement.strategy.create(companyId)
        )
      })
    }
  )

  context(
    'When visiting the account management page without objectives',
    () => {
      beforeEach(() => {
        cy.intercept('GET', `/api-proxy/v4/company/${companyId}/objective**`, {
          results: [],
        }).as('objectiveApi')
        cy.visit(urls.companies.accountManagement.index(companyId))
        cy.wait('@objectiveApi')
      })

      it('should not display any objectives', () => {
        cy.get('[data-test="objective"]').should('not.exist')
      })

      it('should display the add objective button', () => {
        cy.get('[data-test="add-objective-button"]').should(
          'have.attr',
          'href',
          urls.companies.accountManagement.objectives.create(companyId)
        )
      })
    }
  )

  context('When visiting the account management page with objectives', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/company/${companyId}/objective**`, {
        results: [...objectives, noBlockersObjective],
      }).as('objectiveApi')
      cy.visit(urls.companies.accountManagement.index(companyId))
    })

    it('should check the objectives endpoint was called with expected values', () => {
      assertRequestUrl(
        '@objectiveApi',
        `/api-proxy/v4/company/${companyId}/objective?sortby=target_date&archived=false`
      )
    })

    it('should display the blocker text when an objective has a blocker', () => {
      cy.get('[data-test="objective has-blocker"]')
        .eq(0)
        .find('[data-test="metadata-item"]')
        .should('contain', objectives[0].blocker_description)
    })

    it('should not display the blocker text when an objective has no blocker', () => {
      cy.get('[data-test="objective no-blocker"]')
        .find('[data-test="metadata-item"]')
        .should('not.contain', noBlockersObjective.blocker_description)
    })
  })

  context(
    'When visiting the account management page with no archived objectives',
    () => {
      beforeEach(() => {
        cy.intercept('GET', `/api-proxy/v4/company/${companyId}/objective**`, {
          results: [...objectives],
        }).as('objectiveApi')
        cy.visit(urls.companies.accountManagement.index(companyId))
      })

      it('should not display the archived objectives link', () => {
        cy.get('[data-test="archived-objectives-link"]').should('not.exist')
      })
    }
  )

  context(
    'When visiting the account management page with archived objectives',
    () => {
      beforeEach(() => {
        cy.intercept('GET', `/api-proxy/v4/company/${companyId}/objective?**`, {
          results: [...objectives, archivedObjective],
        }).as('objectiveApi')
        cy.intercept(
          'GET',
          `/api-proxy/v4/company/${companyId}/objective/count`,
          { archived_count: 1, not_archived_count: 1 }
        ).as('objectiveCountApi')
        cy.visit(urls.companies.accountManagement.index(companyId))
        cy.wait(['@objectiveApi', '@objectiveCountApi'])
      })

      it('should display the archived objectives link', () => {
        cy.get('[data-test="archived-objectives-link"]').should(
          'have.attr',
          'href',
          urls.companies.accountManagement.objectives.archived(companyId)
        )
      })
    }
  )

  context('When visiting the account management page', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/company/${companyId}`).as('companyApi')
      cy.visit(urls.companies.accountManagement.index(companyId))
      cy.wait('@companyApi')
    })

    it('should display the account plan section', () => {
      cy.get('[data-test="account-plan-row"]').should('be.visible')
    })

    it('should navigate to the account plan page when the link is clicked', () => {
      cy.get('[data-test="newWindowLink"]')
        .should('exist')
        .should(
          'have.attr',
          'href',
          urls.external.dataWorkspace.accountPlans(companyId)
        )
    })
  })
})

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

    it('should render the edit core team button', () => {
      cy.get('[data-test="edit-core-team-button"]', { timeout: 10000 })
        .should('exist')
        .should('have.attr', 'href', urls.companies.editVirtualTeam(company.id))
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
    beforeEach(() => {
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
            globalAccountManager.contact_email,
          ],
        ],
      })
      cy.get('[data-test=advisers-table]').should('not.exist')
    })
  })
})

describe('One List core Tier D team', () => {
  context('when viewing a One List Tier D company', () => {
    beforeEach(() => {
      cy.visit(urls.companies.accountManagement.index(companyTierD.id))
    })

    it('should render the heading', () => {
      cy.get('[data-test=lead-ita-heading]')
        .should('exist')
        .should('have.text', 'Advisers on core team')
    })

    it('should render the Lead ITA table', () => {
      assertGovReactTable({
        element: '[data-test="lead-adviser-table"]',
        rows: [
          ['Team', 'Lead ITA', 'Email'],
          [
            companyTierD.one_list_group_global_account_manager.dit_team.name,
            companyTierD.one_list_group_global_account_manager.name,
            companyTierD.one_list_group_global_account_manager.contact_email,
          ],
        ],
      })
    })
    it('it should not render a button to edit core team', () => {
      cy.get('[data-test="edit-core-team-button"]').should('not.exist')
    })
  })

  context(
    'when viewing a One List Tier D company without DIT team name for account manager',
    () => {
      const companyTierDNoTeam = companyFaker({
        one_list_group_global_account_manager: adviserFaker({
          dit_team: undefined,
        }),
        one_list_group_tier: {
          id: '1929c808-99b4-4abf-a891-45f2e187b410',
          name: 'Tier D - International Trade Adviser Accounts',
        },
        id: companyTierD.id,
      })

      beforeEach(() => {
        cy.intercept(
          'GET',
          `/api-proxy/v4/company/${companyTierD.id}`,
          companyTierDNoTeam
        ).as('companyApi')
        cy.visit(urls.companies.accountManagement.index(companyTierD.id))
        cy.wait('@companyApi')
      })

      it('should render the heading', () => {
        cy.get('[data-test=lead-ita-heading]')
          .should('exist')
          .should('have.text', `Advisers on core team`)
      })

      it('should render the Lead ITA table', () => {
        assertGovReactTable({
          element: '[data-test="lead-adviser-table"]',
          rows: [
            ['Team', 'Lead ITA', 'Email'],
            [
              '-',
              companyTierDNoTeam.one_list_group_global_account_manager.name,
              companyTierDNoTeam.one_list_group_global_account_manager
                .contact_email
                ? companyTierDNoTeam.one_list_group_global_account_manager
                    .contact_email
                : '-',
            ],
          ],
        })
      })
    }
  )
})
