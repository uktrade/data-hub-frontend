import {
  export_segments,
  export_sub_segments,
} from '../../../../apps/companies/apps/edit-company/client/constants'
import {
  buildDatesFilter,
  buildOptionsFilter,
  buildInputFieldFilter,
} from '../../../filters'

import { LABELS, COMPANY_STATUS_OPTIONS, COMPANY_HAS_NAME } from './constants'

export const buildSelectedFilters = (
  queryParams,
  metadata,
  selectedLeadItaOrGlobalAccountManagers,
  advisers
) => ({
  headquarterTypes: {
    queryParam: 'headquarter_type',
    options: buildOptionsFilter({
      options: metadata.headquarterTypeOptions,
      value: queryParams.headquarter_type,
      categoryLabel: LABELS.headquarterType,
    }),
  },
  name: {
    queryParam: 'name',
    options: buildInputFieldFilter({
      value: queryParams.name,
      categoryLabel: LABELS.companyName,
    }),
  },
  sectors: {
    queryParam: 'sector_descends',
    options: buildOptionsFilter({
      options: metadata.sectorOptions,
      value: queryParams.sector_descends,
      categoryLabel: LABELS.sector,
    }),
  },
  subSectors: {
    queryParam: 'sub_sector_descends',
    options: buildOptionsFilter({
      options: metadata.subSectorOptions,
      value: queryParams.sub_sector_descends,
      categoryLabel: LABELS.subSector,
    }),
  },
  countries: {
    queryParam: 'country',
    options: buildOptionsFilter({
      options: metadata.countryOptions,
      value: queryParams.country,
      categoryLabel: LABELS.country,
    }),
  },
  ukPostcode: {
    queryParam: 'uk_postcode',
    options: buildInputFieldFilter({
      value: queryParams.uk_postcode,
      categoryLabel: LABELS.ukPostcode,
    }),
  },
  ukRegions: {
    queryParam: 'uk_region',
    options: buildOptionsFilter({
      options: metadata.ukRegionOptions,
      value: queryParams.uk_region,
      categoryLabel: LABELS.ukRegion,
    }),
  },
  usStates: {
    queryParam: 'us_state',
    options: buildOptionsFilter({
      options: metadata.usStateOptions,
      value: queryParams.us_state,
      categoryLabel: LABELS.usState,
    }),
  },
  canadianProvinces: {
    queryParam: 'canadian_province',
    options: buildOptionsFilter({
      options: metadata.canadianProvinceOptions,
      value: queryParams.canadian_province,
      categoryLabel: LABELS.canadianProvince,
    }),
  },
  companyStatuses: {
    queryParam: 'archived',
    options: buildOptionsFilter({
      options: COMPANY_STATUS_OPTIONS,
      value: queryParams.archived,
      categoryLabel: LABELS.companyStatus,
    }),
  },
  companyHasName: {
    queryParam: 'has_name',
    options: buildOptionsFilter({
      options: COMPANY_HAS_NAME,
      value: queryParams.has_name,
      categoryLabel: LABELS.hasName,
    }),
  },
  exportToCountries: {
    queryParam: 'export_to_countries',
    options: buildOptionsFilter({
      options: metadata.countryOptions,
      value: queryParams.export_to_countries,
      categoryLabel: LABELS.currentlyExportingTo,
    }),
  },
  futureCountriesOfInterest: {
    queryParam: 'future_interest_countries',
    options: buildOptionsFilter({
      options: metadata.countryOptions,
      value: queryParams.future_interest_countries,
      categoryLabel: LABELS.futureCountriesOfInterest,
    }),
  },
  lastInteractionDateAfter: {
    queryParam: 'latest_interaction_date_after',
    options: buildDatesFilter({
      value: queryParams.latest_interaction_date_after,
      categoryLabel: LABELS.lastInteractionAfter,
    }),
  },
  lastInteractionDateBefore: {
    queryParam: 'latest_interaction_date_before',
    options: buildDatesFilter({
      value: queryParams.latest_interaction_date_before,
      categoryLabel: LABELS.lastInteractionBefore,
    }),
  },
  leadItaOrGlobalAccountManagers: {
    queryParam: 'one_list_group_global_account_manager',
    options: selectedLeadItaOrGlobalAccountManagers.map((adviser) => ({
      label: adviser.name,
      value: adviser.id,
      categoryLabel: LABELS.leadItaOrGlobalAccountManager,
    })),
  },
  advisers: {
    queryParam: 'adviser',
    options: advisers.map((adviser) => ({
      label: adviser.name,
      value: adviser.id,
      categoryLabel: LABELS.adviser,
    })),
  },
  exportSegment: {
    queryParam: 'export_segment',
    options: buildOptionsFilter({
      options: export_segments,
      value: queryParams.export_segment,
      categoryLabel: LABELS.exportSegment,
    }),
  },
  exportSubsegment: {
    queryParam: 'export_sub_segment',
    options: buildOptionsFilter({
      options: export_sub_segments,
      value: queryParams.export_sub_segment,
      categoryLabel: LABELS.exportSubsegment,
    }),
  },
})
