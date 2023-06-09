function renderProjects(req, res) {
  const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals
  res.locals.title = `Investments - ${company.name} - Companies`

  res.render('companies/apps/investments/projects/views/list', {
    props: {
      companyId: company.id,
      returnUrl,
      dnbRelatedCompaniesCount,
      localNavItems: res.locals.localNavItems,
    },
  })
}

module.exports = renderProjects
