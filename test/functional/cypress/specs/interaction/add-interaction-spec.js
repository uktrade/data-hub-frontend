const fixtures = require('../../fixtures')
const selectors = require('../../selectors')
const utils = require('../../support/utils')

const serviceDeliveryDetails = selectors.interaction.details.serviceDelivery

describe('Add Export', () => {
  context('when adding an export interaction', () => {
    context('when in the context of a company', () => {
      beforeEach(() => {
        cy.visit(`/companies/${fixtures.default.id}/interactions/create/export/interaction`)
      })

      it('should render breadcrumbs', () => {
        cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
        cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
        cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Companies')
        cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/companies')
        cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Add interaction')
      })

      it('should add the interaction', () => {
        const subject = utils.randomString()

        populateInteractionForm(subject)

        cy.get(selectors.interactionForm.add).click()

        assertDetails({ subject, flashMessage: 'Interaction created' })
      })
    })

    context('when in the context of a contact', () => {
      beforeEach(() => {
        cy.visit(`/contacts/${fixtures.default.id}/interactions/create/export/interaction`)
      })

      it('should render breadcrumbs', () => {
        cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
        cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
        cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Contacts')
        cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/contacts')
        cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Add interaction')
      })

      it('should add the interaction', () => {
        const subject = utils.randomString()

        populateInteractionForm(subject)

        cy.get(selectors.interactionForm.add).click()

        assertDetails({ subject, flashMessage: 'Interaction created' })
      })
    })

    context('when in the context of an investment project', () => {
      beforeEach(() => {
        cy.visit(`/investments/projects/${fixtures.default.id}/interactions/create/investment/interaction`)
      })

      it('should render breadcrumbs', () => {
        cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
        cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
        cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Investments')
        cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/investments')
        cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.text', 'New hotel (commitment to invest)')
        cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.attr', 'href', '/investments/projects/fb5b5006-56af-40e0-8615-7aba53e0e4bf')
        cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Add interaction')
      })

      it('should add the interaction', () => {
        const subject = utils.randomString()

        populateInteractionForm(subject)

        cy.get(selectors.interactionForm.add).click()

        assertDetails({ subject, flashMessage: 'Interaction created' })
      })
    })
  })

  context('when adding an export service delivery', () => {
    context('when in the context of a company', () => {
      beforeEach(() => {
        cy.visit(`/companies/${fixtures.default.id}/interactions/create/export/service-delivery`)
      })

      it('should render breadcrumbs', () => {
        cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
        cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
        cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Companies')
        cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/companies')
        cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Add service delivery')
      })

      it('should add the service delivery', () => {
        const subject = utils.randomString()

        populateServiceDeliveryForm('Bank Referral', subject)

        cy.get(selectors.interactionForm.add).click()

        assertDetails({ subject, flashMessage: 'Service delivery created' })
      })
    })

    context('when in the context of a contact', () => {
      beforeEach(() => {
        cy.visit(`/contacts/${fixtures.default.id}/interactions/create/export/service-delivery`)
      })

      it('should render breadcrumbs', () => {
        cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
        cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
        cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Contacts')
        cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/contacts')
        cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Add service delivery')
      })

      it('should add the service delivery', () => {
        const subject = utils.randomString()

        populateServiceDeliveryForm('Bank Referral', subject)

        cy.get(selectors.interactionForm.add).click()

        assertDetails({ subject, flashMessage: 'Service delivery created' })
      })
    })

    context('when TAP service fields are empty', () => {
      beforeEach(() => {
        cy.visit(`/companies/${fixtures.default.id}/interactions/create/export/service-delivery`)
      })

      it('should render breadcrumbs', () => {
        cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
        cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
        cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Companies')
        cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/companies')
        cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Add service delivery')
      })

      it('should add the service delivery', () => {
        const subject = utils.randomString()

        cy.get(selectors.interactionForm.contact).select('Joseph Woof, Dog master')
        cy.get(selectors.interactionForm.eventNo).click()
        cy.get(selectors.interactionForm.service).select('Tradeshow Access Programme (TAP)')
        cy.get(selectors.interactionForm.subject).type(subject)
        cy.get(selectors.interactionForm.notes).type('Conversation with potential client')
        cy.get(selectors.interactionForm.policyFeedbackNo).click()

        cy.get(selectors.interactionForm.add).click()

        cy.get(selectors.localHeader().heading).should('contain', subject)
      })
    })

    context('when TAP service fields are populated', () => {
      beforeEach(() => {
        cy.visit(`/companies/${fixtures.default.id}/interactions/create/export/service-delivery`)
      })

      it('should render breadcrumbs', () => {
        cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
        cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
        cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Companies')
        cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/companies')
        cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Add service delivery')
      })

      it('should add the service delivery', () => {
        const subject = utils.randomString()

        cy.get(selectors.interactionForm.contact).select('Joseph Woof, Dog master')
        cy.get(selectors.interactionForm.eventNo).click()
        cy.get(selectors.interactionForm.service).select('Tradeshow Access Programme (TAP)')
        cy.get(selectors.interactionForm.serviceStatus).select('Current')
        cy.get(selectors.interactionForm.grantOffered).type('Approved')
        cy.get(selectors.interactionForm.subject).type(subject)
        cy.get(selectors.interactionForm.notes).type('Conversation with potential client')
        cy.get(selectors.interactionForm.policyFeedbackNo).click()

        cy.get(selectors.interactionForm.add).click()

        cy.get(selectors.localHeader().heading).should('contain', subject)
        // TODO assert TAP status fields are set in details
      })
    })

    // TODO test policy feedback fields
  })

  context('when in the context of an investment project', () => {
    beforeEach(() => {
      cy.visit(`/investments/projects/${fixtures.default.id}/interactions/create/investment/interaction`)
    })

    it('should render breadcrumbs', () => {
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.text', 'Home')
      cy.get(selectors.breadcrumbs.item.byNumber(1)).should('have.attr', 'href', '/')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.text', 'Investments')
      cy.get(selectors.breadcrumbs.item.byNumber(2)).should('have.attr', 'href', '/investments')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.text', 'New hotel (commitment to invest)')
      cy.get(selectors.breadcrumbs.item.byNumber(3)).should('have.attr', 'href', '/investments/projects/fb5b5006-56af-40e0-8615-7aba53e0e4bf')
      cy.get(selectors.breadcrumbs.item.last()).should('have.text', 'Add interaction')
    })

    it('should add an interaction', () => {
      const subject = utils.randomString()

      populateInteractionForm(subject)

      cy.get(selectors.interactionForm.add).click()

      assertDetails({ subject, flashMessage: 'Interaction created' })
    })
  })
})

