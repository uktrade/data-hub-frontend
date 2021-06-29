import { KIND_OPTIONS, LABELS } from './constants'

import { buildOptionsFilter, buildDatesFilter } from '../../../client/filters'

export const buildSelectedFilters = (
  queryParams,
  metadata,
  selectedAdvisers
) => ({
  selectedKind: buildOptionsFilter({
    options: KIND_OPTIONS,
    value: queryParams.kind,
    categoryLabel: LABELS.kind,
  }),
  selectedAdvisers: selectedAdvisers.map(({ advisers }) => ({
    label: advisers.name,
    value: advisers.id,
    categoryLabel: LABELS.advisers,
  })),
  selectedMyInteractions: selectedAdvisers.map(({ advisers }) => ({
    label: advisers.name,
    value: advisers.id,
    categoryLabel: LABELS.advisers,
  })),
  selectedDatesAfter: buildDatesFilter({
    value: queryParams.date_after,
    categoryLabel: LABELS.dateAfter,
  }),
  selectedDatesBefore: buildDatesFilter({
    value: queryParams.date_before,
    categoryLabel: LABELS.dateBefore,
  }),
  selectedService: buildOptionsFilter({
    options: metadata.serviceOptions,
    value: queryParams.service,
    categoryLabel: LABELS.service,
  }),
})
