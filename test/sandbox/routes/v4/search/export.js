var fullExportHistoryPage1 = require('../../../fixtures/v4/export/fullExportHistoryPage1.json')
var fullExportHistoryPage2 = require('../../../fixtures/v4/export/fullExportHistoryPage2.json')
var emptyFullExportHistory = require('../../../fixtures/v4/export/emptyFullExportHistory.json')
var dnbCorp = require('../../../fixtures/v4/company/company-dnb-corp.json')

exports.fetchFullExportHistory = function(req, res) {
  if (req.body.company === dnbCorp.id) {
    if (req.body.offset === 10) {
      return res.json(fullExportHistoryPage2)
    }
    return res.json(fullExportHistoryPage1)
  }
  return res.json(emptyFullExportHistory)
}
