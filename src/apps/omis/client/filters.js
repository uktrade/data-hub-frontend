import {
  buildOptionsFilter,
  buildInputFieldFilter,
} from '../../../client/filters'

import { LABELS } from './constants'

export const buildSelectedFilters = (queryParams, metadata, statusOptions) => ({
  selectedStatuses: buildOptionsFilter({
    options: statusOptions,
    value: queryParams.status,
    categoryLabel: LABELS.status,
  }),
  selectedCompanyName: buildInputFieldFilter({
    value: queryParams.company_name,
    categoryLabel: LABELS.companyName,
  }),
  selectedContactName: buildInputFieldFilter({
    value: queryParams.contact_name,
    categoryLabel: LABELS.contactName,
  }),
  selectedSectors: buildOptionsFilter({
    options: metadata.sectorOptions,
    value: queryParams.sector_descends,
    categoryLabel: LABELS.sector,
  }),
  selectedPrimaryMarkets: buildOptionsFilter({
    options: metadata.countryOptions,
    value: queryParams.primary_market,
    categoryLabel: LABELS.country,
  }),
  selectedUkRegions: buildOptionsFilter({
    options: metadata.ukRegionOptions,
    value: queryParams.uk_region,
    categoryLabel: LABELS.ukRegion,
  }),
})
