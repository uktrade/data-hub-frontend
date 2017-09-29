const { assign, get } = require('lodash')

const companyFormattingService = require('../services/formatting')

function renderForm (req, res) {
  const pageTitle = res.locals.company ? 'Edit' : 'Add company'
  let isForeign = false

  if (res.locals.company) {
    res.breadcrumb(get(res.locals, 'company.name'), `/companies/${get(res.locals, 'company.id')}`)
    isForeign = !(get(res.locals, 'company.uk_based'))
  }

  if (req.query.country === 'non-uk') {
    isForeign = true
  }

  if (res.locals.companiesHouseRecord) {
    res.locals = assign({}, res.locals, {
      isCompaniesHouse: true,
      chDetails: companyFormattingService.getDisplayCH(res.locals.companiesHouseRecord),
    })
  }

  res
    .breadcrumb(pageTitle)
    .render('companies/views/edit', {
      isForeign,
      isCompaniesHouse: true,
    })
}

module.exports = {
  renderForm,
}
