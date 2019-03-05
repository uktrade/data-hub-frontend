const { companyDetailsLabels } = require('../labels')

function renderLinkSubsidiary (req, res) {
  const { company, features } = res.locals
  const view = features['companies-new-layout']
    ? 'companies/views/link-subsidiary.njk'
    : 'companies/views/_deprecated/link-subsidiary.njk'

  res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb(companyDetailsLabels.link_subsidiary)
    .render(view)
}

module.exports = {
  renderLinkSubsidiary,
}
