const { getCompanyAuditLog } = require('../repos')
const { transformAuditLogToListItem } = require('../../audit/transformers')
const { companyDetailsLabels } = require('../labels')
const { transformApiResponseToCollection } = require('../../transformers')

async function renderAuditLog (req, res, next) {
  const token = req.session.token
  const page = req.query.page || 1
  const { id, name } = res.locals.company

  try {
    const auditLog = await getCompanyAuditLog(token, id, page)
      .then(transformApiResponseToCollection(
        { entityType: 'audit' },
        transformAuditLogToListItem(companyDetailsLabels)
      ))

    res
      .breadcrumb(name, `/companies/${id}`)
      .breadcrumb('Audit history')
      .render('companies/views/audit', {
        auditLog,
        tab: 'audit', // TODO: Use newer local nav macro to remove need for this
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAuditLog,
}
