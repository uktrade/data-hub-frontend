import fullExportHistoryPage1 from '../../../fixtures/v4/export/fullExportHistoryPage1.json'
import fullExportHistoryPage2 from '../../../fixtures/v4/export/fullExportHistoryPage2.json'
import emptyFullExportHistory from '../../../fixtures/v4/export/emptyFullExportHistory.json'
import { dnbCorp } from '../../../../functional/cypress/fixtures'

exports.fetchFullExportHistory = function(req, res) {
  if (req.body.company === dnbCorp.id && req.body.offset === 0) {
    return res.json(fullExportHistoryPage1)
  }
  if (req.body.company === dnbCorp.id && req.body.offset === 10) {
    return res.json(fullExportHistoryPage2)
  }
  return res.json(emptyFullExportHistory)
}
