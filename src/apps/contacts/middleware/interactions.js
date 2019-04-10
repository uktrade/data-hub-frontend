const { getContact } = require('../../contacts/repos')

function setInteractionsDetails (req, res, next) {
  res.locals.interactions = {
    returnLink: `/contacts/${req.params.contactId}/interactions/`,
    entityName: `${res.locals.contact.first_name} ${res.locals.contact.last_name}`,
    query: { contacts__id: req.params.contactId },
    view: 'contacts/views/interactions',
    canAdd: true,
    showCompany: true,
  }

  next()
}

async function setCompanyDetails (req, res, next) {
  try {
    const contact = await getContact(req.session.token, req.params.contactId)
    res.locals.company = contact.company
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  setInteractionsDetails,
  setCompanyDetails,
}
