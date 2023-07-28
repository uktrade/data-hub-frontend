export const INCLUDE_RELATED_COMPANIES = [
  {
    label: 'Parent companies',
    value: 'include_parent_companies',
  },
  {
    label: 'Subsidiary companies',
    value: 'include_subsidiary_companies',
  },
]

export const INCLUDE_RELATED_COMPANIES_DISABLED_SUBSIDIARY =
  INCLUDE_RELATED_COMPANIES.map((option) =>
    option.value === 'include_subsidiary_companies'
      ? { ...option, disabled: 'disabled' }
      : option
  )
