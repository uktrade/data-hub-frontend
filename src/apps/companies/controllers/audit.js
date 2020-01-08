const { getCompanyAuditLog } = require('../repos')
const { transformAuditLogToListItem } = require('../../audit/transformers')
const { companyDetailsLabels } = require('../labels')
const {
  transformApiResponseToCollection,
} = require('../../../modules/api/transformers')

async function renderAuditLog(req, res, next) {
  const token = req.session.token
  const page = req.query.page || 1
  const { company } = res.locals
  try {
    const auditLog = await getCompanyAuditLog(token, company.id, page).then(
      transformApiResponseToCollection(
        {},
        transformAuditLogToListItem(companyDetailsLabels)
      )
    )

    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb(
        'Business details',
        `/companies/${company.id}/business-details`
      )
      .breadcrumb('Audit history')
      .render('companies/views/audit', {
        auditLog,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAuditLog,
}
