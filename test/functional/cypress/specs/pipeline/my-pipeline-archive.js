const pipelineItemLambdaPlc = require('../../../../sandbox/fixtures/v4/pipeline-item/pipeline-item-lambda-plc.json')
const urls = require('../../../../../src/lib/urls')
const selectors = require('../../../../selectors')
const {
  assertFieldTextarea,
  assertBreadcrumbs,
} = require('../../support/assertions')
const { assertProjectDetails } = require('../../support/pipeline-assertions')

const [firstItem, secondItem] = pipelineItemLambdaPlc.results

const formSelectors = {
  reason: '#field-reason',
}

function assertHeader() {
  it('should render the breadcrumbs', () => {
    assertBreadcrumbs({
      Home: urls.dashboard(),
      'My Pipeline': urls.pipeline.index(),
      'Archive project': null,
    })
  })

  it('should render the heading', () => {
    cy.get(selectors.localHeader().heading).should(
      'have.text',
      `Archive project`
    )
  })
}

function assertForm() {
  it('Should render the reason for achive textarea', () => {
    cy.get(formSelectors.reason).then((element) => {
      assertFieldTextarea({
        element,
        label: 'Reason for archive',
        hint: 'Details on why you are archiving this project',
      })
    })
  })

  it('Should render form actions', () => {
    cy.contains('button', 'Archive project')
    cy.contains('a', 'Cancel')
  })
}

describe('Archive pipeline item form', () => {
  context('When the pipeline item id is incorrect', () => {
    before(() => {
      cy.visit(urls.pipeline.archive('INCORRECT-PIPELINE-ID'))
    })

    assertHeader()

    it('should render a 404 error message', () => {
      cy.contains('There is a problem')
      cy.contains('Request failed with status code 404')
    })
  })

  context('When submitting the form without a reason', () => {
    before(() => {
      cy.visit(urls.pipeline.archive(firstItem.id))
    })

    assertHeader()
    assertForm()

    it('Should show a validation error', () => {
      cy.contains('button', 'Archive project').click()
      cy.contains('Enter the reason why you are archiving this project')
    })
  })

  context('When archiving a pipeline item', () => {
    context('With values for only the mandatory fields', () => {
      before(() => {
        cy.visit(urls.pipeline.archive(firstItem.id))
      })

      assertHeader()
      assertProjectDetails(firstItem)
      assertForm()
    })

    context('With values for all fields', () => {
      before(() => {
        cy.visit(urls.pipeline.archive(secondItem.id))
      })

      assertHeader()
      assertProjectDetails(secondItem)
      assertForm()
    })
  })

  context(
    'When the form is submitted successfully it redirects to the correct tab with a success message',
    () => {
      function archiveItem(itemId) {
        cy.visit(urls.pipeline.archive(itemId))
        cy.get(formSelectors.reason)
          .find('textarea')
          .type('My reason')
        cy.contains('button', 'Archive project').click()
      }

      it('should redirect to the prospect tab in my pipeline', () => {
        archiveItem('LEADS')
        cy.url().should('include', urls.pipeline.index())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'Pipeline changes for this company have been saved'
        )
      })

      it('should redirect to the active tab in my pipeline', () => {
        archiveItem('IN_PROGRESS')
        cy.url().should('include', urls.pipeline.active())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'Pipeline changes for this company have been saved'
        )
      })

      it('should redirect to the won tab in my pipeline', () => {
        archiveItem('WIN')
        cy.url().should('include', urls.pipeline.won())
        cy.get(selectors.companyLocalHeader().flashMessageList).should(
          'contain',
          'Pipeline changes for this company have been saved'
        )
      })
    }
  )

  context('When cancelling it should link to the pipeline category', () => {
    beforeEach(() => {
      cy.visit(urls.pipeline.archive(firstItem.id))
    })

    it('should redirect to the prospect tab in my pipeline', () => {
      cy.visit(urls.pipeline.archive('LEADS'))
      cy.contains('a', 'Cancel').should(
        'have.attr',
        'href',
        urls.pipeline.index()
      )
      cy.contains('a', 'Cancel').click()
      cy.url().should('include', urls.pipeline.index())
    })

    it('should redirect to the active tab in my pipeline', () => {
      cy.visit(urls.pipeline.archive('IN_PROGRESS'))
      cy.contains('a', 'Cancel').should(
        'have.attr',
        'href',
        urls.pipeline.active()
      )
      cy.contains('a', 'Cancel').click()
      cy.url().should('include', urls.pipeline.active())
    })

    it('should redirect to the won tab in my pipeline', () => {
      cy.visit(urls.pipeline.archive('WIN'))
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
