export const LABELS = {
  stage: 'Stage',
  sector: 'Sector',
  country: 'Country',
  adviser: 'Adviser',
  ukRegion: 'UK region',
  projectStatus: 'Status',
  investmentType: 'Investment type',
  likelihoodToLand: 'Likelihood to land',
  actualLandDateAfter: 'Actual land date from',
  actualLandDateBefore: 'Actual land date to',
  involvementLevel: 'Level of involvement specified',
  estimatedLandDateAfter: 'Estimated land date from',
  estimatedLandDateBefore: 'Estimated land date to',
  landDate: 'Land date',
}

export const SORT_OPTIONS = [
  {
    name: 'Recently created',
    value: 'created_on:desc',
  },
  {
    name: 'Earliest land date',
    value: 'estimated_land_date:asc',
  },
  {
    name: 'Latest land date',
    value: 'estimated_land_date:desc',
  },
  {
    name: 'Project name A-Z',
    value: 'name:asc',
  },
]

export const INVOLVEMENT_LEVEL_OPTIONS = [
  { label: 'Involved', value: 'involved' },
  { label: 'Not involved', value: 'not_involved' },
  { label: 'Unspecified', value: 'unspecified' },
]

export const PROJECT_STATUS_OPTIONS = [
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Delayed', value: 'delayed' },
  { label: 'Abandoned', value: 'abandoned' },
  { label: 'Lost', value: 'lost' },
  { label: 'Dormant', value: 'dormant' },
]
