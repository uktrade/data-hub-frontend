import { INTERACTION, SERVICE_DELIVERY, KIND } from './constants'

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
      { label: INTERACTION.label, value: INTERACTION.value },
      { label: SERVICE_DELIVERY.label, value: SERVICE_DELIVERY.value },
    ],
    value: kind,
    categoryLabel: KIND,
  }),
})
