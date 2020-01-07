const { companyDetailsLabels } = require('../labels')

function renderLinkSubsidiary(req, res) {
  const { company } = res.locals

  res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb(companyDetailsLabels.link_subsidiary)
    .render('companies/views/link-subsidiary.njk')
}

module.exports = {
  renderLinkSubsidiary,
}
