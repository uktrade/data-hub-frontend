import { exportDetailsLabels, exportPotentialLabels } from './labels'
import groupExportCountries from '../../../../lib/group-export-countries'
import { EXPORT_INTEREST_STATUS } from '../../../../common/constants'
import { transformArrayIdNameToValueLabel } from '../../../transformers'

export const buildExportPotential = (company) => {
  const exportPotentialValue = exportPotentialLabels[company.exportPotential]
  return exportPotentialValue?.text
    ? exportPotentialValue && exportPotentialValue.text
    : 'No score given'
}

export const buildExportPotentialLastModified = (company) => {
  return company.lastModifiedPotential
    ? new Date(company.lastModifiedPotential).toISOString().split('T')[0]
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

const getCountriesFields = (companyExportCountries) => {
  const groupedExportCountries = groupExportCountries(companyExportCountries)

  return {
    exportToCountries:
      groupedExportCountries[EXPORT_INTEREST_STATUS.EXPORTING_TO],
    futureInterestCountries:
      groupedExportCountries[EXPORT_INTEREST_STATUS.FUTURE_INTEREST],
    noInterestCountries:
      groupedExportCountries[EXPORT_INTEREST_STATUS.NOT_INTERESTED],
  }
}

export const transformExportCountries = (companyExportCountries) => {
  const { exportToCountries, futureInterestCountries, noInterestCountries } =
    getCountriesFields(companyExportCountries)

  return [
    {
      name: exportDetailsLabels.exportToCountries,
      values: exportToCountries,
    },
    {
      name: exportDetailsLabels.futureInterestCountries,
      values: futureInterestCountries,
    },
    {
      name: exportDetailsLabels.noInterestCountries,
      values: noInterestCountries,
    },
  ]
}
