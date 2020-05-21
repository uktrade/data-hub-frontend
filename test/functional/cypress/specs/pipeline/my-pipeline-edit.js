const pipelineItemLambdaPlc = require('../../../../sandbox/fixtures/v4/pipeline-item/pipeline-item-lambda-plc.json')
const urls = require('../../../../../src/lib/urls')
const {
  assertFieldRadios,
  assertBreadcrumbs,
  assertFieldInput,
} = require('../../support/assertions')

const selectors = require('../../../../selectors')

const pipelineItem = pipelineItemLambdaPlc.results[0]

describe('Pipeline edit form', () => {
  context('When pipeline id is incorrect', () => {
    before(() => {
      cy.visit(urls.pipeline.edit('INCORRECT_PIPELINE'))
    })

    it('should render the breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        'My Pipeline': urls.pipeline.index(),
        'Edit your pipeline': null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should(
        'have.text',
        `Edit your pipeline`
      )
    })

    it('should render 404 error message', () => {
      cy.contains('There is a problem')
      cy.contains('Request failed with status code 404')
    })
  })

  context('When editing a pipeline item', () => {
    before(() => {
      cy.visit(urls.pipeline.edit(pipelineItem.id))
    })

    it('should render the breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        'My Pipeline': urls.pipeline.index(),
        'Edit your pipeline': null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should(
        'have.text',
        `Edit your pipeline`
      )
    })

    it('should render the project name text input', () => {
      cy.get('#field-name').then((element) => {
        assertFieldInput({
          element,
          label: 'Project name',
          value: pipelineItem.name,
        })
      })
    })

    it('should render the status radio buttons', () => {
      cy.get('#field-category').then((element) => {
        assertFieldRadios({
          element,
          label: 'Choose a status',
          optionsCount: 3,
          value: 'In progress',
        })
      })
    })
  })

  context(
    'when form is submitted it redirects to the correct tab with a success message',
    () => {
      beforeEach(() => {
        cy.visit(urls.pipeline.edit(pipelineItem.id))
      })

      it('should redirect to the prospect tab in my pipeline', () => {
        cy.get('input[value=leads').click()
        cy.contains('button', 'Update').click()
        cy.url().should('include', urls.pipeline.index())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'Pipeline changes for this company have been saved'
        )
      })

      it('should redirect to the active tab in my pipeline', () => {
        cy.get('input[value=in_progress').click()
        cy.contains('button', 'Update').click()
        cy.url().should('include', urls.pipeline.active())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'Pipeline changes for this company have been saved'
        )
      })

      it('should redirect to the won tab in my pipeline', () => {
        cy.get('input[value=win').click()
        cy.contains('button', 'Update').click()
        cy.url().should('include', urls.pipeline.won())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'Pipeline changes for this company have been saved'
        )
      })
    }
  )
})
