function setInteractionsDetails(req, res, next) {
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

module.exports = {
  setInteractionsDetails,
}
