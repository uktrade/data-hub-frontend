function renderAddGlobalHQ (req, res) {
  const { company, features } = res.locals
  const view = features['companies-new-layout']
    ? 'companies/views/add-global-hq.njk'
    : 'companies/views/_deprecated/add-global-hq.njk'

  res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb('Link Global HQ')
    .render(view)
}

module.exports = {
  renderAddGlobalHQ,
}
