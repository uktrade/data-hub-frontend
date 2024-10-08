const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const {
  selectFirstMockedTypeaheadOption,
} = require('../../../../functional/cypress/support/actions')
const {
  assertFlashMessage,
} = require('../../../../functional/cypress/support/assertions')

const formSelectors = selectors.interactionForm

describe('Referrals', () => {
  const company = fixtures.company.create.lambda()
  const contact = fixtures.contact.create(company.pk)

  beforeEach(() => {
    cy.loadFixture([company])
    cy.loadFixture([contact])
  })
  context('when adding a referral', () => {
    it('should create a referral for a company and display it on the homepage', () => {
      cy.visit(urls.companies.referrals.send(company.pk))
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
      assertFlashMessage('Referral sent')
      cy.get('[data-test="flash"]').find('a').eq(0).click()
      cy.get('select').select('Sent referrals')
      cy.contains('h2', '1 sent referral')
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

  context('when accepting a referral', () => {
    it('should create an interaction successfully and display the referral in the interaction', () => {
      cy.visit(urls.companies.referrals.list())
      cy.get('select').select('Sent referrals')
      cy.contains('h2', '1 sent referral')
        .parent()
        .parent()
        .find('ol li')
        .should('contain', 'Lambda plc')
        .find('h2 a')
        .last()
        .should('contain', 'Example subject')
        .click()

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

      // should display the referral in the interaction
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
