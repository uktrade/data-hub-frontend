function setInteractionsReturnUrl (req, res, next) {
  res.locals.returnLink = `/companies/${req.params.companyId}/interactions/`
  next()
}

function setInteractionsEntityName (req, res, next) {
  res.locals.entityName = res.locals.company.name
  next()
}

module.exports = {
  setInteractionsReturnUrl,
  setInteractionsEntityName,
}
