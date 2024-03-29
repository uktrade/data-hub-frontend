import {
  buildDatesFilter,
  buildInputFieldFilter,
  buildOptionsFilter,
} from '../../../../../filters'
import { LABELS as COMPANY_LABELS } from '../../../../Companies/CollectionList/constants'
import {
  export_segments,
  export_sub_segments,
} from '../../../../../../apps/companies/apps/edit-company/client/constants'

export const buildSelectedFilters = (queryParams, metadata) => ({
  headquarterTypes: {
    queryParam: 'headquarter_type',
    options: buildOptionsFilter({
      options: metadata.headquarterTypeOptions,
      value: queryParams.headquarter_type,
      categoryLabel: COMPANY_LABELS.headquarterType,
    }),
  },
  name: {
    queryParam: 'name',
    options: buildInputFieldFilter({
      value: queryParams.name,
      categoryLabel: COMPANY_LABELS.companyName,
    }),
  },
  sectors: {
    queryParam: 'sector_descends',
    options: buildOptionsFilter({
      options: metadata.sectorOptions,
      value: queryParams.sector_descends,
      categoryLabel: COMPANY_LABELS.sector,
    }),
  },
  countries: {
    queryParam: 'country',
    options: buildOptionsFilter({
      options: metadata.countryOptions,
      value: queryParams.country,
      categoryLabel: COMPANY_LABELS.country,
    }),
  },
  ukPostcode: {
    queryParam: 'uk_postcode',
    options: buildInputFieldFilter({
      value: queryParams.uk_postcode,
      categoryLabel: COMPANY_LABELS.ukPostcode,
    }),
  },
  ukRegions: {
    queryParam: 'uk_region',
    options: buildOptionsFilter({
      options: metadata.ukRegionOptions,
      value: queryParams.uk_region,
      categoryLabel: COMPANY_LABELS.ukRegion,
    }),
  },
  exportToCountries: {
    queryParam: 'export_to_countries',
    options: buildOptionsFilter({
      options: metadata.countryOptions,
      value: queryParams.export_to_countries,
      categoryLabel: COMPANY_LABELS.currentlyExportingTo,
    }),
  },
  futureCountriesOfInterest: {
    queryParam: 'future_interest_countries',
    options: buildOptionsFilter({
      options: metadata.countryOptions,
      value: queryParams.future_interest_countries,
      categoryLabel: COMPANY_LABELS.futureCountriesOfInterest,
    }),
  },
  lastInteractionDateAfter: {
    queryParam: 'latest_interaction_date_after',
    options: buildDatesFilter({
      value: queryParams.latest_interaction_date_after,
      categoryLabel: COMPANY_LABELS.lastInteractionAfter,
    }),
  },
  lastInteractionDateBefore: {
    queryParam: 'latest_interaction_date_before',
    options: buildDatesFilter({
      value: queryParams.latest_interaction_date_before,
      categoryLabel: COMPANY_LABELS.lastInteractionBefore,
    }),
  },
  exportSegment: {
    queryParam: 'export_segment',
    options: buildOptionsFilter({
      options: export_segments,
      value: queryParams.export_segment,
      categoryLabel: COMPANY_LABELS.exportSegment,
    }),
  },
  exportSubsegment: {
    queryParam: 'export_sub_segment',
    options: buildOptionsFilter({
      options: export_sub_segments,
      value: queryParams.export_sub_segment,
      categoryLabel: COMPANY_LABELS.exportSubsegment,
    }),
  },
})
