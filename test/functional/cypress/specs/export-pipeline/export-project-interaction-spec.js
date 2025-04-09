import fixtures from '../../fixtures'

const urls = require('../../../../../src/lib/urls')
const selectors = require('../../../../selectors')
const {
  assertLocalHeader,
  assertBreadcrumbs,
  assertUrl,
} = require('../../support/assertions')

const companyExportProject = fixtures.export.exportProjectDetails
const queryParams = '&limit=10&offset=0'
const addInteractionUrl = urls.exportPipeline.interactions.create(
  companyExportProject.id
)

describe('Export project interaction collection list', () => {
  context('When export project render with multiple interaction linked', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/interaction?company_export_id=${companyExportProject.id}&sortby=-created_on${queryParams}`
      ).as('apiRequest')
      cy.visit(`/export/${companyExportProject.id}/interactions`)
    })

    it('should display the interactions list', () => {
      cy.get('[data-test="collection-header-name').should(
        'contain',
        '1,233 interactions'
      )
      // should show current and total pages
      cy.contains('Page 1 of 124').should('be.visible')

      // should display 10 interactions per page
      cy.get('[data-test="collection-item"]').should('have.length', 10)

      // should show the pagination
      cy.get('[data-test="pagination"]').should('be.visible')
      cy.get('[data-test="page-number-active"]').should('have.text', '1')
      cy.get('[data-test="page-number"]').should('contain', '124')
      cy.get('[data-test="next"]').should('have.text', 'Next page')
    })

    it('should render the Add Interaction button', () => {
      cy.get('[data-test=add-collection-item-button]')
        .should('exist')
        .should('have.text', 'Add interaction')
        .should('have.attr', 'href', addInteractionUrl)
    })
  })
})

describe('Export interaction collections filters "Sort by"', () => {
  context('Sort by filters with default "Recently created"', () => {
    const element = '[data-test="sortby"] select'

    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/interaction?company_export_id=${companyExportProject.id}&sortby=-created_on${queryParams}`
      ).as('apiRequest')
      cy.visit(`/export/${companyExportProject.id}/interactions`)
    })

    it('should render "Sort by" label', () => {
      cy.get('[data-test="sortby"]').should('contain', 'Sort by')
    })

    it('should have all sort by options', () => {
      cy.get('[data-test="sortby"] option').then((options) => {
        const sortOptions = [...options].map((o) => ({
          value: o.value,
          name: o.label,
        }))
        expect(sortOptions).to.deep.eq([
          { value: '-created_on', name: 'Recently created' },
          { value: 'company__name', name: 'Company name A-Z' },
          { value: 'subject', name: 'Subject A-Z' },
        ])
      })
    })

    it('should sort by "Company name A-Z"', () => {
      cy.get(element).select('Company name A-Z')
      assertUrl('sortby=company__name')
    })

    it('should sort by "Subject A-Z"', () => {
      cy.get(element).select('Subject A-Z')
      assertUrl('sortby=subject')
    })
  })
})

describe('Export project interaction collection', () => {
  context('When Add interaction button is clicked', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/interaction?company_export_id=${companyExportProject.id}&sortby=-created_on${queryParams}`
      ).as('apiRequest')
      cy.visit(`/export/${companyExportProject.id}/interactions`)
      cy.get('[data-test=add-collection-item-button]').click()
    })
    it('should take us to create export interaction page', () => {
      cy.location('pathname').should('eq', addInteractionUrl)
    })
  })
})

describe('Create Export project interaction', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      `/api-proxy/v4/interaction?company_export_id=${companyExportProject.id}&sortby=-created_on${queryParams}`
    ).as('apiRequest')
    cy.intercept('POST', '/api-proxy/v4/interaction').as('addInteraction')
    cy.visit(addInteractionUrl)
  })

  context('should render add export interaction form', () => {
    it('should render the header', () => {
      cy.get('[data-test="localHeaderPreHeading"]>a')
        .should('have.text', companyExportProject.company.name)
        .and(
          'have.attr',
          'href',
          urls.companies.detail(companyExportProject.company.id)
        )
      assertLocalHeader(
        `${companyExportProject.title} to ${companyExportProject.destination_country.name}`
      )
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.exportPipeline.index(),
        [companyExportProject.title]: urls.exportPipeline.details(
          companyExportProject.id
        ),
        Interactions: urls.exportPipeline.interactions.index(
          companyExportProject.id
        ),
        'Add interaction': null,
      })
    })

    it('should offer selection of interaction or service delivery only', () => {
      cy.get('[data-test="field-theme"]')
        .should('contain', 'What is this regarding?')
        .should('contain', 'Export')
        .should('not.contain', 'Investment')
      cy.get('[data-test="field-kind"]').should(
        'contain',
        'What would you like to record?'
      )
    })

    it('should continue to second page and add interaction', () => {
      cy.get('[data-test="export-kind-a-standard-interaction"').click()
      cy.get('[data-test="continue"]').click()
      const subject = 'The best Investment Project interaction'
      const formSelectors = selectors.interactionForm

      cy.get(formSelectors.service)
        .select('Export win')
        .get(formSelectors.contact)
        .selectTypeaheadOption('Johnny Cakeman')
        .get(formSelectors.communicationChannel)
        .selectTypeaheadOption('Email/Website')
        .get(formSelectors.subject)
        .type(subject)
        .get(formSelectors.notes)
        .type('Conversation about Investment services')
        .get(formSelectors.policyFeedbackNo)
        .click()
        .get(formSelectors.add)
        .click()
        .wait('@addInteraction')
        .then(({ request: { body }, response }) => {
          expect(body).to.include({
            kind: 'interaction',
            theme: 'export',
            company_export: 'f5bc555e-0eba-4a7e-abe9-db89a78afc5c',
          })
          expect(response.statusCode).to.eql(201)
        })
    })
  })
})
