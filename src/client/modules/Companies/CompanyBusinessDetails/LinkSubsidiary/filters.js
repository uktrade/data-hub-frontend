import { buildOptionsFilter, buildInputFieldFilter } from '../../../../filters'

import { LABELS } from '../../CollectionList/constants'

export const buildSelectedFilters = (queryParams, metadata) => ({
  name: {
    queryParam: 'name',
    options: buildInputFieldFilter({
      value: queryParams.name,
      categoryLabel: LABELS.companyName,
    }),
  },
  companyNumber: {
    queryParam: 'company_number',
    options: buildInputFieldFilter({
      value: queryParams.company_number,
      categoryLabel: LABELS.companyNumber,
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
})
