const urls = require('../../../../../src/lib/urls')
const selectors = require('../../../../selectors')
const { assertBreadcrumbs } = require('../../support/assertions')
const archived = require('../../../../sandbox/fixtures/v4/pipeline-item/archived.json')
const { assertProjectDetails } = require('../../support/pipeline-assertions')

function assertHeader() {
  it('should render the breadcrumbs', () => {
    assertBreadcrumbs({
      Home: urls.dashboard(),
      'My Pipeline': urls.pipeline.index(),
      'Unarchive project': null,
    })
  })

  it('should render the heading', () => {
    cy.get(selectors.localHeader().heading).should(
      'have.text',
      `Unarchive project`
    )
  })
}

function assertForm() {
  it('Should render form actions', () => {
    cy.contains('button', 'Unarchive project')
    cy.contains('a', 'Cancel')
  })
}

describe('Unarchive pipeline item form', () => {
  context('When the pipeline item id is incorrect', () => {
    before(() => {
      cy.visit(urls.pipeline.unarchive('INCORRECT-PIPELINE-ID'))
    })

    assertHeader()

    it('should render a 404 error message', () => {
      cy.contains('There is a problem')
      cy.contains('Request failed with status code 404')
    })
  })

  context('With a valid id', () => {
    before(() => {
      cy.visit(urls.pipeline.unarchive('ARCHIVED'))
    })

    assertHeader()
    assertProjectDetails(archived)
    assertForm()

    it('Should have some introductory text', () => {
      cy.contains(
        'Unarchiving this project will restore these project details in your pipeline.'
      )
    })
  })

  context(
    'When the form is submitted successfully it redirects to the correct tab with a success message',
    () => {
      function unarchiveItem(itemId) {
        cy.visit(urls.pipeline.unarchive(itemId))
        cy.contains('button', 'Unarchive project').click()
      }

      it('should redirect to the prospect tab in my pipeline', () => {
        unarchiveItem('LEADS')
        cy.url().should('include', urls.pipeline.index())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'You unarchived TEST'
        )
      })

      it('should redirect to the active tab in my pipeline', () => {
        unarchiveItem('IN_PROGRESS')
        cy.url().should('include', urls.pipeline.active())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'You unarchived TEST'
        )
      })

      it('should redirect to the won tab in my pipeline', () => {
        unarchiveItem('WIN')
        cy.url().should('include', urls.pipeline.won())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'You unarchived TEST'
        )
      })
    }
  )

  context('When cancelling it should link to the pipeline category', () => {
    it('should redirect to the prospect tab in my pipeline', () => {
      cy.visit(urls.pipeline.unarchive('LEADS'))
      cy.contains('a', 'Cancel').should(
        'have.attr',
        'href',
        urls.pipeline.index()
      )
      cy.contains('a', 'Cancel').click()
      cy.url().should('include', urls.pipeline.index())
    })

    it('should redirect to the active tab in my pipeline', () => {
      cy.visit(urls.pipeline.unarchive('IN_PROGRESS'))
      cy.contains('a', 'Cancel').should(
        'have.attr',
        'href',
        urls.pipeline.active()
      )
      cy.contains('a', 'Cancel').click()
      cy.url().should('include', urls.pipeline.active())
    })

    it('should redirect to the won tab in my pipeline', () => {
      cy.visit(urls.pipeline.unarchive('WIN'))
      cy.contains('a', 'Cancel').should(
        'have.attr',
        'href',
        urls.pipeline.won()
      )
      cy.contains('a', 'Cancel').click()
      cy.url().should('include', urls.pipeline.won())
    })
  })
})
