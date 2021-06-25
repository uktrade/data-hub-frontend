import {
  buildInputFieldFilter,
  buildOptionsFilter,
} from '../../../client/filters'
import { LABELS } from './constants'

export const buildSelectedFilters = ({
  queryParams,
  metadata,
  selectedOrganisers,
}) => ({
  selectedName: buildInputFieldFilter({
    value: queryParams.name,
    categoryLabel: LABELS.eventName,
  }),
  selectedOrganisers: selectedOrganisers.map(({ advisers }) => ({
    label: advisers.name,
    value: advisers.id,
    categoryLabel: LABELS.organiser,
  })),
  selectedCountries: buildOptionsFilter({
    options: metadata.countryOptions,
    value: queryParams.country,
    categoryLabel: LABELS.country,
  }),
  selectedUkRegions: buildOptionsFilter({
    options: metadata.ukRegionOptions,
    value: queryParams.uk_region,
    categoryLabel: LABELS.ukRegion,
  }),
  selectedEventTypes: buildOptionsFilter({
    options: metadata.eventTypeOptions,
    value: queryParams.event_type,
    categoryLabel: LABELS.eventType,
  }),
})
