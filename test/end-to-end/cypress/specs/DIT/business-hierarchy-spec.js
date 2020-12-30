const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const { companies } = require('../../../../../src/lib/urls')

describe('Business hierarchy', () => {
  context('Global HQ', () => {
    before(() => {
      cy.visit(companies.businessDetails(fixtures.company.lambdaPlc.id))
    })
    context('when the company has no link to a global hq', () => {
      it('should not contain a link', () => {
        cy.get(selectors.companyBusinessDetails().hierarchy).should(
          'contain',
          'Global HQNoneLink to the Global HQ'
        )
      })
    })
    context('when linking a global hq to a company', () => {
      it('should create the link', () => {
        cy.get(`${selectors.companyBusinessDetails().hierarchy} td a`).click()
        cy.get('input[type="search"]')
          .type(fixtures.company.oneListCorp.name)
          .next()
          .click()
        cy.get('.c-entity-list li a').click()
        cy.get('.c-message--success').should(
          'contain',
          'You’ve linked the Global Headquarters'
        )
        cy.get(selectors.companyBusinessDetails().hierarchy).should(
          'contain',
          'Global HQOne List CorpRemove link'
        )
      })
    })
    context('when removing the link to a global hq', () => {
      it('should remove the link', () => {
        cy.get(
          `${selectors.companyBusinessDetails().hierarchy} td a:nth-child(2)`
        ).click()
        cy.get('.c-message--success').should(
          'contain',
          'You’ve removed the link to Global Headquarters'
        )
        cy.get(selectors.companyBusinessDetails().hierarchy).should(
          'contain',
          'Global HQNoneLink to the Global HQ'
        )
      })
    })
  })
  context('Company Subsidiary', () => {
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
        'not.be.visible'
      )

      cy.get(selectors.companySubsidiaries().oneLinkedSubsidiary).click()
      cy.get(selectors.companySubsidiariesLink().removeSubsidiary).should(
        'not.be.visible'
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
})
