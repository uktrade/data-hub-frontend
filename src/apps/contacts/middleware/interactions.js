const urls = require('../../../lib/urls')

function setInteractionsDetails(req, res, next) {
  res.locals.interactions = {
    returnLink: urls.contacts.interactions.index(req.params.contactId),
    entityName: `${res.locals.contact.first_name} ${res.locals.contact.last_name}`,
    contactId: req.params.contactId,
    query: { contacts__id: req.params.contactId },
    view: 'contacts/views/interactions',
    canAdd: true,
    showCompany: true,
  }

  next()
}

module.exports = {
  setInteractionsDetails,
}
