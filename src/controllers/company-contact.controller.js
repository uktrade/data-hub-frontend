/* eslint new-cap: 0 */
const express = require('express')
const Q = require('q')
const companyService = require('../services/company.service')
const { getDisplayCompanyContact, getDisplayArchivedCompanyContact } = require('../services/contact-formatting.service')
const router = express.Router()

/**
 *
 *  HTTP Get call to get a list of contacts for a company
 *  Gets a list of contact associated with a company and splits them into curent and archived contacts
 *  Furthermore the controller extracts only the fields required and pre-formats them to make layout easier.
 */
function getContacts (req, res, next) {
  Q.spawn(function * () {
    try {
      res.locals.tab = 'contacts'
      const company = res.locals.company = yield companyService.getInflatedDitCompany(req.session.token, req.params.id)
      companyService.getCommonTitlesAndlinks(req, res, company)

      // build the data for the contact table.
      res.locals.contacts = company.contacts
        .filter(contact => !contact.archived)
        .map(contact => getDisplayCompanyContact(contact, company))

      // build the data for the archived contact table.
      res.locals.contactsArchived = company.contacts
        .filter(contact => contact.archived === true)
        .map(contact => getDisplayArchivedCompanyContact(contact))

      res.locals.addContactUrl = `/contact/add?company=${res.locals.company.id}`
      res.locals.title = ['Contacts', res.locals.company.name, 'Companies']

      res.render('company/contacts')
    } catch (error) {
      next(error)
    }
  })
}

router.get('/company-contacts/:id', getContacts)

module.exports = { getContacts, router }
