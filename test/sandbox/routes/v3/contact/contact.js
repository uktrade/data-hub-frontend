const contact = require('../../../fixtures/v3/contact/contact.json')
const contactByIdUK = require('../../../fixtures/v3/contact/contact-by-id-uk.json')
const contactByIdUS = require('../../../fixtures/v3/contact/contact-by-id-us.json')
const contactByIdWithNoDocument = require('../../../fixtures/v3/contact/contact-by-id-with-no-document.json')
const contactsForReferral = require('../../../fixtures/v3/contact/contacts-for-referral.json')
const completeUKContact = require('../../../fixtures/v3/contact/contact-complete-details-uk.json')
const incompleteUKContact = require('../../../fixtures/v3/contact/contact-incomplete-details-uk.json')
const contactWithCompanyAddress = require('../../../fixtures/v3/contact/contact-with-company-address.json')
const contactWithUSAddress = require('../../../fixtures/v3/contact/contact-with-us-address.json')
const archivedContact = require('../../../fixtures/v3/contact/contact-archived.json')
const aventriContact = require('../../../fixtures/v4/activity-feed/aventri-attendees.json')
const ditContactforAventri = require('../../../fixtures/v3/contact/contact-aventri.json')
const noContact = require('../../../fixtures/v3/contact/no-contact.json')

const lambdaPlc = require('../../../fixtures/v4/company/company-lambda-plc.json')
const contactCreate = require('../../../fixtures/v3/contact/contact-create.json')

const validateContactForm = function (formData) {
  const requiredFields = ['first_name', 'last_name', 'job_title', 'email']

  return requiredFields
    .filter((fieldName) => !formData[fieldName])
    .map((fieldName) => [fieldName, ['This field may not be null.']])
}

const matchingAventriDataHubEmail =
  aventriContact?.hits?.hits[0]?._source.object['dit:emailAddress']

const notMatchingAventriDataHubEmail =
  aventriContact?.hits?.hits[1]?._source.object['dit:emailAddress']

exports.contact = function (req, res) {
  // This is here to allow creation of new contacts. The email must contain "new"
  if (req.query.email?.includes('new')) {
    return res.json([])
  }
  if (req.query.company_id === lambdaPlc.id) {
    // eslint-disable-next-line no-console
    console.log(
      'BEWARE: Lambda PLC uses contacts-for-referral.json rather than contact.json'
    )
    return res.json(contactsForReferral)
  }
  if (req.query.email === matchingAventriDataHubEmail) {
    return res.json(ditContactforAventri)
  }
  if (req.query.email === notMatchingAventriDataHubEmail) {
    return res.json(noContact)
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
    'f3d19ea7-d4cf-43e0-8e97-755c57cae313': contactByIdUK,
    '2676ea91-9dd7-4cf3-a4a3-67b06f841b54': completeUKContact,
    'bc05d7fc-ce71-448a-a60d-8a67fb5bfe06': incompleteUKContact,
    'a55af9e5-c53c-4696-9647-065b28ea02de': contactWithCompanyAddress,
    'b0cb178b-49d3-467a-9cd7-90cb0fe0f30a': contactWithUSAddress,
    '1ba51fde-88be-43b3-8701-5c9adcc5cbfb': archivedContact,
  }

  res.json(contacts[req.params.contactId] || contactByIdUS)
}

exports.updateContactById = function (req, res) {
  const fieldErrors = validateContactForm(req.body)

  if (req.body.first_name === 'Error') {
    return res.status(500).json({ status: 'Server error' })
  }
  if (fieldErrors.length) {
    return res.status(400).json(Object.fromEntries(fieldErrors))
  }

  if (req.params.contactId === 'f3d19ea7-d4cf-43e0-8e97-755c57cae313') {
    res.json(contactByIdUK)
  } else {
    res.json(contactByIdUS)
  }
}

exports.archiveContact = function (req, res) {
  res.sendStatus(200)
}
