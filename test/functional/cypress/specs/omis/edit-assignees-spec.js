const fixtures = require('../../fixtures/index')
const urls = require('../../../../../src/lib/urls')

const {
  assertBreadcrumbs,
  assertTypeaheadHints,
  assertUrl,
  assertFlashMessage,
  assertErrorSummary,
  assertParamContainedInUrl,
  assertParamNotContainedInUrl,
  assertRequestBody,
} = require('../../support/assertions')

const {
  selectFirstAdvisersTypeaheadOption,
  removeFirstTypeaheadItem,
  clickButton,
  clickCancelLink,
} = require('../../support/actions')

const {
  draftOrder,
  assignees,
  cancelledOrder,
  paidOrder,
  quoteAccepted,
  quoteAwaitOrder,
} = fixtures.omis

describe('View edit assignees page', () => {
  const element = '[data-test="field-assignees"]'

  beforeEach(() => {
    cy.intercept('PATCH', '/api-proxy/v3/omis/order/*/assignee*').as(
      'omisAssigneesHttpRequest'
    )
  })

  context('When the order is draft', () => {
    beforeEach(() => {
      cy.visit(urls.omis.edit.assignees(draftOrder.id))
    })
    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        'Orders (OMIS)': urls.omis.index(),
        [draftOrder.reference]: urls.omis.workOrder(draftOrder.id),
        'Add or remove advisers in the market': undefined,
      })
    })

    it('should render heading', () => {
      cy.contains('Add or remove advisers in the market').should('exist')
    })

    it('should render field label and hint text', () => {
      assertTypeaheadHints({
        element,
        label: 'Adviser',
        placeholder: 'Search team member',
        hintText: 'For example post advisers or other in-country staff',
      })
    })

    it('should add multiple assignees and redirect to work order', () => {
      const expectedBody = [
        { adviser: { id: '33736be0-3e6b-4d4e-9fa8-32f23d0ba55e' } },
        { adviser: { id: '3cfad090-8f7e-4a8b-beb0-14c909d6f052' } },
        { adviser: { id: '2c42c516-9898-e211-a939-e4115bead28a' } },
        { adviser: { id: '8242c516-9898-e211-a939-e4115bead28a' } },
      ]
      selectFirstAdvisersTypeaheadOption({
        element,
        input: 'shawn',
      })
      selectFirstAdvisersTypeaheadOption({
        element,
        input: 'Blake',
      })

      clickButton('Save and return')

      assertAPI((xhr) => {
        assertParamContainedInUrl(xhr, 'force-delete=1')
        assertRequestBody(xhr, expectedBody)
        assertRedirectToOmisWorkOrder()
        assertFlashMessage('Changes saved')

        function assertRedirectToOmisWorkOrder() {
          assertUrl(urls.omis.workOrder(draftOrder.id))
        }
      })
    })

    it('should redirect back to work order when cancelled', () => {
      clickCancelLink()

      assertUrl(urls.omis.workOrder(draftOrder.id))
    })
  })

  context('When there are no existing assignees', () => {
    before(() => {
      cy.intercept(
        {
          method: 'GET',
          url: `/api-proxy/v3/omis/order/${draftOrder.id}/assignee`,
        },
        []
      )
      cy.visit(urls.omis.edit.assignees(draftOrder.id))
    })

    it('should display an error when form submitted with no values', () => {
      clickButton('Save and return')
      assertErrorSummary(['Enter at least one team member'])
    })
  })

  context('When there are existing assignees', () => {
    before(() => {
      cy.visit(urls.omis.edit.assignees(draftOrder.id))
    })

    it('should display existing assignees', () => {
      cy.get('[data-test="typeahead-chip"]').should('have.length', 2)
      cy.get('[data-test="typeahead-chip"]')
        .eq(0)
        .contains(assignees[0].adviser.name)
      cy.get('[data-test="typeahead-chip"]')
        .eq(1)
        .contains(assignees[1].adviser.name)
    })

    it('should allow assignee to be removed', () => {
      const expectedBody = [
        { adviser: { id: '3cfad090-8f7e-4a8b-beb0-14c909d6f052' } },
      ]
      removeFirstTypeaheadItem()

      clickButton('Save and return')

      assertAPI((xhr) => {
        assertParamContainedInUrl(xhr, 'force-delete=1')
        assertRequestBody(xhr, expectedBody)
      })
    })
  })

  context('When the order is cancelled', () => {
    it('should prevent force deletion when saving', () => {
      assertApiPreventsDeletions(cancelledOrder.id)
    })
  })

  context('When the order is paid', () => {
    it('should prevent force deletion when saving', () => {
      assertApiPreventsDeletions(paidOrder.id)
    })
  })

  context('When the order is quote accepted', () => {
    it('should prevent force deletion when saving', () => {
      assertApiPreventsDeletions(quoteAccepted.id)
    })
  })

  context('When the order is quote awaiting order', () => {
    it('should prevent force deletion when saving', () => {
      assertApiPreventsDeletions(quoteAwaitOrder.id)
    })
  })
})

function assertApiPreventsDeletions(orderId) {
  cy.visit(urls.omis.edit.assignees(orderId))

  const expectedBody = [
    { adviser: { id: '3cfad090-8f7e-4a8b-beb0-14c909d6f052' } },
  ]
  removeFirstTypeaheadItem()

  clickButton('Save and return')

  assertAPI((xhr) => {
    assertParamNotContainedInUrl(xhr, 'force-delete=1')
    assertRequestBody(xhr, expectedBody)
  })
}

function assertAPI(validateCallback) {
  cy.wait('@omisAssigneesHttpRequest').then((xhr) => validateCallback(xhr))
}
