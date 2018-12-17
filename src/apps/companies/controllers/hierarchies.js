function renderAddGlobalHQ (req, res, next) {
  const { id: companyId, name: companyName } = res.locals.company

  res
    .breadcrumb(companyName, `/companies/${companyId}`)
    .breadcrumb('Link Global HQ')
    .render('companies/views/_deprecated/add-global-hq.njk')
}

module.exports = {
  renderAddGlobalHQ,
}
