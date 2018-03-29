function renderLinkSubsidiary (req, res, next) {
  const { id: companyId, name: companyName } = res.locals.company
  const { companyDetailsLabels } = require('../labels')

  res
    .breadcrumb(companyName, `/companies/${companyId}`)
    .breadcrumb(companyDetailsLabels.link_subsidiary)
    .render('companies/views/link-subsidiary.njk')
}

module.exports = {
  renderLinkSubsidiary,
}
