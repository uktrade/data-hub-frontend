const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const {
  selectFirstMockedTypeaheadOption,
} = require('../../../../functional/cypress/support/actions')

const formSelectors = selectors.interactionForm
const companyLocalHeader = selectors.companyLocalHeader()

describe('Referrals', () => {
  const company = fixtures.company.create.lambda()
  const contact = fixtures.contact.create(company.pk)

  before(() => {
    cy.loadFixture([company])
    cy.loadFixture([contact])
    cy.visit(urls.companies.referrals.send(company.pk))
  })
  context('when adding a referral', () => {
    it('should create a referral for a company', () => {
      selectFirstMockedTypeaheadOption({
        element: selectors.sendReferral.adviserField,
        input: 'dennis',
        mockAdviserResponse: false,
      })
      cy.get(selectors.sendReferral.subjectField)
        .click()
        .type('Example subject')
      cy.get(selectors.sendReferral.notesField).click().type('Example notes')
      cy.contains('button', 'Continue').click()
      cy.contains('Check referral details')
        .should('be.visible')
        .parents()
        .find('button')
        .eq(2)
        .click()
      cy.get(companyLocalHeader.flashMessageList)
      cy.contains('Referral sent')
    })
  })
  context('when viewing a referral', () => {
    it('should display the new referral on the homepage', () => {
      cy.get(companyLocalHeader.flashMessageList).find('a').eq(0).click()
      cy.get(selectors.tabbedNav().item(2)).click()
      cy.selectDhTablistTab('Dashboard', 'Referrals').within(() => {
        cy.get('select').select('Sent referrals')
        cy.contains('h3', '1 sent referral')
          .parent()
          .parent()
          .find('ol li')
          .should('contain', 'Lambda plc')
          .find('h2 a')
          .last()
          .should('contain', 'Example subject')
          .click()
      })
    })
  })

  context('when accepting a referral', () => {
    it('should create an interaction successfully', () => {
      cy.get('details').next().find('a:first-child').click()
      cy.get(selectors.createInteractionContext.export.theme).click()
      cy.get(selectors.createInteractionContext.export.interaction).click()
      cy.get(selectors.createInteractionContext.button).click()

      cy.get(formSelectors.service).select('Export win')
      cy.get(formSelectors.hasRelatedTradeAgreementsNo).click()
      cy.get(formSelectors.contact).selectTypeaheadOption('Johnny Cakeman')
      cy.get(formSelectors.communicationChannel).selectTypeaheadOption(
        'Email/Website'
      )
      cy.get(formSelectors.subject).type('Subject')
      cy.get(formSelectors.notes).type('Conversation with potential client')
      cy.get(formSelectors.policyFeedbackNo).click()
      cy.get(formSelectors.countriesDiscussed.no).click()
      cy.get(formSelectors.exportBarrier.no).click()
      cy.get(formSelectors.add).click()
    })

    it('should display the referral in the interaction', () => {
      cy.get(selectors.interaction.details.interaction.referralDetails)
        .should('contain', 'This interaction is linked to a referral')
        .parents()
        .find(selectors.interaction.details.interaction.referralDetails)
        .should('contain', 'Example subject')
      cy.location().then(({ pathname }) =>
        cy
          .contains('a', 'Edit interaction')
          .should('have.attr', 'href', `${pathname}/edit`)
      )
    })
  })
})
