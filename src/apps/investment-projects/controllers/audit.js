const { get } = require('lodash')

const { formatLongDate } = require('../../../../common/date')
const { getInvestmentProjectAuditLog } = require('../repos')

function formatAuditLog (logEntry) {
  return {
    name: logEntry.user.name,
    timestamp: formatLongDate(logEntry.timestamp),
    changes: (logEntry.changes && Object.keys(logEntry.changes).length) || 0,
  }
}

async function getInvestmentAudit (req, res, next) {
  try {
    if (get(res, 'locals.projectData')) {
      const rawAuditLog = await getInvestmentProjectAuditLog(req.session.token, req.params.id)
      const auditLog = rawAuditLog.map(formatAuditLog)

      res.locals.title.unshift('Audit history')

      return res.render('investment/audit', {
        currentNavItem: 'audit',
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
