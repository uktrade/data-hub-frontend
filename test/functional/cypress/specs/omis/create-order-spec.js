import urls from '../../../../../src/lib/urls'
import {
  assertDetails,
  assertErrorSummary,
  assertFieldRadios,
  assertFieldSingleTypeahead,
  assertFlashMessage,
  assertPayload,
} from '../../support/assertions'
import { getCollectionList } from '../../support/collection-list-assertions'

describe('Create order form', () => {
  beforeEach(() => {
    cy.visit(urls.omis.create.companySelect())
    getCollectionList()
    cy.get('@firstListItem').find('a').click()
  })

  it('should allow user to select a company and redirect to the form', () => {
    cy.location('pathname').should(
      'eq',
      urls.omis.create.form('00009ae3-1912-e411-8a2b-e4115bead28a')
    )
  })

  it('should render the contact field', () => {
    cy.get('[data-test="field-contact"]').then((element) => {
      assertFieldSingleTypeahead({
        element,
        label: 'Contact',
        value: '',
        placeholder: 'Select a contact',
      })
    })
    cy.get('[data-test="contact-details"]').then((element) => {
      assertDetails({
        element,
        summary: 'Is the contact you are looking for not listed?',
        content:
          'If the contact you are looking for is not listed you can add a new contact.',
      })
    })
  })

  it('should render the market field', () => {
    cy.get('[data-test="field-country"]').then((element) => {
      assertFieldSingleTypeahead({
        element,
        label: 'Country (market) where the service is required',
        value: '',
        placeholder: 'Select a country',
      })
    })
  })

  it('should render the sector radios', () => {
    cy.get('[data-test="sector-inset"]').should(
      'have.text',
      "Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978's primary sector is Biotechnology and Pharmaceuticals : Bio and Pharma Marketing and Sales : Bio and Pharma Retail"
    )

    cy.get('[data-test="field-useCompanySector"]').then((element) => {
      assertFieldRadios({
        element,
        label:
          "Do you want to use the company's primary sector (shown above) for this order?",
        optionsCount: 2,
      })
    })

    cy.get('[data-test="field-sector"]').should('not.exist')
  })

  it('should not allow the form to be submitted with fields missing', () => {
    cy.get('[data-test="submit-button"').click()
    assertErrorSummary([
      'Select the contact responsible for this order',
      'Select country where the service is required',
      "Do you want to use the company's primary sector?",
    ])
  })

  it('should render the sector sub-field', () => {
    cy.get('[data-test="field-useCompanySector"]').contains('No').click()
    cy.get('[data-test="field-sector"]').then((element) => {
      assertFieldSingleTypeahead({
        element,
        label: 'Sector',
        value: '',
        placeholder: 'Select a sector',
      })
    })

    cy.get('[data-test="submit-button"').click()
    assertErrorSummary([
      'Select the contact responsible for this order',
      'Select country where the service is required',
      'Select a primary sector',
    ])
  })

  it('should submit the form if all fields are filled in', () => {
    cy.get('[data-test="field-useCompanySector"]').contains('No').click()
    cy.get('[data-test="field-sector"]').then((element) => {
      assertFieldSingleTypeahead({
        element,
        label: 'Sector',
        value: '',
        placeholder: 'Select a sector',
      })
    })

    cy.get('[data-test="submit-button"').click()

    cy.intercept('POST', '/api-proxy/v3/omis/order').as('apiRequest')
    cy.get('[data-test="field-contact"]').selectTypeaheadOption('Joseph Woof')
    cy.get('[data-test="field-country"]').selectTypeaheadOption('Angola')
    cy.get('[data-test="field-sector"]').selectTypeaheadOption('Airports')
    cy.get('[data-test="submit-button"]').click()
    assertPayload('@apiRequest', {
      company: '4cd4128b-1bad-4f1e-9146-5d4678c6a018',
      contact: '5e75d636-1d24-416a-aaf0-3fb220d594ce',
      primary_market: '985f66a0-5d95-e211-a939-e4115bead28a',
      sector: '9738cecc-5f95-e211-a939-e4115bead28a',
    })
    assertFlashMessage('Order added to Data Hub')
    cy.location('pathname').should(
      'eq',
      urls.omis.workOrder('7d3d26c7-9698-f211-b939-d4115adde28a')
    )
  })
})
