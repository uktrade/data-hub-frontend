const Q = require('q')
const {
  convertNestedObjects,
  convertYesNoToBoolean,
  getPropertyId,
  nullEmptyFields,
} = require('../lib/property-helpers')
const contactRepository = require('../repos/contact.repo')

/**
 * Accepts an API contact object and converts it into a format compatible with a HTML form
 *
 * @param {Object} contact A contact in API format
 * @returns {Object} A flattened copy of the contact form in a format to use in a form
 */
function getContactAsFormData (contact) {
  if (!contact) {
    return null
  }

  let result = {
    id: contact.id,
    company: contact.company.id,
    title: getPropertyId(contact, 'title'),
    first_name: contact.first_name,
    last_name: contact.last_name,
    job_title: contact.job_title,
    primary: (contact.primary) ? 'yes' : 'no',
    telephone_number: contact.telephone_number,
    telephone_countrycode: contact.telephone_countrycode,
    email: contact.email,
    address_same_as_company: (contact.address_same_as_company) ? 'yes' : 'no',
    address_1: contact.address_1,
    address_2: contact.address_2,
    address_town: contact.address_town,
    address_county: contact.address_county,
    address_postcode: contact.address_postcode,
    address_country: getPropertyId(contact, 'address_country'),
    telephone_alternative: contact.telephone_alternative,
    email_alternative: contact.email_alternative,
    notes: contact.notes,
  }

  result = nullEmptyFields(result)
  return result
}

/**
 * Accepts a contact posted from a form and converts it into the API format before saving it.
 *
 * @param {string} token Session token to use for network calls
 * @param {Object} contactForm A flat form format contact
 * @returns {Promise} Returns a promise that resolves to a copy of the saved contact in API
 * format after the server has saved it
 */
function saveContactForm (token, contactForm) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        let dataToSave = convertYesNoToBoolean(contactForm)
        dataToSave = nullEmptyFields(dataToSave)
        dataToSave = convertNestedObjects(dataToSave, ['title', 'company', 'address_country'])
        const savedContact = yield contactRepository.saveContact(token, dataToSave)
        resolve(savedContact)
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { getContactAsFormData, saveContactForm }
