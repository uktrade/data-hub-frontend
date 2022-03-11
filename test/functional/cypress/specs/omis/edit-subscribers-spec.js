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
  assertAPIRequest,
} = require('../../support/assertions')

const {
  selectFirstAdvisersTypeaheadOption,
  removeFirstTypeaheadItem,
  clickButton,
  clickCancelLink,
} = require('../../support/actions')

const {
  draftOrder,
  subscribers,
  cancelledOrder,
  paidOrder,
  quoteAccepted,
  quoteAwaitOrder,
} = fixtures.omis

const OMIS_SUBSCRIBERS_INTERCEPT = 'omisSubscribersHttpRequest'

describe('View edit subscribers page', () => {
  const element = '[data-test="field-subscribers"]'

  beforeEach(() => {
    cy.intercept('PUT', '/api-proxy/v3/omis/order/*/subscriber-list*').as(
      OMIS_SUBSCRIBERS_INTERCEPT
    )
  })

  context('When the order is draft', () => {
    beforeEach(() => {
      cy.visit(urls.omis.edit.subscribers(draftOrder.id))
    })
    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        'Orders (OMIS)': urls.omis.index(),
        [draftOrder.reference]: urls.omis.workOrder(draftOrder.id),
        'Add or remove advisers in the UK': undefined,
      })
    })

    it('should render heading', () => {
      cy.contains('Add or remove advisers in the UK').should('exist')
    })

    it('should render field label and hint text', () => {
      assertTypeaheadHints({
        element,
        label: 'Adviser',
        placeholder: 'Search team member',
        hintText:
          'People who need to be kept informed about this order, for example, international trade advisers or language advisors.',
      })
    })

    it('should add multiple subscribers and redirect to work order', () => {
      const expectedBody = [
        { id: 'e83a608e-84a4-11e6-ae22-56b6b6499611' },
        { id: '25628b23-c75b-4aef-b120-dac2d64c0696' },
        { id: '2c42c516-9898-e211-a939-e4115bead28a' },
        { id: '8242c516-9898-e211-a939-e4115bead28a' },
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

      assertAPIRequest(OMIS_SUBSCRIBERS_INTERCEPT, (xhr) => {
        assertParamContainedInUrl(xhr, 'force-delete=1')
        assertRequestBody(xhr, expectedBody)
      })
      assertRedirectToOmisWorkOrder()
      assertFlashMessage('Changes saved')
    })

    it('should redirect back to work order when cancelled', () => {
      clickCancelLink()

      assertUrl(urls.omis.workOrder(draftOrder.id))
    })
  })

  context('When there are no existing subscribers', () => {
    before(() => {
      cy.intercept(
        {
          method: 'GET',
          url: `/api-proxy/v3/omis/order/${draftOrder.id}/subscriber-list`,
        },
        []
      )
      cy.visit(urls.omis.edit.subscribers(draftOrder.id))
    })

    it('should display an error when form submitted with no values', () => {
      clickButton('Save and return')
      assertErrorSummary(['Enter at least one team member'])
    })
  })

  context('When there are existing subscribers', () => {
    before(() => {
      cy.visit(urls.omis.edit.subscribers(draftOrder.id))
    })

    it('should display existing subscribers', () => {
      cy.get('[data-test="typeahead-chip"]').should('have.length', 2)
      cy.get('[data-test="typeahead-chip"]').eq(0).contains(subscribers[0].name)
      cy.get('[data-test="typeahead-chip"]').eq(1).contains(subscribers[1].name)
    })

    it('should allow subscribers to be removed', () => {
      const expectedBody = [{ id: '25628b23-c75b-4aef-b120-dac2d64c0696' }]
      removeFirstTypeaheadItem()

      clickButton('Save and return')

      assertAPIRequest(OMIS_SUBSCRIBERS_INTERCEPT, (xhr) => {
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

function assertRedirectToOmisWorkOrder() {
  assertUrl(urls.omis.workOrder(draftOrder.id))
}

function assertApiPreventsDeletions(orderId) {
  cy.visit(urls.omis.edit.subscribers(orderId))

  const expectedBody = [{ id: '25628b23-c75b-4aef-b120-dac2d64c0696' }]
  removeFirstTypeaheadItem()

  clickButton('Save and return')

  assertAPIRequest(OMIS_SUBSCRIBERS_INTERCEPT, (xhr) => {
    assertParamNotContainedInUrl(xhr, 'force-delete=1')
    assertRequestBody(xhr, expectedBody)
  })
}
