const faker = require('faker')
const { assign } = require('lodash')

const { getSelectorForElementWithText, getButtonWithText } = require('../../../helpers/selectors')
const { generateFutureDate } = require('../../../helpers/date')

const getRadioButtonWithText = (text) =>
  getSelectorForElementWithText(
    text,
    {
      el: '//span',
      className: 'c-multiple-choice__label-text',
    },
  )

const getLinkWithText = (text) => getSelectorForElementWithText(
  text,
  {
    el: '//a',
  },
)

module.exports = {
  props: {},
  elements: {
    addInteractionButton: getButtonWithText('Add interaction'),
    aStandardInteraction: getRadioButtonWithText('A standard interaction'),
    aServiceThatYouHaveProvided: getRadioButtonWithText('A service that you have provided'),
    continueButton: getButtonWithText('Continue'),
    saveButton: getButtonWithText('Save'),
    subject: '#field-subject',
    notes: '#field-notes',
    dateOfInteractionYear: '#field-date_year',
    dateOfInteractionMonth: '#field-date_month',
    dateOfInteractionDay: '#field-date_day',
    contact: '#field-contact',
    serviceProvider: '#field-dit_team',
    service: '#field-service',
    ditAdviser: '#field-dit_adviser',
    communicationChannel: '#field-communication_channel',
    eventYes: 'label[for=field-is_event-1]',
    eventNo: 'label[for=field-is_event-2]',
    event: '#field-event',
  },
  commands: [
    {
      createInteraction (details = {}, callback) { // TODO feels that some duplication between this and createServiceDelivery can be DRY'd up
        const futureDate = generateFutureDate()
        const interaction = assign({}, {
          subject: faker.lorem.word(),
          notes: faker.lorem.sentence(),
          dateOfInteractionYear: futureDate.year,
          dateOfInteractionMonth: futureDate.month,
          dateOfInteractionDay: futureDate.day,
        }, details)

        this
          .waitForElementVisible('@saveButton')
          .api
          .perform((done) => {
            this.getListOption('@contact', (contact) => {
              interaction.contact = contact
              done()
            })
          })
          .perform((done) => {
            this.getListOption('@serviceProvider', (serviceProvider) => {
              interaction.serviceProvider = serviceProvider
              done()
            })
          })
          .perform((done) => {
            this.getListOption('@service', (service) => {
              interaction.service = service
              done()
            })
          })
          .perform((done) => {
            this.getListOption('@ditAdviser', (ditAdviser) => {
              interaction.ditAdviser = ditAdviser
              done()
            })
          })
          .perform((done) => {
            this.getListOption('@communicationChannel', (communicationChannel) => {
              interaction.communicationChannel = communicationChannel
              done()
            })
          })
          .perform((done) => {
            for (const key in interaction) {
              if (interaction[key]) {
                this.clearValue(`@${key}`)
                this.setValue(`@${key}`, interaction[key])
              }
            }
            interaction.heading = interaction.subject
            done()
          })

        return this.click('@saveButton', () => {
          callback(interaction)
        })
      },

      createServiceDelivery (details = {}, callback) {
        const futureDate = generateFutureDate()
        const serviceDelivery = assign({}, {
          subject: faker.lorem.word(),
          notes: faker.lorem.sentence(),
          dateOfInteractionYear: futureDate.year,
          dateOfInteractionMonth: futureDate.month,
          dateOfInteractionDay: futureDate.day,
        }, details)

        this
          .waitForElementPresent('@eventYes')
          .click('@eventYes')
          .api.perform(async (done) => {
            this
              .api
              .perform((done) => {
                this.getListOption('@contact', (contact) => {
                  serviceDelivery.contact = contact
                  done()
                })
              })
              .perform((done) => {
                this.getListOption('@serviceProvider', (serviceProvider) => {
                  serviceDelivery.serviceProvider = serviceProvider
                  done()
                })
              })
              .perform((done) => {
                this.getListOption('@event', (event) => {
                  serviceDelivery.event = event
                  done()
                })
              })
              .perform((done) => {
                this.getListOption('@service', (service) => {
                  serviceDelivery.service = service
                  done()
                })
              })
              .perform((done) => {
                this.getListOption('@ditAdviser', (ditAdviser) => {
                  serviceDelivery.ditAdviser = ditAdviser
                  done()
                })
              })
              .perform((done) => {
                for (const key in serviceDelivery) {
                  if (serviceDelivery[key]) {
                    this.clearValue(`@${key}`)
                    this.setValue(`@${key}`, serviceDelivery[key])
                  }
                }
                serviceDelivery.heading = serviceDelivery.subject
                done()
              })
            done()
          })

        return this.click('@saveButton', () => {
          callback(serviceDelivery)
        })
      },
    },
  ],
  sections: {
    filters: {
      selector: '.c-collection-filters',
      elements: {
        interaction: 'label[for=field-kind-1]',
        serviceDelivery: 'label[for=field-kind-2]',
        dateFrom: '#field-date_after',
        dateTo: '#field-date_before',
      },
    },
    details: {
      selector: '.table--key-value',
      elements: {
        documentsLink: getLinkWithText('Documents'),
      },
    },
  },
}
