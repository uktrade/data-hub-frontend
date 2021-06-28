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
  selectedOrderReference: buildInputFieldFilter({
    value: queryParams.reference,
    categoryLabel: LABELS.reference,
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
  selectedOmisMarkets: buildOptionsFilter({
    options: metadata.omisMarketOptions,
    value: queryParams.primary_market,
    categoryLabel: LABELS.country,
  }),
  selectedUkRegions: buildOptionsFilter({
    options: metadata.ukRegionOptions,
    value: queryParams.uk_region,
    categoryLabel: LABELS.ukRegion,
  }),
})
