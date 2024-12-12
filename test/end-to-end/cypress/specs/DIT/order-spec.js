const fixtures = require('../../fixtures')
const {
  formatDate,
  DATE_MEDIUM_FORMAT,
} = require('../../../../../src/client/utils/date-utils')
const { omis } = require('../../../../../src/lib/urls')
const {
  assertSummaryTable,
} = require('../../../../functional/cypress/support/assertions')

const today = formatDate(new Date(), DATE_MEDIUM_FORMAT)

describe('Order', () => {
  const company = fixtures.company.create.defaultCompany('order testing')
  const contact = fixtures.contact.create(company.pk)

  before(() => {
    cy.loadFixture([company])
    cy.loadFixture([contact])
    cy.visit(omis.create.form(company.pk))
  })

  it('should create an order and view collection page', () => {
    cy.get('[data-test="field-contact"]').selectTypeaheadOption(
      'Johnny Cakeman'
    )
    cy.get('[data-test="field-country"]').selectTypeaheadOption('Brazil')
    cy.get('[data-test="field-useCompanySector"]').contains('No').click()
    cy.get('[data-test="field-sector"]').selectTypeaheadOption('Aerospace')
    cy.get('[data-test="submit-button"').click()

    assertSummaryTable({
      dataTest: 'contact-table',
      heading: 'Contact',
      showEditLink: true,
      content: {
        Name: 'Johnny Cakeman',
        Phone: '44 67890123432',
        Email: 'johnny@cakeman.com',
      },
    })
    cy.get('[data-test="localHeaderDetails"]')
      .should('contain', 'order testing')
      .and('contain', 'Brazil')
      .and('contain', today)

    cy.contains('Orders (OMIS)').click()

    cy.get('[data-test="collection-item"]').eq(0).as('firstListItem')

    cy.get('@firstListItem')
      .find('[data-test="badge"]')
      .should('contain', 'Brazil')

    cy.get('@firstListItem')
      .should('contain', 'order testing')
      .and('contain', 'Johnny Cakeman')
      .and('contain', 'Aerospace')
  })
})
