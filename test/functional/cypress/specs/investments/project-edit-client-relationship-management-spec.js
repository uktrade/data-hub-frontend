import { investmentProjectFaker } from '../../fakers/investment-projects'

const fixtures = require('../../fixtures/index')
const urls = require('../../../../../src/lib/urls')

const {
  assertBreadcrumbs,
  assertTypeaheadHints,
  assertRequestBody,
  assertUrl,
  assertFlashMessage,
  assertErrorSummary,
  assertAPIRequest,
} = require('../../support/assertions')
const {
  clickButton,
  selectFirstMockedTypeaheadOption,
} = require('../../support/actions')

const { investmentWithNoGlobalAccountManager } = fixtures.investment
const investmentWithNoExistingRequirements = investmentProjectFaker({
  investor_company: {
    name: 'Venus Ltd',
    id: '0f5216e0-849f-11e6-ae22-56b6b6499611',
  },
  client_relationship_manager: {
    name: 'Puck Head',
    first_name: 'Puck',
    last_name: 'Head',
    id: 'e83a608e-84a4-11e6-ae22-56b6b6499611',
  },
  strategic_drivers: [],
  client_requirements: null,
  competitor_countries: [],
  uk_region_locations: [],
  site_address_is_company_address: null,
  address_1: null,
  address_2: null,
  address_town: null,
  address_postcode: null,
  actual_uk_regions: [],
  delivery_partners: [],
})
const CLIENT_MANAGEMENT_INTERCEPT = 'clientManagementHttpRequest'

