const { reject } = require('lodash')

const { getInflatedDitCompany, getCommonTitlesAndlinks } = require('../services/data')
const { transformContactToListItem } = require('../../contacts/transformers')

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

    const transformedContacts = company.contacts
      .map(transformContactToListItem)
      .map(contact => {
        const meta = reject(contact.meta, ['label', 'Company'])
        return Object.assign({}, contact, { meta })
      })
    const activeContacts = transformedContacts.filter(contact => !contact.isArchived)
    const archivedContacts = transformedContacts.filter(contact => contact.isArchived)

    res
      .breadcrumb(res.locals.company.name, `/companies/${res.locals.company.id}`)
      .breadcrumb('Contacts')
      .render('companies/views/contacts', {
        activeContacts,
        archivedContacts,
        addContactUrl: `/contacts/create?company=${res.locals.company.id}`,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getContacts,
}
