function renderOrders(req, res) {
  const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals

  res.locals.title = `Orders - ${company.name} - Companies`

  res.render('companies/views/orders', {
    props: {
      companyId: company.id,
      returnUrl,
      dnbRelatedCompaniesCount,
      localNavItems: res.locals.localNavItems,
    },
  })
}

module.exports = {
  renderOrders,
}
