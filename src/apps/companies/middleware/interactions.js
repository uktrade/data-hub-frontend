function setInteractionsDetails (req, res, next) {
  const { company } = res.locals

  res.locals.interactions = {
    view: 'companies/views/interactions',
    returnLink: `/companies/${company.id}/interactions/`,
    entityName: company.name,
    query: { company_id: company.id },
    canAdd: !company.archived,
    showCompany: false,
    breadcrumbs: [
      {
        text: company.name,
        href: `/companies/${company.id}`,
      },
      {
        text: 'Interactions',
        href: `/companies/${company.id}/interactions`,
      },
    ],
  }

  next()
}

module.exports = {
  setInteractionsDetails,
}
