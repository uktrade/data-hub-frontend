async function renderOverview(req, res) {
  const { company, dnbRelatedCompaniesCount } = res.locals

  res.render('companies/apps/company-overview/views/client-container', {
    props: {
      company,
      localNavItems: res.locals.localNavItems,
      companyId: company.id,
      dnbRelatedCompaniesCount,
      flashMessages: res.locals.getMessages(),
    },
  })
}

module.exports = {
  renderOverview,
}
