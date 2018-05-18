const { getContact } = require('../../contacts/repos')

function setPropositionsReturnUrl (req, res, next) {
  res.locals.returnLink = `/contacts/${req.params.contactId}/interactions/`
  next()
}

function setPropositionsEntityName (req, res, next) {
  res.locals.entityName = `${res.locals.contact.first_name} ${res.locals.contact.last_name}`
  next()
}

async function setCompanyDetailsWithProposition (req, res, next) {
  try {
    const contact = await getContact(req.session.token, req.params.contactId)
    res.locals.company = contact.company
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  setPropositionsReturnUrl,
  setPropositionsEntityName,
  setCompanyDetailsWithProposition,
}
