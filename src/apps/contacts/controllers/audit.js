const { formatLongDate } = require('../../../../common/date')
const { getContactAuditLog } = require('../repos')

function formatAuditLog (logEntry) {
  return {
    name: logEntry.user.name,
    timestamp: formatLongDate(logEntry.timestamp),
    changes: (logEntry.changes && Object.keys(logEntry.changes).length) || 0,
  }
}

async function getAudit (req, res, next) {
  try {
    const rawAuditLog = await getContactAuditLog(req.session.token, req.params.contactId)
    const auditLog = rawAuditLog.map(formatAuditLog)

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
  formatAuditLog,
}
