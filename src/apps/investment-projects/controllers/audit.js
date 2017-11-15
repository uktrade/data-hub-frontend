const { get } = require('lodash')

const { formatLongDate } = require('../../../../common/date')
const { getInvestmentProjectAuditLog } = require('../repos')

function formatAuditLog (logEntry) {
  return {
    name: get(logEntry, 'user.name'),
    timestamp: formatLongDate(logEntry.timestamp),
    changes: (logEntry.changes && Object.keys(logEntry.changes).length) || 0,
  }
}

async function getInvestmentAudit (req, res, next) {
  try {
    if (get(res, 'locals.investmentData')) {
      const rawAuditLog = await getInvestmentProjectAuditLog(req.session.token, req.params.investmentId)
      const auditLog = rawAuditLog.map(formatAuditLog)

      return res
        .breadcrumb('Audit history')
        .render('investment-projects/views/audit', {
          auditLog,
        })
    }

    return next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getInvestmentAudit,
  formatAuditLog,
}
