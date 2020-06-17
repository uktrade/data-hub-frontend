const { DateUtils, NumberUtils } = require('data-hub-components')
const moment = require('moment')

const pipelineItemLambdaPlc = require('../../../../sandbox/fixtures/v4/pipeline-item/pipeline-item-lambda-plc.json')
const urls = require('../../../../../src/lib/urls')
const selectors = require('../../../../selectors')
const {
  assertFieldTextarea,
  assertBreadcrumbs,
  assertKeyValueTable,
} = require('../../support/assertions')
const {
  STATUS_VALUES,
  LIKELIHOOD_VALUES,
} = require('../../../../../src/apps/my-pipeline/client/constants')

function getItems(acc, item) {
  acc[item.value] = item
  return acc
}

const [firstItem, secondItem] = pipelineItemLambdaPlc.results
const STATUS_ITEMS = STATUS_VALUES.reduce(getItems, {})
const LIKELIHOOD_ITEMS = Object.values(LIKELIHOOD_VALUES).reduce(getItems, {})

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

function assertSummaryTable({ dataAutoId, caption, content }) {
  cy.get(`[data-auto-id="${dataAutoId}"]`)
    .find('caption')
    .should('contain', caption)

  assertKeyValueTable(dataAutoId, content)
}

function assertProjectDetails(item) {
  it('Should render project details', () => {
    const content = {
      'Project name': item.name,
      Company: {
        href: urls.companies.detail(item.company.id),
        name: item.company.name,
      },
      Status: STATUS_ITEMS[item.status].label,
    }

    if (item.likelihood_to_win) {
      content['Export win potential'] =
        LIKELIHOOD_ITEMS[item.likelihood_to_win].label
    }

    if (item.sector) {
      content['Export sector'] = item.sector.segment
    }

    if (item.contact) {
      content['Company contact'] = {
        name: item.contact.name,
        href: urls.contacts.details(item.contact.id),
      }
    }

    if (item.potential_value) {
      content['Potential export value'] = NumberUtils.currencyGBP(
        item.potential_value
      )
    }

    if (item.expected_win_date) {
      content['Expected date for win'] = moment(item.expected_win_date).format(
        'MMM Y'
      )
    }

    content['Created on'] = DateUtils.format(item.created_on)

    assertSummaryTable({
      dataAutoId: 'bodyMainContent',
      caption: 'Project details',
      content,
    })
  })
}

function assertForm() {
  it('Should have a heading', () => {
    cy.contains('h2', 'Reason for archive')
  })
  it('Should render the reason for achive textarea', () => {
    cy.get(formSelectors.reason).then((element) => {
      assertFieldTextarea({
        element,
        label: 'Details on why the project is being archived',
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
      cy.contains('There is a problemEnter why the project is being archived')
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
