const { companies } = require('../../../../lib/urls')
const { getCompanyAuditLog } = require('../../repos')
const { transformCompanyAuditLog } = require('./transformers')

function renderEditHistory(req, res) {
  const { company } = res.locals

  res
    .breadcrumb(company.name, companies.detail(company.id))
    .breadcrumb('Business details', companies.businessDetails(company.id))
    .breadcrumb('Edit History')
    .render('companies/apps/edit-history/views/client-container', {
      props: {
        dataEndpoint: companies.editHistory.data(company.id),
      },
    })
}

async function fetchCompanyAuditLog(req, res, next) {
  try {
    const { company } = res.locals
    const { page } = req.query

    const { results, count } = await getCompanyAuditLog(req, company.id, page)

    res.json({
      results: transformCompanyAuditLog(results),
      count,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEditHistory,
  fetchCompanyAuditLog,
}
