const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const formSelectors = selectors.interactionForm
const companyLocalHeader = selectors.companyLocalHeader()

const selectTypeahead = (fieldName, input) =>
  cy.get(fieldName).within(() => {
    cy.server()
    cy.route('/api-proxy/adviser/?*').as('adviserResults')
    cy.get('div').eq(0).type(input)
    cy.wait('@adviserResults')
    cy.get('[class*="menu"] > div').click()
  })

describe('Referrals', () => {
  before(() => {
    cy.visit(urls.companies.referrals.send(fixtures.company.lambdaPlc.id))
  })
  context('when adding a referral', () => {
    it('should create a referral for a company', () => {
      selectTypeahead(selectors.sendReferral.adviserField, 'dennis')
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
    it('should display in the companies activity feed', () => {
      // TODO - currently we cannot view the activity feed, once this is fixed we should add this test
    })

    it('should display the new referral on the homepage', () => {
      cy.get(companyLocalHeader.flashMessageList).find('a').eq(0).click()
      cy.get(selectors.tabbedNav().item(2)).click()
      cy.selectDhTablistTab('Dashboard', 'My referrals').within(() => {
        cy.get('select').select('Sent referrals')
        cy.contains('h1', 'sent referral')
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

      cy.get(formSelectors.service).select('Export Win')
      cy.get(formSelectors.contact).selectTypeaheadOption('Dean Cox')
      cy.get(formSelectors.communicationChannel).selectTypeaheadOption(
        'Email/Website'
      )
      cy.get(formSelectors.subject).type('Subject')
      cy.get(formSelectors.notes).type('Conversation with potential client')
      cy.get(formSelectors.policyFeedbackNo).click()
      cy.get(formSelectors.countriesDiscussed.no).click()
      cy.get(selectors.interactionForm.add).click()
    })

    it('should display the referral in the interaction', () => {
      cy.get(selectors.interaction.details.interaction.referralDetails)
        .should('contain', 'This interaction is linked to a referral')
        .parents()
        .find(selectors.interaction.details.interaction.referralDetails)
        .should('contain', 'Example subject')
    })
  })
})
