const minimallyMinimal = require('../../../../sandbox/fixtures/v4/company/company-minimally-minimal.json')
const lambdaPlc = require('../../../../sandbox/fixtures/v4/company/company-lambda-plc')
const urls = require('../../../../../src/lib/urls')
const {
  assertFieldRadios,
  assertBreadcrumbs,
  assertFormButtons,
  assertFieldInput,
} = require('../../support/assertions')
const selectors = require('../../../../selectors')

describe('Company add to pipeline form', () => {
  context('When a company is not already on the pipeline', () => {
    before(() => {
      cy.visit(urls.companies.pipelineAdd(minimallyMinimal.id))
    })

    it('should render the breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        Companies: urls.companies.index(),
        [minimallyMinimal.name]: urls.companies.detail(minimallyMinimal.id),
        'Add to your pipeline': null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should(
        'have.text',
        `Add ${minimallyMinimal.name} to your pipeline`
      )
    })

    it('should render the project name text input', () => {
      cy.get('#field-name').then((element) => {
        assertFieldInput({
          element,
          label: 'Project name',
          optionsCount: 3,
        })
      })
    })

    it('should render the status radio buttons', () => {
      cy.get('#field-category').then((element) => {
        assertFieldRadios({
          element,
          label: 'Choose a status',
          optionsCount: 3,
        })
      })
    })

    it('should render the form buttons', () => {
      assertFormButtons({
        submitText: 'Add',
        cancelText: 'Cancel',
        cancelLink: urls.companies.detail(minimallyMinimal.id),
      })
    })
  })

  context('When the company is already on the pipeline', () => {
    before(() => {
      cy.visit(urls.companies.pipelineAdd(lambdaPlc.id))
    })

    it('should render the breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard.route,
        Companies: urls.companies.index(),
        [lambdaPlc.name]: urls.companies.detail(lambdaPlc.id),
        'Add to your pipeline': null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should(
        'have.text',
        `Add ${lambdaPlc.name} to your pipeline`
      )
    })

    it('should render a message', () => {
      cy.contains(
        'This company is already in your pipeline.You can add it again under another project name.'
      )
    })

    it('should render the project name text input', () => {
      cy.get('#field-name').then((element) => {
        assertFieldInput({
          element,
          label: 'Project name',
          optionsCount: 3,
        })
      })
    })

    it('should render the status radio buttons', () => {
      cy.get('#field-category').then((element) => {
        assertFieldRadios({
          element,
          label: 'Choose a status',
          optionsCount: 3,
        })
      })
    })
  })
  context('when form is submitted to add a company to pipeline', () => {
    beforeEach(() => {
      cy.visit(urls.companies.pipelineAdd(minimallyMinimal.id))
    })

    it('should render the status radio buttons', () => {
      cy.get('#field-category').then((element) => {
        assertFieldRadios({
          element,
          label: 'Choose a status',
          optionsCount: 3,
        })
      })
    })

    it('should render the project name text input', () => {
      cy.get('#field-name').then((element) => {
        assertFieldInput({
          element,
          label: 'Project name',
          optionsCount: 3,
        })
      })
    })

    it('should redirect to dashboard with a flash message', () => {
      cy.get('#field-name')
        .find('input')
        .type('Test Project')
      cy.get('input[value=win').click()
      cy.contains('button', 'Add').click()
      cy.url().should('include', urls.dashboard())
      cy.get(selectors.localHeader().flash).should(
        'contain',
        'Pipeline changes for this company have been saved'
      )
    })
  })

  context('when form is submitted without any input', () => {
    beforeEach(() => {
      cy.visit(urls.companies.pipelineAdd(minimallyMinimal.id))
    })

    it('should display error messages', () => {
      cy.contains('button', 'Add').click()
      cy.contains('Enter a Project name')
      cy.contains('Choose a status')
    })
  })
})
