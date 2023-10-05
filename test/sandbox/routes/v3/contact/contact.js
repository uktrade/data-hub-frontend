import contactJson from '../../../fixtures/v3/contact/contact.json' assert { type: 'json' };
import contactByIdUKJson from '../../../fixtures/v3/contact/contact-by-id-uk.json' assert { type: 'json' };
import contactByIdUSJson from '../../../fixtures/v3/contact/contact-by-id-us.json' assert { type: 'json' };
import contactByIdWithNoDocumentJson from '../../../fixtures/v3/contact/contact-by-id-with-no-document.json' assert { type: 'json' };
import contactsForReferralJson from '../../../fixtures/v3/contact/contacts-for-referral.json' assert { type: 'json' };
import completeUKContactJson from '../../../fixtures/v3/contact/contact-complete-details-uk.json' assert { type: 'json' };
import incompleteUKContactJson from '../../../fixtures/v3/contact/contact-incomplete-details-uk.json' assert { type: 'json' };
import contactWithCompanyAddressJson from '../../../fixtures/v3/contact/contact-with-company-address.json' assert { type: 'json' };
import contactWithUSAddressJson from '../../../fixtures/v3/contact/contact-with-us-address.json' assert { type: 'json' };
import archivedContactJson from '../../../fixtures/v3/contact/contact-archived.json' assert { type: 'json' };
import invalidEmailContactJson from '../../../fixtures/v3/contact/contact-invalid-email.json' assert { type: 'json' };
import aventriContactJson from '../../../fixtures/v4/activity-feed/aventri-attendees.json' assert { type: 'json' };
import ditContactforAventriJson from '../../../fixtures/v3/contact/contact-aventri.json' assert { type: 'json' };
import noContactJson from '../../../fixtures/v3/contact/no-contact.json' assert { type: 'json' };
import auditHistoryJson from '../../../fixtures/v3/contact/contact-audit-history.json' assert { type: 'json' };
import shortAuditHistoryJson from '../../../fixtures/v3/contact/contact-audit-history-short.json' assert { type: 'json' };
import emptyAuditHistoryJson from '../../../fixtures/v3/contact/contact-audit-history-empty.json' assert { type: 'json' };
import lambdaPlcJson from '../../../fixtures/v4/company/company-lambda-plc.json' assert { type: 'json' };
import contactCreateJson from '../../../fixtures/v3/contact/contact-create.json' assert { type: 'json' };
import contactManyContactsCompanyJson from '../../../fixtures/v3/contact/contact-company-with-many-contacts.json' assert { type: 'json' };

const validateContactForm = function (formData) {
  const requiredFields = ['first_name', 'last_name', 'job_title', 'email']

  return requiredFields
    .filter((fieldName) => !formData[fieldName])
    .map((fieldName) => [fieldName, ['This field may not be null.']])
}

const AventriEmailWithDataHubMatches = aventriContactJson.hits?.hits
  .filter((h) => h._source.datahubContactUrl)
  .map((h) => h._source.object['dit:emailAddress'])

const AventriEmailWithoutDataHubMatch =
  aventriContactJson.hits?.hits[1]?._source.object['dit:emailAddress']

const EmptyStringAventriEmail =
  aventriContactJson.hits?.hits[2]?._source.object['dit:emailAddress']

export const contact = function (req, res) {
  // This is here to allow creation of new contacts. The email must contain "new"
  if (req.query.email?.includes('new')) {
    return res.json([])
  }
  if (req.query.company_id === lambdaPlcJson.id) {
    // eslint-disable-next-line no-console
    console.log(
      'BEWARE: Lambda PLC uses contacts-for-referral.json rather than contact.json'
    )
    return res.json(contactsForReferralJson)
  }
  if (AventriEmailWithDataHubMatches.includes(req.query.email)) {
    return res.json(ditContactforAventriJson)
  }
  if (
    req.query.email === AventriEmailWithoutDataHubMatch ||
    req.query.email === EmptyStringAventriEmail
  ) {
    return res.json(noContactJson)
  } else {
    res.json(contactJson)
  }
};

export const contactCreate = function (req, res) {
  const fieldErrors = validateContactForm(req.body)

  if (req.body.first_name === 'Error') {
    return res.status(500).json({ status: 'Server error' })
  }
  if (fieldErrors.length) {
    return res.status(400).json(Object.fromEntries(fieldErrors))
  }
  if (req.body.company.id === '57c41268-26be-4335-a873-557e8b0deb29') {
    res.json(contactManyContactsCompanyJson)
  } else {
    res.json(contactCreateJson)
  }
};

export const contactById = function (req, res) {
  const contacts = {
    '5555d636-1d24-416a-aaf0-3fb220d59aaa': contactByIdWithNoDocumentJson,
    'f3d19ea7-d4cf-43e0-8e97-755c57cae313': contactByIdUKJson,
    '2676ea91-9dd7-4cf3-a4a3-67b06f841b54': completeUKContactJson,
    'bc05d7fc-ce71-448a-a60d-8a67fb5bfe06': incompleteUKContactJson,
    'a55af9e5-c53c-4696-9647-065b28ea02de': contactWithCompanyAddressJson,
    'b0cb178b-49d3-467a-9cd7-90cb0fe0f30a': contactWithUSAddressJson,
    '1ba51fde-88be-43b3-8701-5c9adcc5cbfb': archivedContactJson,
    '2341fb21-ee64-4898-8f2e-ebf924e1e63f': invalidEmailContactJson,
  }

  res.json(contacts[req.params.contactId] || contactByIdUSJson)
};

export const updateContactById = function (req, res) {
  const fieldErrors = validateContactForm(req.body)

  if (req.body.first_name === 'Error') {
    return res.status(500).json({ status: 'Server error' })
  }
  if (fieldErrors.length) {
    return res.status(400).json(Object.fromEntries(fieldErrors))
  }

  if (req.params.contactId === 'f3d19ea7-d4cf-43e0-8e97-755c57cae313') {
    res.json(contactByIdUKJson)
  } else {
    res.json(contactByIdUSJson)
  }
};

export const archiveContact = function (req, res) {
  res.sendStatus(200)
};

export const auditHistory = function (req, res) {
  const auditHistories = {
    '64f85710-eabd-4479-829c-1fd47e3595d0': auditHistoryJson,
    'e74f0a25-aeee-48bd-a483-ac29c47e81a4': shortAuditHistoryJson,
  }
  res.json(auditHistories[req.params.contactId] || emptyAuditHistoryJson)
};
