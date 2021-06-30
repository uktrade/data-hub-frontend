import { KIND_OPTIONS, LABELS } from './constants'

import { buildOptionsFilter, buildDatesFilter } from '../../../client/filters'

export const buildFilters = (queryParams, metadata, selectedAdvisers) => ({
  kind: {
    queryParam: 'kind',
    options: buildOptionsFilter({
      options: KIND_OPTIONS,
      value: queryParams.kind,
      categoryLabel: LABELS.kind,
    }),
  },
  advisers: {
    queryParam: 'adviser',
    options: selectedAdvisers.map(({ advisers }) => ({
      label: advisers.name,
      value: advisers.id,
      categoryLabel: LABELS.advisers,
    })),
  },
  myInteractions: {
    queryParam: 'adviser',
    options: selectedAdvisers.map(({ advisers }) => ({
      label: advisers.name,
      value: advisers.id,
      categoryLabel: LABELS.advisers,
    })),
  },
  datesAfter: {
    queryParam: 'date_after',
    options: buildDatesFilter({
      value: queryParams.date_after,
      categoryLabel: LABELS.dateAfter,
    }),
  },
  datesBefore: {
    queryParam: 'date_before',
    options: buildDatesFilter({
      value: queryParams.date_before,
      categoryLabel: LABELS.dateBefore,
    }),
  },
  service: {
    queryParam: 'service',
    options: buildOptionsFilter({
      options: metadata.serviceOptions,
      value: queryParams.service,
      categoryLabel: LABELS.service,
    }),
  },
})
