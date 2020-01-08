const { get } = require('lodash')

function redirectHandler(req, res, next) {
  const companyId = get(res, 'locals.company.id')

  if (companyId) {
    const { projects } = res.locals.paths
    return res.redirect(`${projects}/create/investment-type/${companyId}`)
  }
  next()
}

function renderCreatePage(req, res) {
  return res
    .breadcrumb('Add investment project')
    .render('investments/views/create/start')
}

module.exports = {
  renderCreatePage,
  redirectHandler,
}
