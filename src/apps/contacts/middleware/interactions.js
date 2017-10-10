const { getContact } = require('../../contacts/repos')

function setInteractionsReturnUrl (req, res, next) {
  res.locals.returnLink = `/contacts/${req.params.contactId}/interactions/`
  next()
}

function setInteractionsEntityName (req, res, next) {
  res.locals.entityName = `${res.locals.contact.first_name} ${res.locals.contact.last_name}`
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
  setInteractionsReturnUrl,
  setInteractionsEntityName,
  setCompanyDetails,
}
