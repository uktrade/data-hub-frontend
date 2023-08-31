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

const {
  investmentWithNoExistingRequirements,
  investmentWithNoGlobalAccountManager,
} = fixtures.investment
const CLIENT_MANAGEMENT_INTERCEPT = 'clientManagementHttpRequest'

describe('Edit client relationship management page', () => {
  beforeEach(() => {
    cy.intercept('PATCH', '/api-proxy/v3/investment/*', {
      statusCode: 200,
    }).as(CLIENT_MANAGEMENT_INTERCEPT)
  })

  context('When the edit page is first rendered', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.clientRelationshipManagement(
          investmentWithNoExistingRequirements.id
        )
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.index(),
        Investments: urls.investments.index(),
        Projects: urls.investments.projects.index(),
        [investmentWithNoExistingRequirements.name]: `/investments/projects/${investmentWithNoExistingRequirements.id}`,
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
    before(() => {
      cy.visit(
        urls.investments.projects.clientRelationshipManagement(
          investmentWithNoExistingRequirements.id
        )
      )
    })

    it('should render the hidden help text with visually hidden text for screen reader', () => {
      cy.get('[data-test="global-account-manager-links"]').click()
      cy.contains(
        `If you need to change the Global Account Manager for this company, go to the Digital Workspace (opens in new tab) or opens email client for ${Cypress.env(
          'one_list_email'
        )}.`
      )
    })

    it('should always have a Digital Workspace link', () => {
      cy.get('[data-test="newWindowLink"]')
        .should('contain', 'Digital Workspace (opens in new tab)')
        .should(
          'have.attr',
          'href',
          urls.external.digitalWorkspace.accountManagement
        )
    })
  })

  context('When no edits are made', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.clientRelationshipManagement(
          investmentWithNoExistingRequirements.id
        )
      )
    })

    it('should save and redirect with no changes', () => {
      const expectedBody = {
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
    before(() => {
      cy.visit(
        urls.investments.projects.clientRelationshipManagement(
          investmentWithNoExistingRequirements.id
        )
      )
    })

    it('displays an error message on submission', () => {
      cy.get('[data-test="typeahead-input"]').clear()

      clickButton('Save')
      assertErrorSummary(['Enter a client relationship manager'])
    })
  })

  context('When the client relationship manager is edited', () => {
    before(() => {
      cy.visit(
        urls.investments.projects.clientRelationshipManagement(
          investmentWithNoExistingRequirements.id
        )
      )
    })

    it('should allow the editing of the client relationship manager', () => {
      selectFirstMockedTypeaheadOption({
        element: '[data-test="field-client_relationship_manager"]',
        input: 'Shawn',
      })

      cy.get('[data-test="typeahead-input"]').should(
        'have.attr',
        'value',
        'Shawn Cohen, Charles Gilbert'
      )
    })

    it('should submit the changes and redirect with a flash message', () => {
      const expectedBody = {
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
    before(() => {
      cy.visit(
        urls.investments.projects.clientRelationshipManagement(
          investmentWithNoExistingRequirements.id
        )
      )
    })

    it('should display the name of the global account manager', () => {
      cy.contains('p', 'Travis Green')
    })
  })

  context('When the global account manager is not set', () => {
    before(() => {
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
