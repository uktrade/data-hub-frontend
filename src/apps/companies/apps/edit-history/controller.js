const { companies } = require('../../../../lib/urls')
const { getCompanyAuditLog } = require('../../repos')
const { transformCompanyAuditLog } = require('./transformers')

async function renderEditHistory (req, res, next) {
  try {
    const { company } = res.locals
    const { token } = req.session

    const companyAuditLog = await getCompanyAuditLog(token, company.id)
    const editHistory = transformCompanyAuditLog(companyAuditLog.results)

    res
      .breadcrumb(company.name, companies.detail(company.id))
      .breadcrumb('Business details', companies.businessDetails(company.id))
      .breadcrumb('Edit History')
      .render('companies/apps/edit-history/views/client-container', {
        props: {
          editHistory,
        },
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEditHistory,
}
