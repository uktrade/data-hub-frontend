const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const { formatWithoutParsing } = require('../../../../../src/client/utils/date')
const { omis } = require('../../../../../src/lib/urls')
const { DATE_MEDIUM_FORMAT } = require('../../../../../src/common/constants')
const {
  assertSummaryTable,
} = require('../../../../functional/cypress/support/assertions')

const today = formatWithoutParsing(new Date(), DATE_MEDIUM_FORMAT)

describe('Order', () => {
  const company = fixtures.company.create.defaultCompany('order testing')
  const contact = fixtures.contact.create(company.pk)

  before(() => {
    cy.loadFixture([company])
    cy.loadFixture([contact])
    cy.visit(omis.create(company.pk))
  })

  it('should create an order and view collection page', () => {
    cy.contains('Continue').click()
    cy.get(selectors.omisCreate.contact).select('Johnny Cakeman')
    cy.get(selectors.omisCreate.continue).click()
    cy.get(selectors.omisCreate.country).select('Brazil')
    cy.get(selectors.omisCreate.continue).click()
    cy.get(selectors.omisCreate.sectorNo).click()
    cy.get(selectors.omisCreate.sector).select('Aerospace')
    cy.get(selectors.omisCreate.continue).click()
    cy.get(selectors.omisCreate.continue).click()

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
