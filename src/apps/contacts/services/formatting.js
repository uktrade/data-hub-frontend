const { getFormattedAddress } = require('../../../lib/address')
const { newlineToBr } = require('../../../lib/text-formatting')

function getContactAddress (contact, company) {
  let contactAddress = getFormattedAddress(contact)
  if (!contactAddress) {
    contactAddress = getFormattedAddress(company, 'trading') || getFormattedAddress(company, 'registered')
  }
  return contactAddress
}

/**
 * Translate a raw contact object into a formatted contact
 * to display on the screen
 * @param {object} contact
 * @param {object} company
 * @returns {object} displayContact A contact that can be put into a key value table
 *
 */
function getDisplayContact (contact, company) {
  const telephoneNumber =
    contact.telephone_countrycode
      ? `(${contact.telephone_countrycode}) ${contact.telephone_number}`
      : contact.telephone_number

  return {
    job_title: contact.job_title,
    telephone_number: telephoneNumber,
    email: contact.email,
    email_marketing: contact.accepts_dit_email_marketing ? 'Yes' : 'No',
    address: getContactAddress(contact, company),
    telephone_alternative: contact.telephone_alternative,
    email_alternative: contact.email_alternative,
    notes: newlineToBr(contact.notes),
  }
}

module.exports = { getDisplayContact }
