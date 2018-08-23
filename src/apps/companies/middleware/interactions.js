function setInteractionsDetails (req, res, next) {
  res.locals.interactions = {
    returnLink: `/companies/${req.params.companyId}/interactions/`,
    entityName: res.locals.company.name,
    query: { company_id: req.params.companyId },
    view: 'companies/views/interactions',
    canAdd: !res.locals.company.archived,
  }

  next()
}

module.exports = {
  setInteractionsDetails,
}
