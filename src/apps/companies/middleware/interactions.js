function setInteractionsDetails (req, res, next) {
  const { company } = res.locals

  res.locals.interactions = {
    view: 'companies/views/interactions',
    returnLink: `/companies/${company.id}/interactions/`,
    entityName: company.name,
    query: { company_id: company.id },
    canAdd: !company.archived,
    showCompany: false,
  }

  next()
}

module.exports = {
  setInteractionsDetails,
}
