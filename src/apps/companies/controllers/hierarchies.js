function renderAddGlobalHQ(req, res) {
  const { company } = res.locals

  res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb('Link Global HQ')
    .render('companies/views/add-global-hq.njk', {
      props: { companyId: company.id, companyName: company.name },
    })
}

module.exports = {
  renderAddGlobalHQ,
}
