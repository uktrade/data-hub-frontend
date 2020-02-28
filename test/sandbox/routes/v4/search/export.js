var fullExportHistoryPage1 = require('../../../fixtures/v4/export/full-export-history-page-1.json')
var emptyFullExportHistory = require('../../../fixtures/v4/export/empty-full-export-history.json')
var unkownUserExportHistory = require('../../../fixtures/v4/export/unkown-user-export-history.json')
var updateOnlyExportHistory = require('../../../fixtures/v4/export/update-only-export-history.json')
var dnbCorp = require('../../../fixtures/v4/company/company-dnb-corp.json')
var marsExportsLtd = require('../../../fixtures/v4/company/company-mars-exports-ltd.json')
var dnbSubsidiary = require('../../../fixtures/v4/company/company-dnb-subsidiary.json')

exports.fetchFullExportHistory = function(req, res) {
  if (req.body.company === dnbCorp.id) {
    return res.json(fullExportHistoryPage1)
  }
  if (req.body.company === marsExportsLtd.id) {
    return res.json(unkownUserExportHistory)
  }
  if (req.body.company === dnbSubsidiary.id) {
    return res.json(updateOnlyExportHistory)
  }
  return res.json(emptyFullExportHistory)
}
