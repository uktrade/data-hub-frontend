import { KIND_OPTIONS, LABELS } from './constants'

const buildOptionsFilter = ({ options = [], value, categoryLabel }) =>
  options
    .filter((option) => value && value.includes(option.value))
    .map(({ value, label }) => ({
      value,
      label,
      categoryLabel,
    }))

export const buildSelectedFilters = ({ kind }, {}) => ({
  selectedKind: buildOptionsFilter({
    options: [
      {
        label: KIND_OPTIONS.interaction.label,
        value: KIND_OPTIONS.interaction.value,
      },
      {
        label: KIND_OPTIONS.serviceDelivery.label,
        value: KIND_OPTIONS.serviceDelivery.value,
      },
    ],
    value: kind,
    categoryLabel: LABELS.kind,
  }),
})
