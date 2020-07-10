const minimallyMinimal = require('../../../../sandbox/fixtures/v4/company/company-minimally-minimal.json')
const lambdaPlc = require('../../../../sandbox/fixtures/v4/company/company-lambda-plc.json')
const urls = require('../../../../../src/lib/urls')
const {
  assertFieldRadios,
  assertBreadcrumbs,
  assertFormButtons,
  assertFieldInput,
  assertFieldTypeahead,
  assertFieldDateShort,
} = require('../../support/assertions')
const selectors = require('../../../../selectors')

const formSelectors = selectors.pipelineForm

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
      cy.get(formSelectors.fields.name).then((element) => {
        assertFieldInput({
          element,
          label: 'Project name',
        })
      })
    })

    it('should render the status radio buttons', () => {
      cy.get(formSelectors.fields.status).then((element) => {
        assertFieldRadios({
          element,
          label: 'Choose a status',
          optionsCount: 3,
        })
      })
    })

    it('Should render the likelihood to export radio buttons', () => {
      cy.get(formSelectors.fields.likelihood).then((element) => {
        assertFieldRadios({
          element,
          label: 'Likelihood to export (optional)',
          optionsCount: 3,
        })
      })
    })

    it('Should render the export sector typeahead', () => {
      cy.get(formSelectors.fields.sector).then((element) => {
        assertFieldTypeahead({ element, label: 'Export sector (optional)' })
      })
    })

    it('Should render the company contacts typeahead', () => {
      cy.get(formSelectors.fields.contacts).then((element) => {
        assertFieldTypeahead({ element, label: 'Company contacts (optional)' })
      })
    })

    it('Should render the potential export value input', () => {
      cy.get(formSelectors.fields.value).then((element) => {
        assertFieldInput({
          element,
          label: 'Potential export value (optional)',
          hint: 'Amount in GBP',
        })
      })
    })

    it('Should render the expected date for win input', () => {
      cy.get(formSelectors.fields.expectedWinDate).then((element) => {
        assertFieldDateShort({
          element,
          label: 'Expected date for win (optional)',
          hint: 'For example 11 2020',
        })
      })
    })

    it('should render the form buttons', () => {
      assertFormButtons({
        submitText: 'Create project',
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
      cy.get(formSelectors.fields.name).then((element) => {
        assertFieldInput({
          element,
          label: 'Project name',
        })
      })
    })

    it('should render the status radio buttons', () => {
      cy.get(formSelectors.fields.status).then((element) => {
        assertFieldRadios({
          element,
          label: 'Choose a status',
          optionsCount: 3,
        })
      })
    })
  })

  context(
    'when form is submitted it redirects to the correct tab with a success message',
    () => {
      beforeEach(() => {
        cy.visit(urls.companies.pipelineAdd(minimallyMinimal.id))
      })

      it('should redirect to the prospect tab in my pipeline', () => {
        cy.get(formSelectors.name).type('Test Project')
        cy.get(formSelectors.status.prospect).click()
        cy.contains('button', 'Create project').click()
        cy.url().should('include', urls.pipeline.index())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'You added Test Project to your pipeline'
        )
      })

      it('should redirect to the active tab in my pipeline', () => {
        cy.get(formSelectors.name).type('Test Project')
        cy.get(formSelectors.status.active).click()
        cy.contains('button', 'Create project').click()
        cy.url().should('include', urls.pipeline.active())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'You added Test Project to your pipeline'
        )
      })

      it('should redirect to the won tab in my pipeline', () => {
        cy.get(formSelectors.name).type('Test Project')
        cy.get(formSelectors.status.won).click()
        cy.contains('button', 'Create project').click()
        cy.url().should('include', urls.pipeline.won())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'You added Test Project to your pipeline'
        )
      })
    }
  )

  context('when form is submitted without any input', () => {
    beforeEach(() => {
      cy.visit(urls.companies.pipelineAdd(minimallyMinimal.id))
    })

    it('should display error messages', () => {
      cy.contains('button', 'Create project').click()
      cy.contains('Enter a Project name')
      cy.contains('Choose a status')
    })
  })

  context('Potential export value validation', () => {
    beforeEach(() => {
      cy.visit(urls.companies.pipelineAdd(minimallyMinimal.id))
      cy.contains('Potential export value')
    })

    function checkError(value, assertion = 'contain') {
      cy.get(formSelectors.value).type(value)
      cy.contains('button', 'Create project').click()
      cy.get('#form-errors').should(
        assertion,
        'Potential export value must be a number'
      )
    }

    context('With only numbers', () => {
      it('Should not show an error', () => {
        checkError('123456', 'not.contain')
      })
    })

    context('When the form is submitted with a non numeric value', () => {
      context('With characters', () => {
        it('Should show an error', () => {
          checkError('ABC')
        })
      })

      context('With a £ sign and commas in the number', () => {
        it('Should show an error', () => {
          checkError('£1,000')
        })
      })
    })
  })

  context('Company contacts', () => {
    before(() => {
      cy.visit(urls.companies.pipelineAdd(lambdaPlc.id))
    })

    it('Should allow more than one contact to be selected', () => {
      cy.get(formSelectors.fields.contacts)
        .selectTypeaheadOption('Dean')
        .selectTypeaheadOption('Georg')
        .getTypeaheadValues()
        .should('contain', 'Georgina Clark')
        .should('contain', 'Dean Cox')
    })
  })
})