describe('Edit client relationship management page', () => {
  beforeEach(() => {
    cy.intercept('PATCH', '/api-proxy/v3/investment/*', {
      statusCode: 200,
    }).as(CLIENT_MANAGEMENT_INTERCEPT)
  })

  context('When the edit page is first rendered', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v3/investment/${investmentWithNoExistingRequirements.id}`,
        {
          statusCode: 200,
          body: investmentWithNoExistingRequirements,
        }
      ).as('getProjectDetails')
      cy.visit(
        urls.investments.projects.clientRelationshipManagement(
          investmentWithNoExistingRequirements.id
        )
      )
      cy.wait('@getProjectDetails')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        [investmentWithNoExistingRequirements.name]:
          urls.investments.projects.details(
            investmentWithNoExistingRequirements.id
          ),
        'Project team': urls.investments.projects.team(
          investmentWithNoExistingRequirements.id
        ),
        'Client relationship management': undefined,
      })
    })

    it('should render main heading', () => {
      cy.contains('Edit client relationship management')
    })

    it('should render the client relationship manager label and placeholder text', () => {
      assertTypeaheadHints({
        element: '[data-test="field-client_relationship_manager"]',
        label: 'Client Relationship Manager',
        placeholder: 'Search client relationship manager',
      })
    })

    it('should render the global account manager label', () => {
      cy.contains('Global Account Manager')
    })

    it('should render help text label', () => {
      cy.contains('Need to edit the Global Account Manager information?')
    })
  })

  context('When rendering the hidden help text', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v3/investment/${investmentWithNoExistingRequirements.id}`,
        {
          statusCode: 200,
          body: investmentWithNoExistingRequirements,
        }
      ).as('getProjectDetails')
      cy.visit(
        urls.investments.projects.clientRelationshipManagement(
          investmentWithNoExistingRequirements.id
        )
      )
      cy.wait('@getProjectDetails')
    })

    it('should render the hidden help text with visually hidden text for screen reader', () => {
      cy.get('[data-test="global-account-manager-links"]').click()
      cy.contains(
        'If you need to change the Global Account Manager for this company, go to the Intranet (opens in new tab) or opens email client for'
      )
    })

    it('should always have an Intranet link', () => {
      cy.get('[data-test="newWindowLink"]')
        .should('contain', 'Intranet (opens in new tab)')
        .should('have.attr', 'href', urls.external.intranet.accountManagement)
    })
  })

  context('When no edits are made', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v3/investment/${investmentWithNoExistingRequirements.id}`,
        {
          statusCode: 200,
          body: investmentWithNoExistingRequirements,
        }
      ).as('getProjectDetails')
      cy.visit(
        urls.investments.projects.clientRelationshipManagement(
          investmentWithNoExistingRequirements.id
        )
      )
      cy.wait('@getProjectDetails')
    })

    it('should save and redirect with no changes', () => {
      const expectedBody = {
        id: investmentWithNoExistingRequirements.id,
        client_relationship_manager: 'e83a608e-84a4-11e6-ae22-56b6b6499611',
      }

      clickButton('Save')

      assertAPIRequest(CLIENT_MANAGEMENT_INTERCEPT, (xhr) => {
        assertRequestBody(xhr, expectedBody)
        assertUrl(
          urls.investments.projects.team(
            investmentWithNoExistingRequirements.id
          )
        )
        assertFlashMessage('Investment details updated')
      })
    })

    it('should go back and redirect with no changes', () => {
      cy.get('[data-test=cancel-button]').click()
      assertUrl(
        urls.investments.projects.team(investmentWithNoExistingRequirements.id)
      )
    })
  })

  context('When the client relationship manager is deleted', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v3/investment/${investmentWithNoExistingRequirements.id}`,
        {
          statusCode: 200,
          body: investmentWithNoExistingRequirements,
        }
      ).as('getProjectDetails')
      cy.visit(
        urls.investments.projects.clientRelationshipManagement(
          investmentWithNoExistingRequirements.id
        )
      )
      cy.wait('@getProjectDetails')
    })

    it('displays an error message on submission', () => {
      cy.get('[data-test="typeahead-input"]').clear()

      clickButton('Save')
      assertErrorSummary(['Enter a client relationship manager'])
    })
  })

  context('When the client relationship manager is edited', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v3/investment/${investmentWithNoExistingRequirements.id}`,
        {
          statusCode: 200,
          body: investmentWithNoExistingRequirements,
        }
      ).as('getProjectDetails')
      cy.visit(
        urls.investments.projects.clientRelationshipManagement(
          investmentWithNoExistingRequirements.id
        )
      )
      cy.wait('@getProjectDetails')
      selectFirstMockedTypeaheadOption({
        element: '[data-test="field-client_relationship_manager"]',
        input: 'Shawn',
      })
    })

    it('should allow the editing of the client relationship manager', () => {
      cy.get('[data-test="typeahead-input"]').should(
        'have.attr',
        'value',
        'Shawn Cohen, Charles Gilbert'
      )
    })

    it('should submit the changes and redirect with a flash message', () => {
      const expectedBody = {
        id: investmentWithNoExistingRequirements.id,
        client_relationship_manager: '2c42c516-9898-e211-a939-e4115bead28a',
      }

      clickButton('Save')

      assertAPIRequest(CLIENT_MANAGEMENT_INTERCEPT, (xhr) => {
        assertRequestBody(xhr, expectedBody)
        assertUrl(
          urls.investments.projects.team(
            investmentWithNoExistingRequirements.id
          )
        )
        assertFlashMessage('Investment details updated')
      })
    })
  })

  context('When the global account manager is set', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v3/investment/${investmentWithNoExistingRequirements.id}`,
        {
          statusCode: 200,
          body: investmentWithNoExistingRequirements,
        }
      ).as('getProjectDetails')
      cy.visit(
        urls.investments.projects.clientRelationshipManagement(
          investmentWithNoExistingRequirements.id
        )
      )
      cy.wait('@getProjectDetails')
    })

    it('should display the name of the global account manager', () => {
      cy.contains('p', 'Travis Green')
    })
  })

  context('When the global account manager is not set', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.clientRelationshipManagement(
          investmentWithNoGlobalAccountManager.id
        )
      )
    })

    it('should display "not set"', () => {
      cy.contains('p', 'Not set')
    })
  })
})