describe('Adding interaction or service', () => {
  beforeEach(() => {
    cy.visit(`/contacts/5e75d636-1d24-416a-aaf0-3fb220d594ce/interactions/create`)
  })
  context('when choosing export interaction', () => {
    it('should direct you to "add interaction" form', () => {
      cy.get(selectors.createInteractionContext.export.theme).click()
      cy.get(selectors.createInteractionContext.export.interaction).click()
      cy.get(selectors.createInteractionContext.button).click()
      cy.get(selectors.createInteractionContext.header).should('have.text', 'Add interaction')
    })
  })
  context('when choosing export interaction service delivery', () => {
    it('should direct you to "add service delivery" form', () => {
      cy.get(selectors.createInteractionContext.export.theme).click()
      cy.get(selectors.createInteractionContext.export.serviceDelivery).click()
      cy.get(selectors.createInteractionContext.button).click()
      cy.get(selectors.createInteractionContext.header).should('have.text', 'Add service delivery')
    })
  })
  context('when choosing investment interaction', () => {
    it('should direct you to "add interaction" form', () => {
      cy.get(selectors.createInteractionContext.investment.theme).click()
      cy.get(selectors.createInteractionContext.button).click()
      cy.get(selectors.createInteractionContext.header).should('have.text', 'Add interaction')
    })
  })
  context('when choosing other interaction', () => {
    it('should direct you to "add interaction" form', () => {
      cy.get(selectors.createInteractionContext.other.theme).click()
      cy.get(selectors.createInteractionContext.other.interaction).click()
      cy.get(selectors.createInteractionContext.button).click()
      cy.get(selectors.createInteractionContext.header).should('have.text', 'Add interaction')
    })
  })
  context('when choosing other service delivery', () => {
    it('should direct you to "add service delivery" form', () => {
      cy.get(selectors.createInteractionContext.other.theme).click()
      cy.get(selectors.createInteractionContext.other.serviceDelivery).click()
      cy.get(selectors.createInteractionContext.button).click()
      cy.get(selectors.createInteractionContext.header).should('have.text', 'Add service delivery')
    })
  })
})

const populateInteractionForm = (subject) => {
  cy.get(selectors.interactionForm.contact).select('Joseph Woof, Dog master')
  cy.get(selectors.interactionForm.service).select('Account Management')
  cy.get(selectors.interactionForm.communicationChannel).select('Email/Website')
  cy.get(selectors.interactionForm.subject).type(subject)
  cy.get(selectors.interactionForm.notes).type('Conversation with potential client')
  cy.get(selectors.interactionForm.policyFeedbackNo).click()
}

const populateServiceDeliveryForm = (service, subject) => {
  cy.get(selectors.interactionForm.contact).select('Joseph Woof, Dog master')
  cy.get(selectors.interactionForm.eventNo).click()
  cy.get(selectors.interactionForm.service).select(service)
  cy.get(selectors.interactionForm.subject).type(subject)
  cy.get(selectors.interactionForm.notes).type('Conversation with potential client')
  cy.get(selectors.interactionForm.policyFeedbackNo).click()
}

const assertDetails = ({
  flashMessage,
  company = 'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978',
  contact = 'Bob lawson',
  service = 'Account Managment: Northern Powerhouse',
  notes = 'Sandbox',
  dateOfInteraction = '7 February 2019',
  ditAdviser = 'DIT Staff',
  communicationChannel = 'Social Media',
  documents = 'There are no files or documents',
}) => {
  cy.get(serviceDeliveryDetails.successMsg).should('contain', flashMessage)
  cy.get(serviceDeliveryDetails.company).should('contain', company)
  cy.get(serviceDeliveryDetails.contacts).should('contain', contact)
  cy.get(serviceDeliveryDetails.service).should('contain', service)
  cy.get(serviceDeliveryDetails.notes).should('contain', notes)
  cy.get(serviceDeliveryDetails.dateOfInteraction).should('contain', dateOfInteraction)
  cy.get(serviceDeliveryDetails.ditAdviser).should('contain', ditAdviser)
  cy.get(serviceDeliveryDetails.communicationChannel).should('contain', communicationChannel)
  cy.get(serviceDeliveryDetails.documents).should('contain', documents)
}
