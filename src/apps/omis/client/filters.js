import {
  buildOptionsFilter,
  buildInputFieldFilter,
  buildDatesFilter,
} from '../../../client/filters'

import { LABELS, STATUSES } from './constants'

export const buildSelectedFilters = (queryParams, metadata) => ({
  statuses: {
    queryParam: 'status',
    options: buildOptionsFilter({
      options: STATUSES,
      value: queryParams.status,
      categoryLabel: LABELS.status,
    }),
  },
  orderReference: {
    queryParam: 'reference',
    options: buildInputFieldFilter({
      value: queryParams.reference,
      categoryLabel: LABELS.reference,
    }),
  },
  completedOnAfter: {
    queryParam: 'completed_on_after',
    options: buildDatesFilter({
      value: queryParams.completed_on_after,
      categoryLabel: LABELS.completedOnAfter,
    }),
  },
  completedOnBefore: {
    queryParam: 'completed_on_before',
    options: buildDatesFilter({
      value: queryParams.completed_on_before,
      categoryLabel: LABELS.completedOnBefore,
    }),
  },
  deliveryDateAfter: {
    queryParam: 'delivery_date_after',
    options: buildDatesFilter({
      value: queryParams.delivery_date_after,
      categoryLabel: LABELS.deliveryDateAfter,
    }),
  },
  deliveryDateBefore: {
    queryParam: 'delivery_date_before',
    options: buildDatesFilter({
      value: queryParams.delivery_date_before,
      categoryLabel: LABELS.deliveryDateBefore,
    }),
  },
  companyName: {
    queryParam: 'company_name',
    options: buildInputFieldFilter({
      value: queryParams.company_name,
      categoryLabel: LABELS.companyName,
    }),
  },
  selectedContactName: {
    queryParam: 'contact_name',
    options: buildInputFieldFilter({
      value: queryParams.contact_name,
      categoryLabel: LABELS.contactName,
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
  omisMarkets: {
    queryParam: 'primary_market',
    options: buildOptionsFilter({
      options: metadata.omisMarketOptions,
      value: queryParams.primary_market,
      categoryLabel: LABELS.country,
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
})
