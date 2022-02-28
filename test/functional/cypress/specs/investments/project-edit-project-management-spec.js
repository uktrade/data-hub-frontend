const {
  assertLocalHeader,
  assertBreadcrumbs,
  assertKeyValueTable,
  assertTypeaheadHints,
  assertRequestBody,
  assertFlashMessage,
  assertSingleTypeaheadOptionSelected,
} = require('../../support/assertions')

const {
  selectFirstAdvisersTypeaheadOption,
  clickButton,
} = require('../../support/actions')

const incompleteProject = require('../../fixtures/investment/investment-no-management-staff.json')
const completeProject = require('../../fixtures/investment/investment-has-management-staff.json')
const { investments } = require('../../../../../src/lib/urls')

describe('Edit the management advisers for a project', () => {
  beforeEach(() => {
    cy.intercept('PATCH', '/api-proxy/v3/investment/*').as(
      'investmentsHttpRequest'
    )
  })
  context(
    'When editing an incomplete project with no project management staff',
    () => {
      beforeEach(() => {
        cy.visit(
          investments.projects.editProjectManagement(incompleteProject.id)
        )
      })

      it('should render the header', () => {
        assertLocalHeader(incompleteProject.name)
      })
      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: '/',
          Investments: investments.index(),
          Projects: investments.projects.index(),
          [incompleteProject.name]: null,
        })
      })
      it('should render the subheading', () => {
        cy.contains('Assign project management').should('exist')
      })
      it('should render the summary table', () => {
        assertKeyValueTable('briefProjectSummary', {
          'Primary sector': incompleteProject.sector.name,
          'Client company': incompleteProject.investor_company.name,
          Website: '',
          'Account tier': 'None',
          'Possible UK locations': '',
          'Competitor countries': '',
          'Estimated land date': 'January 2020',
          'Total investment': '',
        })
      })
      it('should render the two typeaheads', () => {
        assertTypeaheadHints({
          element: '#field-project_assurance_adviser',
          label: 'Project Assurance Adviser',
          placeholder: 'Select an adviser',
        })

        assertTypeaheadHints({
          element: '#field-project_manager',
          label: 'Project Manager',
          placeholder: 'Select a manager',
        })
      })
      it('should submit the form with only assurance typeahead filled in and redirect to the project details page', () => {
        const expectedBody = {
          project_assurance_adviser: '2c42c516-9898-e211-a939-e4115bead28a',
          project_manager: null,
        }
        selectFirstAdvisersTypeaheadOption({
          element: '#field-project_assurance_adviser',
          input: 'shawn',
        })
        clickButton('Save')

        assertAPI((xhr) => {
          assertRequestBody(xhr, expectedBody)
        })

        assertFlashMessage('Investment details updated')
      })

      it('should submit the form with only PM typeahead filled in and redirect', () => {
        const expectedBody = {
          project_assurance_adviser: null,
          project_manager: '2c42c516-9898-e211-a939-e4115bead28a',
        }
        selectFirstAdvisersTypeaheadOption({
          element: '#field-project_manager',
          input: 'shawn',
        })
        clickButton('Save')

        assertAPI((xhr) => {
          assertRequestBody(xhr, expectedBody)
        })

        assertFlashMessage('Investment details updated')
      })

      it('should submit the form with both typeaheads filled in and redirect', () => {
        const expectedBody = {
          project_assurance_adviser: '8242c516-9898-e211-a939-e4115bead28a',
          project_manager: '2c42c516-9898-e211-a939-e4115bead28a',
        }

        selectFirstAdvisersTypeaheadOption({
          element: '#field-project_assurance_adviser',
          input: 'blake',
        })

        selectFirstAdvisersTypeaheadOption({
          element: '#field-project_manager',
          input: 'shawn',
        })
        clickButton('Save')

        assertAPI((xhr) => {
          assertRequestBody(xhr, expectedBody)
        })

        assertFlashMessage('Investment details updated')
      })
    }
  )
  context(
    'When editing a complete project with project management staff',
    () => {
      beforeEach(() => {
        cy.visit(investments.projects.editProjectManagement(completeProject.id))
      })
      it('should render the header', () => {
        assertLocalHeader(completeProject.name)
      })
      it('should render breadcrumbs', () => {
        assertBreadcrumbs({
          Home: '/',
          Investments: investments.index(),
          Projects: investments.projects.index(),
          [completeProject.name]: null,
        })
      })
      it('should render the subheading', () => {
        cy.contains('Assign project management').should('exist')
      })
      it('should render the summary table', () => {
        assertKeyValueTable('briefProjectSummary', {
          'Primary sector': completeProject.sector.name,
          'Client company': completeProject.investor_company.name,
          Website: '',
          'Account tier': 'None',
          'Possible UK locations': '',
          'Competitor countries': '',
          'Estimated land date': 'January 2020',
          'Total investment': '',
        })
      })
      it('should render the two typeaheads with the initial values', () => {
        assertSingleTypeaheadOptionSelected({
          element: '#field-project_assurance_adviser',
          label: 'Project Assurance Adviser',
          expectedOption: completeProject.project_assurance_adviser.name,
        })

        assertSingleTypeaheadOptionSelected({
          element: '#field-project_manager',
          label: 'Project Manager',
          expectedOption: completeProject.project_manager.name,
        })
      })
    }
  )
})

function assertAPI(validateCallback) {
  cy.wait('@investmentsHttpRequest').then((xhr) => validateCallback(xhr))
}
