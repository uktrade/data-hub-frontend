import { buildOptionsFilter, buildInputFieldFilter } from '../../../filters'

import { STATUS_OPTIONS, LABELS } from './constants'

export const buildSelectedFilters = (queryParams, metadata) => ({
  name: {
    queryParam: 'name',
    options: buildInputFieldFilter({
      value: queryParams.name,
      label: queryParams.name,
      categoryLabel: LABELS.contactName,
    }),
  },
  companyName: {
    queryParam: 'company_name',
    options: buildInputFieldFilter({
      value: queryParams.company_name,
      categoryLabel: LABELS.companyName,
    }),
  },
  companySectors: {
    queryParam: 'company_sector_descends',
    options: buildOptionsFilter({
      options: metadata.sectorOptions,
      value: queryParams.company_sector_descends,
      categoryLabel: LABELS.sector,
    }),
  },
  addressCountries: {
    queryParam: 'address_country',
    options: buildOptionsFilter({
      options: metadata.countryOptions,
      value: queryParams.address_country,
      categoryLabel: LABELS.country,
    }),
  },
  companyUkRegions: {
    queryParam: 'company_uk_region',
    options: buildOptionsFilter({
      options: metadata.ukRegionOptions,
      value: queryParams.company_uk_region,
      categoryLabel: LABELS.ukRegion,
    }),
  },
  statuses: {
    queryParam: 'archived',
    options: buildOptionsFilter({
      options: STATUS_OPTIONS,
      value: queryParams.archived,
      categoryLabel: LABELS.status,
    }),
  },
})
