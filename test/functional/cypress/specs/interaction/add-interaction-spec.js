const fixtures = require('../../fixtures/index.js')
const selectors = require('../../selectors')
const utils = require('../../support/utils')

const serviceDeliveryDetails = selectors.interactionDetails.serviceDelivery

let subject

describe('Add Interaction', () => {
  beforeEach(() => {
    subject = utils.randomString()
  })

  describe('Standard Interaction', () => {
    it('should add interaction by company', () => {
      cy.visit(`/companies/${fixtures.default.id}/interactions/create/interaction`)
      populateInteractionForm()
      cy.get(selectors.interactionForm.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should add interaction by contacts', () => {
      cy.visit(`/contacts/${fixtures.default.id}/interactions/create/interaction`)
      populateInteractionForm()
      cy.get(selectors.interactionForm.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should add interaction by investment projects', () => {
      cy.visit(`/investments/projects/${fixtures.default.id}/interactions/create/interaction`)
      populateInteractionForm()
      cy.get(selectors.interactionForm.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should map values to the successfully created interaction form', () => {
      cy.visit(`/companies/${fixtures.default.id}/interactions/create/interaction`)
      cy.get(selectors.interactionForm.subject).type(subject)
      cy.get(selectors.interactionForm.add).click()

      validateSuccesfulFormSubmission(subject, 'Interaction created')
    })
  })

  describe('Service delivery', () => {
    it('should add service delivery by company', () => {
      cy.visit(`/companies/${fixtures.default.id}/interactions/create/service-delivery`)
      populateServiceDeliveryForm('Bank Referral')
      cy.get(selectors.interactionForm.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should add service delivery by contacts', () => {
      cy.visit(`/contacts/${fixtures.default.id}/interactions/create/service-delivery`)
      populateServiceDeliveryForm('Bank Referral')
      cy.get(selectors.interactionForm.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should add service delivery by investment projects', () => {
      cy.visit(`/investments/projects/${fixtures.default.id}/interactions/create/service-delivery`)
      populateServiceDeliveryForm('Account Management')
      cy.get(selectors.interactionForm.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should add service delivery with TAP service optional fields empty', () => {
      cy.visit(`/companies/${fixtures.default.id}/interactions/create/service-delivery`)

      cy.get(selectors.interactionForm.contact).select('Joseph Woof, Dog master')
      cy.get(selectors.interactionForm.eventNo).click()
      cy.get(selectors.interactionForm.service).select('Tradeshow Access Programme (TAP)')
      cy.get(selectors.interactionForm.subject).type(subject)
      cy.get(selectors.interactionForm.notes).type('Conversation with potential client')
      cy.get(selectors.interactionForm.policyFeedbackNo).click()
      cy.get(selectors.interactionForm.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should add service delivery with TAP service optional fields populated', () => {
      cy.visit(`/companies/${fixtures.default.id}/interactions/create/service-delivery`)

      cy.get(selectors.interactionForm.contact).select('Joseph Woof, Dog master')
      cy.get(selectors.interactionForm.eventNo).click()
      cy.get(selectors.interactionForm.service).select('Tradeshow Access Programme (TAP)')
      cy.get(selectors.interactionForm.serviceStatus).select('Current')
      cy.get(selectors.interactionForm.grantOffered).type('Approved')
      cy.get(selectors.interactionForm.subject).type(subject)
      cy.get(selectors.interactionForm.notes).type('Conversation with potential client')
      cy.get(selectors.interactionForm.policyFeedbackNo).click()

      cy.get(selectors.interactionForm.add).click()

      cy.get(serviceDeliveryDetails.subject).should('contain', subject)
    })

    it('should map values to the successfully created service delivery form', () => {
      cy.visit(`/companies/${fixtures.default.id}/interactions/create/service-delivery`)
      cy.get(selectors.interactionForm.subject).type(subject)
      cy.get(selectors.interactionForm.add).click()

      validateSuccesfulFormSubmission(subject, 'Service delivery created')
    })
  })
})

const populateInteractionForm = () => {
  cy.get(selectors.interactionForm.contact).select('Joseph Woof, Dog master')
  cy.get(selectors.interactionForm.service).select('Account Management')
  cy.get(selectors.interactionForm.communicationChannel).select('Email/Website')
  cy.get(selectors.interactionForm.subject).type(subject)
  cy.get(selectors.interactionForm.notes).type('Conversation with potential client')
  cy.get(selectors.interactionForm.policyFeedbackNo).click()
}

const populateServiceDeliveryForm = service => {
  cy.get(selectors.interactionForm.contact).select('Joseph Woof, Dog master')
  cy.get(selectors.interactionForm.eventNo).click()
  cy.get(selectors.interactionForm.service).select(service)
  cy.get(selectors.interactionForm.subject).type(subject)
  cy.get(selectors.interactionForm.notes).type('Conversation with potential client')
  cy.get(selectors.interactionForm.policyFeedbackNo).click()
}

const validateSuccesfulFormSubmission = (subject, headerTitle) => {
  cy.get(serviceDeliveryDetails.company).should('contain', 'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978')
  cy.get(serviceDeliveryDetails.contacts).should('contain', 'Bob lawson')
  cy.get(serviceDeliveryDetails.service).should('contain', 'Account Managment: Northern Powerhouse')
  cy.get(serviceDeliveryDetails.subject).should('contain', subject)
  cy.get(serviceDeliveryDetails.notes).should('contain', 'Sandbox')
  cy.get(serviceDeliveryDetails.dateOfInteraction).should('contain', '7 February 2019')
  cy.get(serviceDeliveryDetails.ditAdviser).should('contain', 'DIT Staff')
  cy.get(serviceDeliveryDetails.communicationChannel).should('contain', 'Social Media')
  cy.get(serviceDeliveryDetails.documents).should('contain', 'There are no files or documents')
  cy.get(serviceDeliveryDetails.successMsg).should('contain', headerTitle)
}
