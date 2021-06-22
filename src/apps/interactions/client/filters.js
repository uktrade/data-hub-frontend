import { KIND_OPTIONS, LABELS } from './constants'

import { buildOptionsFilter } from '../../../client/filters'

export const buildSelectedFilters = ({ queryParams, selectedAdvisers }) => ({
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
})
