const { reject } = require('lodash')

const { transformContactToListItem } = require('../../contacts/transformers')

function renderContacts (req, res, next) {
  const { id, name, contacts } = res.locals.company

  const transformedContacts = contacts
    .map(transformContactToListItem)
    .map(contact => {
      const meta = reject(contact.meta, ['label', 'Company'])
      return Object.assign({}, contact, { meta })
    })
  const activeContacts = transformedContacts.filter(contact => !contact.isArchived)
  const archivedContacts = transformedContacts.filter(contact => contact.isArchived)

  res
    .breadcrumb(name, `/companies/${id}`)
    .breadcrumb('Contacts')
    .render('companies/views/contacts', {
      activeContacts,
      archivedContacts,
      tab: 'contacts', // TODO: Use newer local nav macro to remove need for this
      addContactUrl: `/contacts/create?company=${id}`,
    })
}

module.exports = {
  renderContacts,
}
