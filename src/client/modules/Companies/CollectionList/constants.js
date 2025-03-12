export const LABELS = {
  headquarterType: 'Type',
  companyName: 'Company name',
  companyNumber: 'Company number',
  sector: 'Sector',
  subSector: 'Sub-sector',
  country: 'Country',
  usState: 'US state',
  canadianProvince: 'Canadian province',
  ukPostcode: 'UK postcode',
  ukRegion: 'UK region',
  companyStatus: 'Status',
  currentlyExportingTo: 'Currently exporting to',
  futureCountriesOfInterest: 'Future countries of interest',
  exportSegment: 'Export Segment',
  exportSubsegment: 'Export Subsegment',
  lastInteractionAfter: 'Last interaction from',
  lastInteractionBefore: 'Last interaction to',
  leadItaOrGlobalAccountManager: 'Lead ITA or global account manager',
  adviser: 'Adviser',
}

export const COMPANY_STATUS_OPTIONS = [
  { label: 'Active', value: 'false' },
  { label: 'Inactive', value: 'true' },
  { label: 'Matched', value: 'false' },
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

export const GLOBAL_HQ_ID = '43281c5e-92a4-4794-867b-b4d5f801e6f3'
