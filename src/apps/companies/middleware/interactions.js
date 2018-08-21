function setInteractionsDetails (req, res, next) {
  res.locals.interactions = {
    returnLink: `/companies/${req.params.companyId}/interactions/`,
    entityName: res.locals.company.name,
    query: `company_id=${req.params.companyId}`,
    view: 'companies/views/interactions',
  }

  next()
}

module.exports = {
  setInteractionsDetails,
}
