var fullExportHistoryPage1 = require('../../../fixtures/v4/export/fullExportHistoryPage1.json')
var fullExportHistoryPage2 = require('../../../fixtures/v4/export/fullExportHistoryPage2.json')
var emptyFullExportHistory = require('../../../fixtures/v4/export/emptyFullExportHistory.json')

exports.fetchFullExportHistory = function(req, res) {
  if (
    req.body.company === 'cc7e2f19-7251-4a41-a27a-f98437720531' &&
    req.query.offset === '0'
  ) {
    return res.json(fullExportHistoryPage1)
  }
  if (
    req.body.company === 'cc7e2f19-7251-4a41-a27a-f98437720531' &&
    req.query.offset === '10'
  ) {
    return res.json(fullExportHistoryPage2)
  }
  return res.json(emptyFullExportHistory)
}
