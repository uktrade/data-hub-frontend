import fixtures from '../../fixtures/index'
import urls from '../../../../../src/lib/urls'
import {
  assertFieldTextarea,
  assertFieldTypeahead,
  assertFlashMessage,
  assertLocalHeader,
} from '../../support/assertions'

const { emptyOrder } = fixtures.omis

describe('View edit internal information', () => {
  beforeEach(() => {
    cy.visit(urls.omis.edit.internalInfo(emptyOrder.id))
  })

  it('should render the form and all fields', () => {
    assertLocalHeader('Edit internal information')
    cy.get('[data-test="field-service_types"]').then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Service types the order covers',
        value: null,
        isMulti: true,
      })
    })
    cy.get('[data-test="field-sector"]').then((element) => {
      assertFieldTypeahead({
        element,
        label: 'Sector',
        value: emptyOrder.sector.name,
        isMulti: false,
      })
    })
    cy.dataTest('field-further_info').then((element) => {
      assertFieldTextarea({
        element,
        label: 'Internal notes and useful information (optional)',
        hint: 'For example, specific client requirements, market and distribution strategies or key deadlines',
        value: null,
      })
    })
    cy.dataTest('field-existing_agents').then((element) => {
      assertFieldTextarea({
        element,
        label: 'Contacts the company already has in the market (optional)',
        hint: 'For example, partners, suppliers or distributors',
        value: null,
      })
    })
    cy.dataTest('field-contacts_not_to_approach').then((element) => {
      assertFieldTextarea({
        element,
        label:
          'Specific people or organisations the company does not want DBT to talk to (optional)',
        value: null,
      })
    })
  })

  it('should submit form successfully', () => {
    cy.get('[data-test="field-service_types"]').selectTypeaheadOption('Event')
    cy.get('[data-test="field-service_types"]').selectTypeaheadOption(
      'Training'
    )
    cy.get('[data-test="field-further_info"]').type('Further information')
    cy.get('[data-test="field-existing_agents"]').type('Existing contact')
    cy.get('[data-test="field-contacts_not_to_approach"]').type(
      'Not to approach'
    )
    cy.get('[data-test=submit-button]').click()
    assertFlashMessage('Internal information updated')
    cy.location('pathname').should('eq', urls.omis.workOrder(emptyOrder.id))
  })
})
