const { get, transform } = require('lodash')

const { formatISO8601DateTime } = require('../../../../common/date')
const { getInvestmentProjectAuditLog } = require('../repos')

function grammaticizeBooleanChanges (changeName) {
  const toGrammaticalFormHash = {
    'competitor_countries': 'Is the client considering other countries?',
    // '': 'Has the UK location for this investment been decided yet?',
    // '': 'Can client provide total investment value?',
    'new_tech_to_uk': 'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site?',
    'government_assistance': 'Is this project receiving government financial assistance?',
    'non_fdi_r_and_d_budget': 'Is this project associated with a non-FDI R&D project?',
  }
  return (toGrammaticalFormHash[changeName] || changeName)
}

function transformProjectChangesToListItems (changes) {
  // const key = Object.keys(changes)
  // console.log(key)
  // console.log(Object.prototype.toString.call(changes[key]))
  // if (Object.prototype.toString.call(changes[key]) === '[object Array]') { console.log('length %d', changes[key].length) console.log('    ' + changes[key][0]) console.log('    ' + changes[key][1]) }
  let returnArray = []
  transform(changes, function (result, value, key) {
    let transformedChange = {}
    transformedChange.ChangeName = grammaticizeBooleanChanges(key)
    transformedChange.ChangeFromDesc = value.shift()
    transformedChange.ChangeToDesc = value.shift()
    returnArray.push(transformedChange)
  }, returnArray)
  // console.log(returnArray[0])
  return returnArray
}

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
