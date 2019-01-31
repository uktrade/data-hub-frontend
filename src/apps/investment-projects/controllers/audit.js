const { get, transform } = require('lodash')

const { formatISO8601DateTime } = require('../../../../common/date')
const { getInvestmentProjectAuditLog } = require('../repos')

function grammaticizeBooleanChanges (changeName) {
  const toGrammaticalFormHash = {
    'competitor_countries': 'Is the client considering other countries?',
    'new_tech_to_uk': 'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site?',
    'government_assistance': 'Is this project receiving government financial assistance?',
    'non_fdi_r_and_d_budget': 'Is this project associated with a non-FDI R&D project?',
  }
  return (toGrammaticalFormHash[changeName] || changeName)
}

function transformProjectChangesToListItems (changes) {
  let returnArray = []
  transform(changes, function (result, value, key) {
    let transformedChange = {}
    transformedChange.ChangeName = grammaticizeBooleanChanges(key)
    transformedChange.ChangeFromDesc = value[0]
    transformedChange.ChangeToDesc = value[1]
    returnArray.push(transformedChange)
  }, returnArray)
  return returnArray
}

function formatAuditLog (logEntry) {
  return {
    name: get(logEntry, 'user.name'),
    timestamp: formatISO8601DateTime(logEntry.timestamp),
    changes: transformProjectChangesToListItems(logEntry.changes),
  }
}

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
