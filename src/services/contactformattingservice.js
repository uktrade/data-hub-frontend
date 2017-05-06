const {getFormattedAddress} = require('../lib/address')
const {newlineToBr} = require('../lib/textformatting')
const {formatMediumDate} = require('../lib/date')
const {formatPhone} = require('../lib/phone')

function getContactAddress (contact) {
  let contactAddress = getFormattedAddress(contact)
  if (!contactAddress) {
    contactAddress = getFormattedAddress(contact.company, 'trading') || getFormattedAddress(contact.company, 'registered')
  }
  return contactAddress
}

/**
 * Translate a raw contact object into a formatted contact
 * to display on the screen
 * @param {object} contact
 * @returns {object} displayContact A contact that can be put into a key value table
 *
 */
function getDisplayContact (contact) {
  return {
    id: contact.id,
    job_title: contact.job_title,
    telephone_number: formatPhone(contact.telephone_countrycode, contact.telephone_number),
    email: contact.email,
    address: getContactAddress(contact),
    telephone_alternative: contact.telephone_alternative,
    email_alternative: contact.email_alternative,
    notes: newlineToBr(contact.notes)
  }
}

/**
 * Format contact details for use in the company screen
 *
 * @param {object} contact
 * @returns {object} displayContact A contact that can be put into a key value table
 */
function getDisplayCompanyContact (contact) {
  return {
    id: contact.id,
    url: `/contact/${contact.id}/details`,
    name: `${contact.first_name} ${contact.last_name}`,
    job_title: contact.job_title,
    telephone_number: formatPhone(contact.telephone_countrycode, contact.telephone_number),
    email: contact.email,
    added: formatMediumDate(contact.created_on),
    address: getContactAddress(contact),
    telephone_alternative: contact.telephone_alternative,
    email_alternative: contact.email_alternative,
    notes: newlineToBr(contact.notes)
  }
}

/**
 * Format an archived contact for use in the company screen
 *
 * @param {object} contact
 * @returns {object} displayContact A contact that can be put into a key value table
 */
function getDisplayArchivedCompanyContact (contact) {
  return {
    url: `/contact/${contact.id}/details`,
    name: `${contact.first_name} ${contact.last_name}`,
    job_title: contact.job_title,
    reason: contact.archived_reason,
    archived_on: formatMediumDate(contact.archived_on),
    archived_by: `${contact.archived_by.first_name} ${contact.archived_by.last_name}`
  }
}

module.exports = { getDisplayContact, getDisplayCompanyContact, getDisplayArchivedCompanyContact }
