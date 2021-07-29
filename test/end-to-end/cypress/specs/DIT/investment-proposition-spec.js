const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const { investments } = require('../../../../../src/lib/urls')
const { formatWithoutParsing } = require('../../../../../src/client/utils/date')
const { DATE_LONG_FORMAT_1 } = require('../../../../../src/common/constants')

const today = new Date()

const createProposition = (data) => {
  cy.get(selectors.entityCollection.addProposition).click()
  cy.get(selectors.investment.proposition.name).type(data.name)
  cy.get(selectors.investment.proposition.scope).type(data.scope)
  cy.get(selectors.investment.proposition.day).type(
    formatWithoutParsing(data.date, 'dd')
  )
  cy.get(selectors.investment.proposition.month).type(
    formatWithoutParsing(data.date, 'MM')
  )
  cy.get(selectors.investment.proposition.year).type(
    formatWithoutParsing(data.date, 'yyyy')
  )
  cy.get(selectors.investment.proposition.button).click()
}

describe('Proposition', () => {
  const investmentProject =
    fixtures.investmentProject.create.newHotelCommitmentToInvest()
  beforeEach(() => {
    cy.loadFixture([investmentProject])
    cy.visit(investments.projects.propositions(investmentProject.pk))
  })

  it('should create a proposition', () => {
    const data = {
      name: 'Proposition name',
      scope: 'Proposition scope',
      date: today,
    }
    createProposition(data)

    cy.get(selectors.message.successful).should(
      'contain',
      'Proposition created'
    )

    cy.get(selectors.collection.items)
      .should('contain', formatWithoutParsing(today, DATE_LONG_FORMAT_1))
      .and('contain', data.name)
      .and('contain', 'DIT Staff')
  })

  it('should abandon a newly created proposition', () => {
    const data = {
      name: 'Prospect name 1',
      scope: 'Abandon scope',
      date: today,
    }
    createProposition(data)

    cy.get(selectors.message.successful).should(
      'contain',
      'Proposition created'
    )

    cy.get(`${selectors.collection.items}:contains("${data.name}")`)
      .find('a:contains("Abandon")')
      .first()
      .click()

    cy.get(selectors.investment.proposition.details).type('Not useful anymore')
    cy.get(selectors.investment.proposition.button).click()

    cy.get(selectors.message.successful).should(
      'contain',
      'Proposition abandoned'
    )
  })
})
