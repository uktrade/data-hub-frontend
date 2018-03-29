function renderLinkSubsidiary (req, res, next) {
  const { id: companyId, name: companyName } = res.locals.company

  res
    .breadcrumb(companyName, `/companies/${companyId}`)
    .breadcrumb('Link Subsidiary')
    .render('companies/views/link-subsidiary.njk')
}

module.exports = {
  renderLinkSubsidiary,
}
