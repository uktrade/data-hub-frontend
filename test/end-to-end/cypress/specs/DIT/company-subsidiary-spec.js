const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const { companies } = require('../../../../../src/lib/urls')

describe('Company Subsidiary', () => {
  beforeEach(() => {
    cy.visit(companies.businessDetails(fixtures.company.lambdaPlc.id))
  })

  it('should update business hierarchy type to Global HQ', () => {
    cy.get(selectors.companySubsidiaries().edit).click()

    cy.get(selectors.companyEdit.globalHqHierarchy).click()
    cy.get(selectors.companyEdit.saveButton).click()

    cy.get(selectors.message.successful).should(
      'contain',
      'Company record updated'
    )
  })

  it('should link a subsidiary', () => {
    cy.get(selectors.companySubsidiaries().linkASubsidiaryToHierarchy).click()

    cy.get(selectors.companySubsidiariesLink().search.term).type('Mars')
    cy.get(selectors.companySubsidiariesLink().search.button).click()
    cy.get(selectors.companySubsidiariesLink().search.result(1).title).click()

    cy.get(selectors.message.successful).should(
      'contain',
      'You’ve linked the subsidiary'
    )
  })

  it('should remove a subsidiary', () => {
    cy.get(selectors.companySubsidiaries().oneLinkedSubsidiary).click()
    cy.get(selectors.companySubsidiariesLink().removeSubsidiary).click()

    cy.get(selectors.message.successful).should(
      'contain',
      'You’ve removed the link to Global Headquarters'
    )
  })

  it('should update business hierarchy type to not a HQ', () => {
    cy.get(selectors.companySubsidiaries().edit).click()

    cy.get(selectors.companyEdit.notHqHierarchy).click()
    cy.get(selectors.companyEdit.saveButton).click()

    cy.get(selectors.message.successful).should(
      'contain',
      'Company record updated'
    )
  })
})

describe('Archived Company Subsidiary', () => {
  beforeEach(() => {
    cy.visit(companies.businessDetails(fixtures.company.archivedLtd.id))
  })

  it('should hide subsidiaries links for archived companies', () => {
    cy.get(selectors.companySubsidiaries().linkASubsidiaryToHierarchy).should(
      'not.exist'
    )

    cy.get(selectors.companySubsidiaries().oneLinkedSubsidiary).click()
    cy.get(selectors.companySubsidiariesLink().removeSubsidiary).should(
      'not.exist'
    )
    cy.get(selectors.companySubsidiaries().whyNoSubLink).should('be.visible')
  })
})

describe('DnB Company Subsidiary', () => {
  beforeEach(() => {
    cy.visit(companies.businessDetails(fixtures.company.oneListCorp.id))
  })

  it('should display subsidiaries links for dnb companies', () => {
    cy.get(selectors.companySubsidiaries().oneLinkedSubsidiary).click()
    cy.get(selectors.companySubsidiariesLink().removeSubsidiary).should(
      'be.visible'
    )
  })
})
