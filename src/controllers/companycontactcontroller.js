/* eslint new-cap: 0 */
const express = require('express')
const {getDisplayCompanyContact, getDisplayArchivedCompanyContact} = require('../services/contactformattingservice')

const router = express.Router()
/**
 *
 *  HTTP Get call to get a list of contacts for a company
 *  Gets a list of contact associated with a company and splits them into curent and archived contacts
 *  Furthermore the controller extracts only the fields required and pre-formats them to make layout easier.
 */
function getContacts (req, res) {
  res.locals.tab = 'contacts'
  const company = res.locals.company

  // build the data for the contact table.
  res.locals.contacts = company.contacts
    .filter(contact => !contact.archived)
    .map(contact => getDisplayCompanyContact(contact))

  // build the data for the archived contact table.
  res.locals.contactsArchived = company.contacts
    .filter(contact => contact.archived === true)
    .map(contact => getDisplayArchivedCompanyContact(contact))

  res.locals.addContactUrl = `/contact/add?company=${res.locals.company.id}`
  res.render('company/contacts')
}

router.get('/company/:source/:sourceId/contacts', getContacts)

module.exports = { getContacts, router }
