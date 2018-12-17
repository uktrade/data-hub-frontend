function setInteractionsDetails (req, res, next) {
  const { company } = res.locals
  const view = company.duns_number ? 'companies/views/interactions' : 'companies/views/_deprecated/interactions'

  res.locals.interactions = {
    view,
    returnLink: `/companies/${company.id}/interactions/`,
    entityName: company.name,
    query: { company_id: company.id },
    canAdd: !company.archived,
  }

  next()
}

module.exports = {
  setInteractionsDetails,
}
