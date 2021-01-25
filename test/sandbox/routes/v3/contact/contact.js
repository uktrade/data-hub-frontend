const contact = require('../../../fixtures/v3/contact/contact.json')
const contactById = require('../../../fixtures/v3/contact/contact-by-id.json')
const contactByIdWithNoDocument = require('../../../fixtures/v3/contact/contact-by-id-with-no-document.json')
const contactsForReferral = require('../../../fixtures/v3/contact/contacts-for-referral.json')

const lambdaPlc = require('../../../fixtures/v4/company/company-lambda-plc.json')
const contactCreate = require('../../../fixtures/v3/contact/contact-create.json')

const validateContactForm = function (formData) {
  const requiredFields = [
    'first_name',
    'last_name',
    'job_title',
    'telephone_countrycode',
    'telephone_number',
    'email',
  ]

  return requiredFields
    .filter((fieldName) => !formData[fieldName])
    .map((fieldName) => [fieldName, ['This field may not be null.']])
}

exports.contact = function (req, res) {
  if (req.query.company_id === lambdaPlc.id) {
    // eslint-disable-next-line no-console
    console.log(
      'BEWARE: Lambda PLC uses contacts-for-referral.json rather than contact.json'
    )
    return res.json(contactsForReferral)
  } else {
    res.json(contact)
  }
}

exports.contactCreate = function (req, res) {
  const fieldErrors = validateContactForm(req.body)

  if (req.body.first_name === 'Error') {
    return res.status(500).json({ status: 'Server error' })
  }
  if (fieldErrors.length) {
    return res.status(400).json(Object.fromEntries(fieldErrors))
  }
  res.json(contactCreate)
}

exports.contactById = function (req, res) {
  const contacts = {
    '5555d636-1d24-416a-aaf0-3fb220d59aaa': contactByIdWithNoDocument,
  }

  res.json(contacts[req.params.contactId] || contactById)
}

exports.updateContactById = function (req, res) {
  const fieldErrors = validateContactForm(req.body)

  if (req.body.first_name === 'Error') {
    return res.status(500).json({ status: 'Server error' })
  }
  if (fieldErrors.length) {
    return res.status(400).json(Object.fromEntries(fieldErrors))
  }
  res.json(contactById)
}
