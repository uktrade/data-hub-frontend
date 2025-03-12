import fullExportHistoryPage1 from '../../../fixtures/v4/export/full-export-history-page-1.json' with { type: 'json' }
import emptyFullExportHistory from '../../../fixtures/v4/export/empty-full-export-history.json' with { type: 'json' }
import unkownUserExportHistory from '../../../fixtures/v4/export/unkown-user-export-history.json' with { type: 'json' }
import updateOnlyExportHistory from '../../../fixtures/v4/export/update-only-export-history.json' with { type: 'json' }
import countryExportHistory from '../../../fixtures/v4/export/country-export-history.json' with { type: 'json' }
import exportHistoryWithInteractions from '../../../fixtures/v4/export/history-with-interactions.json' with { type: 'json' }
import exportHistoryGroups from '../../../fixtures/v4/export/history-groups.json' with { type: 'json' }
import historyGroupsWithNullUsers from '../../../fixtures/v4/export/history-groups-null-users.json' with { type: 'json' }
import dnbCorp from '../../../fixtures/v4/company/company-dnb-corp.json' with { type: 'json' }
import marsExportsLtd from '../../../fixtures/v4/company/company-mars-exports-ltd.json' with { type: 'json' }
import dnbSubsidiary from '../../../fixtures/v4/company/company-dnb-subsidiary.json' with { type: 'json' }
import investigationLtd from '../../../fixtures/v4/company/company-investigation-ltd.json' with { type: 'json' }
import globalUltimate from '../../../fixtures/v4/company/company-dnb-global-ultimate.json' with { type: 'json' }
import minimallyMinimal from '../../../fixtures/v4/company/company-minimally-minimal.json' with { type: 'json' }

export const fetchExportHistory = function (req, res) {
  var companyId = req.body.company

  if (req.body.country === '975f66a0-5d95-e211-a939-e4115bead28a') {
    return res.json(countryExportHistory)
  }

  if (companyId === dnbCorp.id) {
    return res.json(fullExportHistoryPage1)
  }
  if (companyId === marsExportsLtd.id) {
    return res.json(unkownUserExportHistory)
  }
  if (companyId === dnbSubsidiary.id) {
    return res.json(updateOnlyExportHistory)
  }
  if (companyId === investigationLtd.id) {
    return res.json(exportHistoryWithInteractions)
  }
  if (companyId === globalUltimate.id) {
    return res.json(exportHistoryGroups)
  }
  if (companyId === minimallyMinimal.id) {
    return res.json(historyGroupsWithNullUsers)
  }

  return res.json(emptyFullExportHistory)
}
