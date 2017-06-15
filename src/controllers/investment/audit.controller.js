const router = require('express').Router()
const Q = require('q')
const { get } = require('lodash')

const { getProjectDetails } = require('./shared.middleware')
const { formatLongDate } = require('../../lib/date')
const { getInvestmentProjectAuditLog } = require('../../repos/investment.repo')

function formatAuditLog (logEntry) {
  return {
    name: logEntry.user.name,
    timestamp: formatLongDate(logEntry.timestamp),
    changes: (logEntry.changes && Object.keys(logEntry.changes).length) || 0,
  }
}

function getInvestmentAudit (req, res, next) {
  Q.spawn(function * () {
    try {
      if (get(res, 'locals.projectData')) {
        const rawAuditLog = yield getInvestmentProjectAuditLog(req.session.token, req.params.id)
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
  })
}

router.param('id', getProjectDetails)
router.get('/:id/audit', getInvestmentAudit)

module.exports = {
  router,
  getInvestmentAudit,
  formatAuditLog,
}
