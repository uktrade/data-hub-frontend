import {
  buildDatesFilter,
  buildInputFieldFilter,
  buildOptionsFilter,
} from '../../../filters'
import { LABELS } from './constants'

export const buildSelectedFilters = (
  queryParams,
  metadata,
  selectedOrganisers
) => ({
  name: {
    queryParam: 'name',
    options: buildInputFieldFilter({
      value: queryParams.name,
      categoryLabel: LABELS.eventName,
    }),
  },
  organisers: {
    queryParam: 'organiser',
    options: selectedOrganisers.map((adviser) => ({
      label: adviser.name,
      value: adviser.id,
      categoryLabel: LABELS.organiser,
    })),
  },
  startDateAfter: {
    queryParam: 'start_date_after',
    options: buildDatesFilter({
      value: queryParams.start_date_after,
      categoryLabel: LABELS.startDateAfter,
    }),
  },
  startDateBefore: {
    queryParam: 'start_date_before',
    options: buildDatesFilter({
      value: queryParams.start_date_before,
      categoryLabel: LABELS.startDateBefore,
    }),
  },
  countries: {
    queryParam: 'address_country',
    options: buildOptionsFilter({
      options: metadata.countryOptions,
      value: queryParams.address_country,
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
  eventTypes: {
    queryParam: 'event_type',
    options: buildOptionsFilter({
      options: metadata.eventTypeOptions,
      value: queryParams.event_type,
      categoryLabel: LABELS.eventType,
    }),
  },
  relatedProgrammes: {
    queryParam: 'related_programmes',
    options: buildOptionsFilter({
      options: metadata.relatedProgrammeOptions,
      value: queryParams.related_programmes,
      categoryLabel: LABELS.relatedProgrammes,
    }),
  },
})
