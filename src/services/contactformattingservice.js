const getFormattedAddress = require('../lib/address').getFormattedAddress
const phone = require('../lib/phone')

/**
 * Translate a raw contact object into a formatted contact
 * to display on the screen
 * @param {object} contact
 * @returns {object} displayContact A contact that can be put into a key value table
 *
 */
function getDisplayContact (contact) {
  return {
    title: (contact.title && contact.title.name) ? contact.title.name : null,
    job_title: contact.job_title,
    telephone_number: phone.formatPhone(contact.telephone_countrycode, contact.telephone_number),
    email: contact.email,
    address: getFormattedAddress(contact),
    telephone_alternative: contact.telephone_alternative,
    email_alternative: contact.email_alternative,
    notes: contact.notes
  }
}

module.exports = { getDisplayContact }
