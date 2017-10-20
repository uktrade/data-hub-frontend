const faker = require('faker')
const { getDate, getMonth, getYear } = require('date-fns')
const { assign } = require('lodash')

const { getSelectorForElementWithText, getButtonWithText } = require('../../../helpers/selectors')

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
      createInteraction ({ details = {}, callback }) {
        const recentDate = faker.date.recent()
        const interaction = assign({}, {
          subject: faker.lorem.word(),
          notes: faker.lorem.sentence(),
          dateOfInteractionYear: getYear(recentDate),
          dateOfInteractionMonth: getMonth(recentDate) + 1,
          dateOfInteractionDay: getDate(recentDate),
        }, details)

        this.api
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
            for (const key in this.state.interactionDetails) {
              if (interaction[key]) {
                this.setValue(`@${key}`, this.state.interactionDetails[key])
              }
            }
            done()
          })
        this.click('@saveButton')

        callback(interaction)
        return this
      },
    },
  ],
}
