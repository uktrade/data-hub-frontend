const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')
const utils = require('../../support/utils')
const { assertBreadcrumbs } = require('../../support/assertions')
const { companies, contacts, dashboard, investments } = require('../../../../../src/lib/urls')

const serviceDeliveryDetails = selectors.interaction.details.serviceDelivery

describe('Add Export', () => {
  context('when the add countries feature flag is true', () => {
    context('when adding an export interaction', () => {
      context('when in the context of a company', () => {
        context('When the fields have validtion errors', () => {
          it('Should trigger a validation error', () => {
            const formSelectors = selectors.interactionForm
            cy.visit(companies.interactions.createType(fixtures.company.addInteractionError.id, 'export', 'interaction'))

            populateCountriesDiscussed(formSelectors, true, true)

            cy.get(selectors.interactionForm.add).click()

            cy.get(`${formSelectors.countries.future} .multiselect__tag`).should('contain', 'Albania')
            cy.get(`${formSelectors.countries.export} .multiselect__tag`).should('contain', 'British Indian Ocean Territory')
            cy.get(`${formSelectors.countries.noInterest} .multiselect__tag`).should('contain', 'Central African Republic')
          })
        })

        context('When there are no validation errors', () => {
          beforeEach(() => {
            cy.visit(companies.interactions.createType(fixtures.default.id, 'export', 'interaction'))
          })

          it('should render breadcrumbs', () => {
            assertBreadcrumbs({
              'Home': dashboard(),
              'Companies': companies.index(),
              'Add interaction': null,
            })
          })

          context('when answering yes to countries discussed', () => {
            it('should add the interaction', () => {
              const subject = utils.randomString()

              populateInteractionForm(subject, 'A Specific DIT Export Service or Funding', 'Export Win', { visible: true, discussed: true })

              cy.get(selectors.interactionForm.add).click()

              assertDetails({ subject, flashMessage: 'Interaction created' })
            })
          })

          context('when answering no to countries discussed', () => {
            it('should add the interaction', () => {
              const subject = utils.randomString()

              populateInteractionForm(subject, 'A Specific DIT Export Service or Funding', 'Export Win', { visible: true, discussed: false })

              cy.get(selectors.interactionForm.add).click()

              assertDetails({ subject, flashMessage: 'Interaction created' })
            })
          })
        })
      })

      context('when in the context of a contact', () => {
        beforeEach(() => {
          cy.visit(contacts.interactions.createType(fixtures.default.id, 'export', 'interaction'))
        })

        it('should render breadcrumbs', () => {
          assertBreadcrumbs({
            'Home': dashboard(),
            'Contacts': contacts.index(),
            'Joseph Woof': contacts.contact('5e75d636-1d24-416a-aaf0-3fb220d594ce'),
            'Add interaction': null,
          })
        })

        it('should add the interaction', () => {
          const subject = utils.randomString()

          populateInteractionForm(subject, 'A Specific DIT Export Service or Funding', 'Export Win', { visible: true, discussed: true })

          cy.get(selectors.interactionForm.add).click()

          assertDetails({ subject, flashMessage: 'Interaction created' })
        })
      })
    })

    context('when adding an export service delivery', () => {
      context('when in the context of a company', () => {
        beforeEach(() => {
          cy.visit(companies.interactions.createType(fixtures.default.id, 'export', 'service-delivery'))
        })

        it('should render breadcrumbs', () => {
          assertBreadcrumbs({
            'Home': dashboard(),
            'Companies': companies.index(),
            'Add service delivery': null,
          })
        })

        it('should add the service delivery', () => {
          const subject = utils.randomString()

          populateServiceDeliveryForm(subject, 'A Specific DIT Export Service or Funding', 'Export Win', { visible: true, discussed: true })

          cy.get(selectors.interactionForm.add).click()

          assertDetails({ subject, flashMessage: 'Service delivery created' })
        })
      })

      context('when in the context of a contact', () => {
        beforeEach(() => {
          cy.visit(contacts.interactions.createType(fixtures.default.id, 'export', 'service-delivery'))
        })

        it('should render breadcrumbs', () => {
          assertBreadcrumbs({
            'Home': dashboard(),
            'Contacts': contacts.index(),
            'Joseph Woof': contacts.contact('5e75d636-1d24-416a-aaf0-3fb220d594ce'),
            'Add service delivery': null,
          })
        })

        it('should add the service delivery', () => {
          const subject = utils.randomString()

          populateServiceDeliveryForm(subject, 'A Specific DIT Export Service or Funding', 'Export Win', { visible: true, discussed: true })

          cy.get(selectors.interactionForm.add).click()

          assertDetails({ subject, flashMessage: 'Service delivery created' })
        })
      })

      context('when TAP service fields are empty', () => {
        beforeEach(() => {
          cy.visit(companies.interactions.createType(fixtures.default.id, 'export', 'service-delivery'))
        })

        it('should render breadcrumbs', () => {
          assertBreadcrumbs({
            'Home': dashboard(),
            'Companies': companies.index(),
            'Add service delivery': null,
          })
        })

        it('should add the service delivery', () => {
          const subject = utils.randomString()

          cy.get(selectors.interactionForm.contact).select('Joseph Woof, Dog master')
          cy.get(selectors.interactionForm.eventNo).click()
          cy.get(selectors.interactionForm.service).select('A Specific DIT Export Service or Funding')
          cy.get(selectors.interactionForm.subject).type(subject)
          cy.get(selectors.interactionForm.notes).type('Conversation with potential client')
          cy.get(selectors.interactionForm.policyFeedbackNo).click()

          cy.get(selectors.interactionForm.add).click()

          cy.get(selectors.localHeader().heading).should('contain', subject)
        })
      })

      context('when TAP service fields are populated', () => {
        beforeEach(() => {
          cy.visit(companies.interactions.createType(fixtures.default.id, 'export', 'service-delivery'))
        })

        it('should render breadcrumbs', () => {
          assertBreadcrumbs({
            'Home': dashboard(),
            'Companies': companies.index(),
            'Add service delivery': null,
          })
        })

        it('should add the service delivery', () => {
          const subject = utils.randomString()

          cy.get(selectors.interactionForm.contact).select('Joseph Woof, Dog master')
          cy.get(selectors.interactionForm.eventNo).click()
          cy.get(selectors.interactionForm.service).select('A Specific DIT Export Service or Funding')
          cy.get(selectors.interactionForm.subService).select('Tradeshow Access Programme (TAP)')
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

    context('when adding an investment interaction', () => {
      context('when in the context of an investment project', () => {
        beforeEach(() => {
          cy.visit(investments.projects.interactions.createType(fixtures.default.id, 'investment', 'interaction'))
        })

        it('should render breadcrumbs', () => {
          assertBreadcrumbs({
            'Home': dashboard(),
            'Investments': investments.index(),
            'Projects': investments.projects.index(),
            'New hotel (commitment to invest)': investments.projects.project('fb5b5006-56af-40e0-8615-7aba53e0e4bf'),
            'Add interaction': null,
          })
        })

        it('should add the interaction', () => {
          const subject = utils.randomString()

          populateInteractionForm(subject, 'Enquiry received', 'General Investment Enquiry', { visible: false })

          cy.get(selectors.interactionForm.add).click()

          assertDetails({ subject, flashMessage: 'Interaction created' })
        })
      })
    })
  })
})

describe('Adding interaction or service', () => {
  beforeEach(() => {
    cy.visit(contacts.interactions.create(fixtures.default.id))
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

function selectCountry (id, text) {
  const typeahead = `${id} .multiselect`
  const textInput = `${id} .multiselect__input`

  cy
    .get(typeahead)
    .click()
    .get(textInput)
    .type(text)
    .type('{enter}')
    .type('{esc}')
}

function populateCountriesDiscussed (formSelectors, visible, discussed) {
  if (!visible) { return }

  if (discussed) {
    cy.get(formSelectors.countriesDiscussed.yes).click()
    selectCountry(formSelectors.countries.future, 'Alb')
    selectCountry(formSelectors.countries.export, 'It')
    selectCountry(formSelectors.countries.noInterest, 'Fr')
  } else {
    cy.get(formSelectors.countriesDiscussed.no).click()
  }
}

function populateInteractionForm (subject, service, subService, { visible, discussed }) {
  const formSelectors = selectors.interactionForm

  cy.get(formSelectors.contact).select('Joseph Woof, Dog master')
  cy.get(formSelectors.service).select(service)
  cy.get(formSelectors.subService).select(subService)
  cy.get(formSelectors.communicationChannel).select('Email/Website')
  cy.get(formSelectors.subject).type(subject)
  cy.get(formSelectors.notes).type('Conversation with potential client')
  cy.get(formSelectors.policyFeedbackNo).click()

  populateCountriesDiscussed(formSelectors, visible, discussed)
}

function populateServiceDeliveryForm (subject, service, subService, { visible, discussed }) {
  const formSelectors = selectors.interactionForm

  cy.get(formSelectors.contact).select('Joseph Woof, Dog master')
  cy.get(formSelectors.eventNo).click()
  cy.get(formSelectors.service).select(service)
  cy.get(formSelectors.subService).select(subService)
  cy.get(formSelectors.subject).type(subject)
  cy.get(formSelectors.notes).type('Conversation with potential client')
  cy.get(formSelectors.policyFeedbackNo).click()

  populateCountriesDiscussed(formSelectors, visible, discussed)
}

function assertDetails ({
  flashMessage,
  company = 'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978',
  contact = 'Bob lawson',
  service = 'Account Managment: Northern Powerhouse',
  notes = 'Sandbox',
  dateOfInteraction = '7 February 2019',
  ditAdviser = 'DIT Staff',
  communicationChannel = 'Social Media',
  documents = 'There are no files or documents',
}) {
  cy.get(selectors.localHeader().flash).should('contain', flashMessage)
  cy.get(serviceDeliveryDetails.company).should('contain', company)
  cy.get(serviceDeliveryDetails.contacts).should('contain', contact)
  cy.get(serviceDeliveryDetails.service).should('contain', service)
  cy.get(serviceDeliveryDetails.notes).should('contain', notes)
  cy.get(serviceDeliveryDetails.dateOfInteraction).should('contain', dateOfInteraction)
  cy.get(serviceDeliveryDetails.ditAdviser).should('contain', ditAdviser)
  cy.get(serviceDeliveryDetails.communicationChannel).should('contain', communicationChannel)
  cy.get(serviceDeliveryDetails.documents).should('contain', documents)
}
