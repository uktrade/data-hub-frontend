export const QS_PARAMS = {
  overseasRegionId: 'overseas_region',
  countryId: 'country',
  companyName: 'company',
  sectorId: 'sector',
  valueOfLead: 'value',
}

export const VALUES = {
  HIGH_VALUE: 'High value',
  LOW_VALUE: 'Low value',
  UNKNOWN: 'Unknown value',
}

export const VALUES_VALUE_TO_LABEL_MAP = {
  [true]: VALUES.HIGH_VALUE,
  [false]: VALUES.LOW_VALUE,
  [null]: VALUES.UNKNOWN,
}

export const VALUE_OPTIONS = [
  { value: 'high', label: VALUES.HIGH_VALUE },
  { value: 'low', label: VALUES.LOW_VALUE },
  { value: 'unknown', label: VALUES.UNKNOWN },
]

export const SORT_OPTIONS = [
  {
    name: 'Recently created',
    value: '-triage_created',
  },
  {
    name: 'Company A-Z',
    value: 'company__name',
  },
]
