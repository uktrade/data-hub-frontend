const { getInflatedDitCompany, getCommonTitlesAndlinks } = require('../services/data.service')
const { getDisplayCompanyContact, getDisplayArchivedCompanyContact } = require('../../contacts/services/formatting.service')

/**
 *
 *  HTTP Get call to get a list of contacts for a company
 *  Gets a list of contact associated with a company and splits them into curent and archived contacts
 *  Furthermore the controller extracts only the fields required and pre-formats them to make layout easier.
 */
async function getContacts (req, res, next) {
  try {
    res.locals.tab = 'contacts'
    const company = res.locals.company = await getInflatedDitCompany(req.session.token, req.params.id)
    getCommonTitlesAndlinks(req, res, company)

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
}

module.exports = {
  getContacts,
}
