import { faker } from '@faker-js/faker'
import { companyFaker } from '../../fakers/companies'
import { userFaker } from '../../fakers/users'
import { format } from 'date-fns'
import objectiveListFaker, { objectiveFaker } from '../../fakers/objective'

const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const companyId = fixtures.company.allActivitiesCompany.id

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

const assertBreadcrumbs = (company) => {
  it('should render breadcrumbs', () => {
    assertBreadcrumbs({
      Home: urls.dashboard.index(),
      Companies: urls.companies.index(),
      [company.name]: urls.companies.detail(company.id),
      'Account management': null,
    })
  })
}

describe('Company account management', () => {
  const companyWithStrategy = companyFaker({
    strategy: 'ABC',
    id: companyId,
    modifiedBy: userFaker(),
    modifiedOn: faker.date.past(),
  })

  const noBlockersObjective = objectiveFaker({ has_blocker: false })
  const objectives = objectiveListFaker((length = 3))

  context('When visiting the account management page with a strategy', () => {
    before(() => {
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
          `Last updated by ${companyWithStrategy.modifiedBy.name}: ${format(
            companyWithStrategy.modifiedOn,
            'dd MMM yyyy'
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
      before(() => {
        cy.intercept(
          'GET',
          `/api-proxy/v4/company/${companyId}`,
          companyFaker({ strategy: undefined, id: companyId })
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
      before(() => {
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
    before(() => {
      cy.intercept('GET', `/api-proxy/v4/company/${companyId}/objective**`, {
        results: [...objectives, noBlockersObjective],
      }).as('objectiveApi')
      cy.visit(urls.companies.accountManagement.index(companyId))
      cy.wait('@objectiveApi')
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
})

describe('One List core team', () => {
  context('when viewing a One List Tier company', () => {
    before(() => {
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
      assertTable({
        element: '[data-test="global-acc-manager-table"]',
        rows: [
          ['Team', 'Location', 'Global Account Manager'],
          [
            globalAccountManager.dit_team.name,
            globalAccountManager.dit_team.uk_region.name,
            globalAccountManager.name,
          ],
        ],
      })
    })

    it('should render the advisers table', () => {
      assertTable({
        element: '[data-test="advisers-table"]',
        rows: [
          ['Team', 'Location', 'Adviser on core team'],
          ['Heart of the South West LEP', 'United Kingdom', 'Holly Collins'],
          [
            'IG - Specialists - Knowledge Intensive Industry',
            'London',
            'Jenny Carey',
          ],
        ],
      })
    })

    it('should render the details section', () => {
      cy.get('[data-test=core-team-details]')
        .click()
        .should('exist')
        .contains(
          'Need to find out more, or edit the One List tier information?For more information, or if you need to change the One List tier or account management team for this company, go to the Digital Workspace (opens in a new window or tab) or email'
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
      assertTable({
        element: '[data-test="global-acc-manager-table"]',
        rows: [
          ['Team', 'Location', 'Global Account Manager'],
          [
            globalAccountManager.dit_team.name,
            globalAccountManager.dit_team.uk_region.name,
            globalAccountManager.name,
          ],
        ],
      })
      cy.get('[data-test=advisers-table]').should('not.exist')
    })
  })
})
