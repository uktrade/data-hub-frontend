function renderInvestments(req, res) {
  const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals
  res.locals.title = `Investments - ${company.name} - Companies`

  res.render('companies/apps/investments/views/investment', {
    props: {
      companyId: company.id,
      returnUrl,
      dnbRelatedCompaniesCount,
      localNavItems: res.locals.localNavItems,
    },
  })
}

module.exports = renderInvestments
