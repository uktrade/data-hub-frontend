function renderAddGlobalHQ(req, res) {
  const { company } = res.locals

  res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb('Link Global HQ')
    .render('companies/views/add-global-hq.njk')
}

module.exports = {
  renderAddGlobalHQ,
}
