import selectors from '../../selectors'

describe('Add Interaction', () => {
  beforeEach(() => {
    cy.visit('/investment-projects/00086bb2-c5ee-4bfb-998f-0b417eafdd3e/interactions/create/interaction')
  })

  it('should add interaction by investment project', () => {
    cy.selectFirstOption(selectors.interactions.contact)
    // Mock response for DIT adviser and select option here
    cy.get(selectors.interactions.service).select('Account Management')
    cy.get(selectors.interactions.communicationChannel).select('Email/Website')
    cy.get(selectors.interactions.subject).type('Potential client')
    cy.get(selectors.interactions.notes).type('Conversation with potential client')
    cy.get(selectors.interactions.policyFeedbackNo).click()

    cy.get(selectors.interactions.addInteraction).click()

    // Validate HTTP POST request params sent to the backend here
  })

  it('should map values to the successfully created interaction form', () => {
    cy.get(selectors.interactions.addInteraction).click()

    cy.get('tr').eq(0).should('contain', 'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978')
    cy.get('tr').eq(1).should('contain', 'Bob lawson')
    cy.get('tr').eq(2).should('contain', 'UKTI Team East Midlands - International Trade Team')
    cy.get('tr').eq(3).should('contain', 'Account Managment: Northern Powerhouse')
    cy.get('tr').eq(4).should('contain', 'This is an automated interaction')
    cy.get('tr').eq(5).should('contain', 'Sandbox')
    cy.get('tr').eq(6).should('contain', '7 February 2019')
    cy.get('tr').eq(7).should('contain', 'DIT Staff')
    cy.get('tr').eq(8).should('contain', 'Social Media')
    cy.get('tr').eq(9).should('contain', 'There are no files or documents')

    cy.get(selectors.details.successMsg).should('contain', 'Interaction created')
  })
})
