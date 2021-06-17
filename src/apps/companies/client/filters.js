import {
  buildOptionsFilter,
  buildInputFieldFilter,
} from '../../../client/filters'
import { LABELS, COMPANY_STATUS_OPTIONS } from './constants'

export const buildSelectedFilters = ({
  queryParams,
  metadata,
  selectedLeadItaOrGlobalAccountManagers,
}) => ({
  selectedCountries: buildOptionsFilter({
    options: metadata.countryOptions,
    value: queryParams.country,
    categoryLabel: LABELS.country,
  }),
  selectedHeadquarterTypes: buildOptionsFilter({
    options: metadata.headquarterTypeOptions,
    value: queryParams.headquarter_type,
    categoryLabel: LABELS.headquarterType,
  }),
  selectedName: buildInputFieldFilter({
    value: queryParams.name,
    categoryLabel: LABELS.companyName,
  }),
  selectedSectors: buildOptionsFilter({
    options: metadata.sectorOptions,
    value: queryParams.sector_descends,
    categoryLabel: LABELS.sector,
  }),
  selectedUkPostcode: buildInputFieldFilter({
    value: queryParams.uk_postcode,
    categoryLabel: LABELS.ukPostcode,
  }),
  selectedUkRegions: buildOptionsFilter({
    options: metadata.ukRegionOptions,
    value: queryParams.uk_region,
    categoryLabel: LABELS.ukRegion,
  }),
  selectedCompanyStatuses: buildOptionsFilter({
    options: COMPANY_STATUS_OPTIONS,
    value: queryParams.archived,
    categoryLabel: LABELS.companyStatus,
  }),
  selectedExportToCountries: buildOptionsFilter({
    options: metadata.countryOptions,
    value: queryParams.export_to_countries,
    categoryLabel: LABELS.currentlyExportingTo,
  }),
  selectedFutureCountriesOfInterest: buildOptionsFilter({
    options: metadata.countryOptions,
    value: queryParams.future_interest_countries,
    categoryLabel: LABELS.futureCountriesOfInterest,
  }),
  selectedLeadItaOrGlobalAccountManagers:
    selectedLeadItaOrGlobalAccountManagers.map(({ advisers }) => ({
      label: advisers.name,
      value: advisers.id,
      categoryLabel: LABELS.leadItaOrGlobalAccountManager,
    })),
})
