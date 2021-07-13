export const LABELS = {
  headquarterType: 'Type',
  companyName: 'Company name',
  sector: 'Sector',
  country: 'Country',
  usState: 'US state',
  canadianProvince: 'Canadian province',
  ukPostcode: 'UK postcode',
  ukRegion: 'UK region',
  companyStatus: 'Status',
  currentlyExportingTo: 'Currently exporting to',
  futureCountriesOfInterest: 'Future countries of interest',
  leadItaOrGlobalAccountManager: 'Lead ITA or Global Account Manager',
}

export const COMPANY_STATUS_OPTIONS = [
  { label: 'Active', value: 'false' },
  { label: 'Inactive', value: 'true' },
]

export const SORT_OPTIONS = [
  {
    name: 'Recently updated',
    value: 'modified_on:desc',
  },
  {
    name: 'Least recently updated',
    value: 'modified_on:asc',
  },
  {
    name: 'Company A-Z',
    value: 'name:asc',
  },
  {
    name: 'Last interaction date',
    value: 'latest_interaction_date:desc',
  },
]

export const COUNTRIES = {
  usa: '81756b9a-5d95-e211-a939-e4115bead28a',
  canada: '5daf72a6-5d95-e211-a939-e4115bead28a',
}
