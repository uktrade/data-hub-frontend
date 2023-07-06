const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const { companies } = require('../../../../../src/lib/urls')

describe('Business hierarchy', () => {
  context('Global HQ', () => {
    const company = fixtures.company.create.lambda()

    before(() => {
      cy.loadFixture([company])
      cy.visit(companies.businessDetails(company.pk))
    })
    context('when the company has no link to a global hq', () => {
      it('should not contain a link', () => {
        cy.get(selectors.companyBusinessDetails().hierarchy).should(
          'contain',
          'Global HQNoneLink to the Global HQ'
        )
      })
    })
  })
  context('Company Subsidiary', () => {
    const company = fixtures.company.create.lambda()

    before(() => {
      cy.loadFixture([company])
    })

    beforeEach(() => {
      cy.visit(companies.businessDetails(company.pk))
    })

    it('should update business hierarchy type to Global HQ', () => {
      cy.get(selectors.companySubsidiaries().edit).click()

      cy.get(selectors.companyEdit.globalHqHierarchy).click()
      cy.get(selectors.companyEdit.saveButton).click()

      cy.contains('div', 'Company record updated').should(
        'have.attr',
        'data-test',
        'status-message'
      )
    })

    it('should update business hierarchy type to not a HQ', () => {
      cy.get(selectors.companySubsidiaries().edit).click()

      cy.get(selectors.companyEdit.notHqHierarchy).click()
      cy.get(selectors.companyEdit.saveButton).click()

      cy.contains('div', 'Company record updated').should(
        'have.attr',
        'data-test',
        'status-message'
      )
    })
  })

  describe('Archived Company Subsidiary', () => {
    const company = fixtures.company.create.archivedLtd()
    const subsidiaryCompany = fixtures.company.create.subsidiaryCorp(company.pk)

    before(() => {
      cy.loadFixture([company])
      cy.loadFixture([subsidiaryCompany])
    })

    beforeEach(() => {
      cy.visit(companies.businessDetails(company.pk))
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
    const company = fixtures.company.create.corp()
    const subsidiaryCompany = fixtures.company.create.subsidiaryCorp(company.pk)

    before(() => {
      cy.loadFixture([company])
      cy.loadFixture([subsidiaryCompany])
    })

    beforeEach(() => {
      cy.visit(companies.businessDetails(company.pk))
    })

    it('should display subsidiaries links for dnb companies', () => {
      cy.get(selectors.companySubsidiaries().oneLinkedSubsidiary).click()
      cy.get(selectors.companySubsidiariesLink().removeSubsidiary).should(
        'be.visible'
      )
    })
  })
})
