const { companies } = require('../../../../lib/urls')

async function renderFindCompanyForm(req, res, next) {
  try {
    const { company } = res.locals

    res
      .breadcrumb(company.name, companies.detail(company.id))
      .breadcrumb('Find this company record')
      .render('companies/apps/match-company/views/find-company', {
        props: {},
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderFindCompanyForm,
}
