const { assign } = require('lodash')

const labels = require('../labels')
const {
  contact,
  communicationChannel,
  provider,
  service,
  subject,
  notes,
  date,
  adviser,
} = require('./fields')

module.exports = function ({
  returnLink,
  contacts = [],
  advisers = [],
  services = [],
  teams = [],
  channels = [],
  hiddenFields,
}) {
  return {
    returnLink,
    buttonText: 'Save',
    returnText: 'Cancel',
    hiddenFields,
    children: [
      contact(contacts),
      provider(teams),
      service(services),
      subject,
      notes,
      date,
      adviser(advisers),
      communicationChannel(channels),
    ].map(field => {
      return assign(field, {
        label: labels.interaction[field.name],
      })
    }),
  }
}
