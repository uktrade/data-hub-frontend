const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')
const {
  assertUrl,
  assertExactUrl,
  assertFlashMessage,
  assertPayload,
  assertFieldTypeahead,
  assertFieldError,
} = require('../../support/assertions')

const {
  assertLocalHeader,
  assertBreadcrumbs,
} = require('../../support/assertions')
const {
  ERROR_MESSAGES,
} = require('../../../../../src/client/modules/ExportPipeline/ExportForm/constants')
const {
  generateExport,
} = require('../../../../sandbox/routes/v4/export/exports')
const {
  fillTypeahead,
  fillMultiOptionTypeahead,
  clearTypeahead,
} = require('../../support/form-fillers')
const autoCompleteAdvisers =
  require('../../../../sandbox/fixtures/autocomplete-adviser-list.json').results
const { faker } = require('@faker-js/faker')

describe('Export pipeline create', () => {
  context('when adding an export for unknown company id', () => {
    before(() => {
      cy.intercept('GET', '/api-proxy/v4/company/not_real', {
        statusCode: 404,
      }).as('getServerFailure')
      cy.visit('/export/create?companyId=not_real')
    })

    it('should render the header', () => {
      assertLocalHeader('Add export')
      cy.get('[data-test="subheading"]').should('not.exist')
    })

    it('should render add event breadcrumb', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        'Add export': null,
      })
    })

    it('should render the error message', () => {
      cy.get('[data-test="error-dialog"]').should('be.visible')
    })
  })

  context('when adding an export for known company id', () => {
    const company = fixtures.company.venusLtd
    const addPageUrl = `/export/create?companyId=${company.id}`

    context('when verifying the page', () => {
      before(() => {
        cy.visit(addPageUrl)
      })

      it('should render the header', () => {
        assertLocalHeader('Add export')
        cy.get('[data-test="subheading"]').should('have.text', company.name)
      })

      it('should render the add export breadcrumb', () => {
        assertBreadcrumbs({
          Home: urls.dashboard(),
          Companies: urls.companies.index(),
          [company.name]: urls.companies.activity.index(company.id),
          'Add export': null,
        })
      })

      it('should render a form with display a save button', () => {
        cy.get('[data-test=submit-button]').should('have.text', 'Save')
      })

      it('should render a form with a cancel link', () => {
        cy.get('[data-test=cancel-button]')
          .should('have.text', 'Cancel')
          .should(
            'have.attr',
            'href',
            urls.companies.activity.index(company.id)
          )
      })

      it('should render a form with the default values set', () => {
        cy.get('[data-test="field-owner"]').then((element) => {
          assertFieldTypeahead({
            element,
            label: 'Owner',
            value: 'DBT Staff',
            isMulti: false,
          })
        })
      })
    })

    context('when the form cancel button is clicked', () => {
      before(() => {
        cy.visit(addPageUrl)
      })

      it('the form should redirect to the company page', () => {
        cy.get('[data-test=cancel-button]').click()
        assertUrl(urls.companies.activity.index(company.id))
      })
    })

    context('when the form contains invalid data and is submitted', () => {
      before(() => {
        cy.visit(addPageUrl)
      })

      it('the form should display validation error message for mandatory inputs', () => {
        //clear any default values first
        cy.get('[data-test="typeahead-input"]').clear()
        clearTypeahead('[data-test=field-destination_country]')

        cy.get('[data-test=submit-button]').click()

        assertFieldError(
          cy.get('[data-test="field-title"]'),
          ERROR_MESSAGES.title
        )
        assertFieldError(
          cy.get('[data-test="field-owner"]'),
          ERROR_MESSAGES.owner
        )
        assertFieldError(
          cy.get('[data-test="field-destination_country"]'),
          ERROR_MESSAGES.destination_country,
          false
        )
      })

      it('the form should display validation error message for too many team members', () => {
        const advisers = faker.helpers.arrayElements(autoCompleteAdvisers, 6)
        fillMultiOptionTypeahead(
          '[data-test=field-team_members]',
          advisers.map((adviser) => adviser.name)
        )
        cy.get('[data-test=submit-button]').click()

        assertFieldError(
          cy.get('[data-test="field-team_members"]'),
          ERROR_MESSAGES.team_members
        )
      })
    })

    context(
      'when the form contains valid data and the form is submitted',
      () => {
        before(() => {
          cy.intercept('POST', `/api-proxy/v4/export`).as(
            'postExportItemApiRequest'
          )
          cy.visit(addPageUrl)
        })

        it('the form should redirect to the dashboard page and display a success message', () => {
          const newExport = generateExport()
          const teamMember = faker.helpers.arrayElement(autoCompleteAdvisers)

          cy.get('[data-test=title-input]').type(newExport.title)
          fillTypeahead('[data-test=field-team_members]', teamMember.name)
          fillTypeahead(
            '[data-test=field-destination_country]',
            newExport.destination_country.name
          )

          cy.get('[data-test=submit-button]').click()

          assertPayload('@postExportItemApiRequest', {
            title: newExport.title,
            owner: '7d19d407-9aec-4d06-b190-d3f404627f21',
            team_members: [teamMember.id],
            company: company.id,
            destination_country: newExport.destination_country.id,
            notes: newExport.notes,
          })

          assertExactUrl('')
          assertFlashMessage(`'${newExport.title}' created`)
        })
      }
    )
  })
})
