const { getContactAuditLog } = require('../repos')
const { transformAuditLogToCollection } = require('../../audit/transformers')
const { contactDetailsLabels } = require('../labels')

async function getAudit (req, res, next) {
  try {
    const auditLog = await getContactAuditLog(req.session.token, req.params.contactId)
      .then(result => transformAuditLogToCollection(result, contactDetailsLabels))

    return res
      .breadcrumb('Audit history')
      .render('contacts/views/audit', {
        auditLog,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAudit,
}
