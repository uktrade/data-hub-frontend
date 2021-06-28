import {
  buildOptionsFilter,
  buildInputFieldFilter,
  buildDatesFilter,
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
  selectedCompletedOnAfter: buildDatesFilter({
    value: queryParams.completed_on_after,
    categoryLabel: LABELS.completedOnAfter,
  }),
  selectedCompletedOnBefore: buildDatesFilter({
    value: queryParams.completed_on_before,
    categoryLabel: LABELS.completedOnBefore,
  }),
  selectedDeliveryDateAfter: buildDatesFilter({
    value: queryParams.delivery_date_after,
    categoryLabel: LABELS.deliveryDateAfter,
  }),
  selectedDeliveryDateBefore: buildDatesFilter({
    value: queryParams.delivery_date_before,
    categoryLabel: LABELS.deliveryDateBefore,
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
