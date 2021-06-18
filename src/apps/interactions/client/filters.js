import { KIND_OPTIONS, LABELS } from './constants'

import { buildOptionsFilter } from '../../../client/filters'

export const buildSelectedFilters = ({ kind }, {}) => ({
  selectedKind: buildOptionsFilter({
    options: KIND_OPTIONS,
    value: kind,
    categoryLabel: LABELS.kind,
  }),
})
