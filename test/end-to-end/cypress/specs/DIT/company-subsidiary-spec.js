const selectors = require('../../../../selectors')

const { companies } = require('../../../../../src/lib/urls')

describe('Company Subsidiary', () => {
  beforeEach(() => {
    cy.visit(companies.businessDetails('0fb3379c-341c-4da4-b825-bf8d47b26baa'))
  })

  it('should update business hierarchy type to Global HQ', () => {
    cy.get(selectors.companySubsidiaries().edit).click()

    cy.get(selectors.companyEdit.globalHqHierarchy).click()
    cy.get(selectors.companyEdit.saveButton).click()

    cy.get(selectors.message.successful).should('contain', 'Company record updated')
  })

  it('should link a subsidiary', () => {
    cy.get(selectors.companySubsidiaries().linkASubsidiaryToHierarchy).click()

    cy.get(selectors.companySubsidiariesLink().search.term).type('Mars')
    cy.get(selectors.companySubsidiariesLink().search.button).click()
    cy.get(selectors.companySubsidiariesLink().search.result(1).title).click()

    cy.get(selectors.message.successful).should('contain', 'You’ve linked the subsidiary')
  })

  it('should remove a subsidiary', () => {
    cy.get(selectors.companySubsidiaries().oneLinkedSubsidiary).click()
    cy.get(selectors.companySubsidiariesLink().removeSubsidiary).click()

    cy.get(selectors.message.successful).should('contain', 'You’ve removed the link to Global Headquarters')
  })

  it('should update business hierarchy type to not a HQ', () => {
    cy.get(selectors.companySubsidiaries().edit).click()

    cy.get(selectors.companyEdit.notHqHierarchy).click()
    cy.get(selectors.companyEdit.saveButton).click()

    cy.get(selectors.message.successful).should('contain', 'Company record updated')
  })
})

describe('Archived Company Subsidiary', () => {
  beforeEach(() => {
    cy.visit(companies.businessDetails('346f78a5-1d23-4213-b4c2-bf48246a13c3'))
  })

  it('should hide subsidiaries links for archived companies', () => {
    cy.get(selectors.companySubsidiaries().linkASubsidiaryToHierarchy).should('not.be.visible')

    cy.get(selectors.companySubsidiaries().oneLinkedSubsidiary).click()
    cy.get(selectors.companySubsidiariesLink().removeSubsidiary).should('not.be.visible')
    cy.get(selectors.companySubsidiaries().whyNoSubLink).should('be.visible')
  })
})

describe('DnB Company Subsidiary', () => {
  beforeEach(() => {
    cy.visit(companies.businessDetails('375094ac-f79a-43e5-9c88-059a7caa17f0'))
  })

  it('should display subsidiaries links for dnb companies', () => {
    cy.get(selectors.companySubsidiaries().oneLinkedSubsidiary).click()
    cy.get(selectors.companySubsidiariesLink().removeSubsidiary).should('be.visible')
  })
})
