const { getCompanyAuditLog, getDitCompany } = require('../repos')
const { getCommonTitlesAndlinks } = require('../services/data')
const { transformAuditLogToCollection } = require('../../audit/transformers')
const { companyDetailsLabels } = require('../labels')

async function getAudit (req, res, next) {
  try {
    const token = req.session.token
    const companyId = req.params.id
    const page = req.query.page || 1

    const company = await getDitCompany(token, companyId)
    getCommonTitlesAndlinks(req, res, company)

    const auditLog = await getCompanyAuditLog(token, companyId, page)
      .then(result => transformAuditLogToCollection(result, companyDetailsLabels))

    return res
      .breadcrumb('Audit history')
      .render('companies/views/audit', {
        tab: 'audit',
        company,
        auditLog,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAudit,
}
