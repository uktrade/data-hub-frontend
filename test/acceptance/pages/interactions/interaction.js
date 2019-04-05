const faker = require('faker')
const { assign, forEach, keys } = require('lodash')

const {
  getSelectorForElementWithText,
  getButtonWithText,
} = require('../../helpers/selectors')
const { generateFutureDate } = require('../../helpers/date')
const { appendUid } = require('../../helpers/uuid')

const getRadioButtonWithText = (text) =>
  getSelectorForElementWithText(
    text,
    {
      el: '//span',
      className: 'c-multiple-choice__label-text',
    },
  )

module.exports = {
  props: {},
  elements: {
    aStandardInteraction: getRadioButtonWithText('A standard interaction'),
    aServiceThatYouHaveProvided: getRadioButtonWithText('A service that you have provided'),
    continueButton: getButtonWithText('Continue'),
    interactionSaveButton: getButtonWithText('Add interaction'),
    serviceDeliverySaveButton: getButtonWithText('Add service delivery'),
    addInteractionPolicyFeedbackButton: '.js-prevent-multiple-submits',
    subject: '#field-subject',
    notes: '#field-notes',
    dateOfInteractionYear: '#field-date_year',
    dateOfInteractionMonth: '#field-date_month',
    dateOfInteractionDay: '#field-date_day',
    contact: '#field-contacts',
    serviceProvider: '#field-dit_team',
    service: '#field-service',
    serviceStatus: '#field-service_delivery_status',
    grantOffered: '#field-grant_amount_offered',
    netReceipt: '#field-net_company_receipt',
    ditAdviser: '#dit_participants__typeahead .multiselect__single',
    communicationChannel: '#field-communication_channel',
    eventYes: 'label[for=field-is_event-1]',
    eventNo: 'label[for=field-is_event-2]',
    event: '#field-event',
    policyFeedbackYes: 'label[for=field-was_policy_feedback_provided-1]',
    policyFeedbackNo: 'label[for=field-was_policy_feedback_provided-2]',
    policyIssueType1: 'label[for=field-policy_issue_types-1]',
    policyIssueType2: 'label[for=field-policy_issue_types-2]',
    policyIssueType3: 'label[for=field-policy_issue_types-3]',
    policyIssueType4: 'label[for=field-policy_issue_types-4]',
    policyIssueType5: 'label[for=field-policy_issue_types-5]',
    policyArea: '#field-policy_areas',
    policyFeedbackNotes: '#field-policy_feedback_notes',
    teamSearch: '#dit_team__typeahead .multiselect__single',
  },
  commands: [
    {
      getButtonSelectorWithText (text) {
        return getButtonWithText(text)
      },
      createInteraction (details = {}, isServiceDelivery, callback) {
        const saveButton = isServiceDelivery ? 'serviceDeliverySaveButton' : 'interactionSaveButton'
        const futureDate = generateFutureDate()
        const interaction = assign({}, {
          subject: appendUid(faker.lorem.word()),
          notes: faker.lorem.sentence(),
          dateOfInteractionYear: futureDate.year,
          dateOfInteractionMonth: futureDate.month,
          dateOfInteractionDay: futureDate.day,
        }, details)

        this
          .waitForElementVisible(`@${saveButton}`)
          .api.perform((done) => {
            this.getListOption('@contact', (contact) => {
              interaction.contact = contact.split(',')[0].trim()
              done()
            })
          })
          .perform((done) => {
            if (interaction.service) {
              return done()
            }

            this.getListOption('@service', (service) => {
              interaction.service = service
              done()
            })
          })
          .perform((done) => {
            this.click('@policyFeedbackNo')
            done()
          })
          .perform((done) => {
            if (!isServiceDelivery) {
              return done()
            }

            this.click('@eventYes')
              .getListOption('@event', (event) => {
                interaction.event = event
                done()
              })
          })
          .perform((done) => {
            if (isServiceDelivery) {
              return done()
            }

            this.getListOption('@communicationChannel', (communicationChannel) => {
              interaction.communicationChannel = communicationChannel
              done()
            })
          })
          .perform(() => {
            forEach(keys(interaction), (key) => {
              this.replaceValue(`@${key}`, interaction[key])
            })
            interaction.heading = interaction.subject
          })

        return this.click(`@${saveButton}`, () => {
          callback(interaction)
        })
      },
      createInteractionPolicyFeedback (details, isServiceDelivery, callback) {
        const saveButton = isServiceDelivery ? 'serviceDeliverySaveButton' : 'interactionSaveButton'
        const futureDate = generateFutureDate()
        const interaction = assign({}, {
          policyFeedbackNotes: faker.lorem.sentence(),
          subject: appendUid(faker.lorem.word()),
          notes: faker.lorem.sentence(),
          dateOfInteractionYear: futureDate.year,
          dateOfInteractionMonth: futureDate.month,
          dateOfInteractionDay: futureDate.day,
        }, details)
        this
          .waitForElementVisible(`@${saveButton}`)
          .api.perform((done) => {
            this.getListOption('@contact', (contact) => {
              interaction.contact = contact
              done()
            })
          })
          .perform((done) => {
            this.click('@policyIssueType1')
            done()
          })
          .perform((done) => {
            this.getListOption('@policyArea', (policyArea) => {
              interaction.policyArea = policyArea
              done()
            })
          })
          .perform((done) => {
            this.getText('@ditAdviser', (result) => {
              interaction.ditAdviser = result.value
            })
            done()
          })
          .perform((done) => {
            if (!isServiceDelivery) {
              return done()
            }

            this.click('@eventYes')
              .getListOption('@event', (event) => {
                interaction.event = event
                done()
              })
          })
          .perform((done) => {
            if (isServiceDelivery) {
              return done()
            }

            this.getListOption('@communicationChannel', (communicationChannel) => {
              interaction.communicationChannel = communicationChannel
              done()
            })
          })
          .perform((done) => {
            this.getListOption('@service', (service) => {
              interaction.service = service
              done()
            })
          })
          .perform(() => {
            forEach(keys(interaction), (key) => {
              this.replaceValue(`@${key}`, interaction[key])
            })
          })

        return this.click(`@${saveButton}`, () => {
          callback(interaction)
        })
      },
    },
  ],
}
