const { get } = require('lodash')

const { formatISO8601DateTime } = require('../../../../common/date')
const { getInvestmentProjectAuditLog } = require('../repos')

function transformProjectChangesToListItems (changes) {
  var embroideredListItems = []
  // embroideredListItems = [{ 'Is govenment_assistance?': 'Yes => No' },
  //   { 'Is client considering other countries?': 'Yes => No' }]
  embroideredListItems = [ { changeName: 'Is govenment_assistance?',
    changeDesc: true },
  { changeName: 'Is client considering other countries?',
    changeDesc: false },
  ]
  return embroideredListItems
} // (logEntry.changes && Object.keys(logEntry.changes).length) || 0,

function formatAuditLog (logEntry) {
  return {
    name: get(logEntry, 'user.name'),
    timestamp: formatISO8601DateTime(logEntry.timestamp),
    changes: transformProjectChangesToListItems(logEntry.changes),
  }
} // Dependent TESTS test/unit/apps/investment-projects/controllers/audit.test.js:66:41)

async function getInvestmentAudit (req, res, next) {
  try {
    if (get(res, 'locals.investment')) {
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
