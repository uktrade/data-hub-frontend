import {
  exportDetailsLabels,
  exportPotentialLabels,
} from '../../../../apps/companies/labels'
import groupExportCountries from '../../../../lib/group-export-countries'
import { EXPORT_INTEREST_STATUS } from '../../../../common/constants'
import { transformArrayIdNameToValueLabel } from '../../../transformers'

export const buildExportPotential = (company) => {
  const exportPotentialValue = exportPotentialLabels[company.exportPotential]
  return exportPotentialValue?.text
    ? exportPotentialValue && exportPotentialValue.text
    : 'No score given'
}

export const transformCountriesForTypeahead = (exportCountries) => {
  const groupedExportCountries = groupExportCountries(exportCountries)
  return [
    {
      name: EXPORT_INTEREST_STATUS.EXPORTING_TO,
      label: exportDetailsLabels.exportToCountries,
      values: transformArrayIdNameToValueLabel(
        groupedExportCountries[EXPORT_INTEREST_STATUS.EXPORTING_TO]
      ),
    },
    {
      name: EXPORT_INTEREST_STATUS.FUTURE_INTEREST,
      label: exportDetailsLabels.futureInterestCountries,
      values: transformArrayIdNameToValueLabel(
        groupedExportCountries[EXPORT_INTEREST_STATUS.FUTURE_INTEREST]
      ),
    },
    {
      name: EXPORT_INTEREST_STATUS.NOT_INTERESTED,
      label: exportDetailsLabels.noInterestCountries,
      values: transformArrayIdNameToValueLabel(
        groupedExportCountries[EXPORT_INTEREST_STATUS.NOT_INTERESTED]
      ),
    },
  ]
}
