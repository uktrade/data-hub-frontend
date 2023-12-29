const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const {
  KINDS,
  THEMES,
} = require('../../../../../src/apps/interactions/constants')

// Export
const exportRadio = '[data-test=theme-export]'
const exportInteractionRadio = '[data-test=export-kind-a-standard-interaction]'
const exportServiceDeliveryRadio =
  '[data-test=export-kind-a-service-you-have-provided]'

// Investment
const investmentRadio = '[data-test=theme-investment]'

// Trade Agreement
const tradeAgreementRadio = '[data-test=theme-trade-agreement]'

// Other
const otherRadio = '[data-test=theme-other]'
const otherInteractionRadio = '[data-test=other-kind-a-standard-interaction]'
const otherServiceDeliveryRadio =
  '[data-test=other-kind-a-service-you-have-provided]'

// Local storage
const key = 'company-interaction'
const stringifyItem = (theme, kind) =>
  JSON.stringify({
    theme,
    kind,
  })

const venusLtd = fixtures.company.venusLtd
const interactionsPage = urls.companies.interactions.create(venusLtd.id)

describe('Prepopulate the interaction theme form', () => {
  context('Export', () => {
    it('should select export and interaction', () => {
      cy.localStorage(key, stringifyItem(THEMES.EXPORT, KINDS.INTERACTION))
      cy.visit(interactionsPage)
      cy.get(exportRadio).should('be.checked')
      cy.get(exportInteractionRadio).should('be.checked')
      cy.get(exportServiceDeliveryRadio).should('not.be.checked')
    })
    it('should select export and service delivery ', () => {
      cy.localStorage(key, stringifyItem(THEMES.EXPORT, KINDS.SERVICE_DELIVERY))
      cy.visit(interactionsPage)
      cy.get(exportRadio).should('be.checked')
      cy.get(exportInteractionRadio).should('not.be.checked')
      cy.get(exportServiceDeliveryRadio).should('be.checked')
    })
  })

  context('Investment', () => {
    it('should select investment', () => {
      cy.localStorage(key, stringifyItem(THEMES.INVESTMENT))
      cy.visit(interactionsPage)
      cy.get(investmentRadio).should('be.checked')
    })
  })

  context('Trade agreement', () => {
    it('should select trade agreement', () => {
      cy.localStorage(key, stringifyItem(THEMES.TRADE_AGREEMENT))
      cy.visit(interactionsPage)
      cy.get(tradeAgreementRadio).should('be.checked')
    })
  })

  context('Other', () => {
    it('should select other and interaction', () => {
      cy.localStorage(key, stringifyItem(THEMES.OTHER, KINDS.INTERACTION))
      cy.visit(interactionsPage)
      cy.get(otherRadio).should('be.checked')
      cy.get(otherInteractionRadio).should('be.checked')
      cy.get(otherServiceDeliveryRadio).should('not.be.checked')
    })
    it('should select other and service delivery ', () => {
      cy.localStorage(key, stringifyItem(THEMES.OTHER, KINDS.SERVICE_DELIVERY))
      cy.visit(interactionsPage)
      cy.get(otherRadio).should('be.checked')
      cy.get(otherInteractionRadio).should('not.be.checked')
      cy.get(otherServiceDeliveryRadio).should('be.checked')
    })
  })
})
