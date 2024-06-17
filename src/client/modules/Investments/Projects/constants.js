import React from 'react'

export const STAGE_PROSPECT = 'Prospect'
export const STAGE_ASSIGN_PM = 'Assign PM'
export const STAGE_ACTIVE = 'Active'
export const STAGE_VERIFY_WIN = 'Verify win'
export const STAGE_WON = 'Won'
export const INVESTMENT_PROJECT_STAGES = [
  STAGE_PROSPECT,
  STAGE_ASSIGN_PM,
  STAGE_ACTIVE,
  STAGE_VERIFY_WIN,
  STAGE_WON,
]

export const INVESTMENT_PROJECT_STAGES_TO_ASSIGN_PM = [
  STAGE_PROSPECT,
  STAGE_ASSIGN_PM,
]

export const EXPORT_REVENUE_TRUE = 'Yes, will create significant export revenue'
export const EXPORT_REVENUE_FALSE =
  'No, will not create significant export revenue'

export const NEW_TECH_TRUE = 'Has new-to-world tech, business model or IP'
export const NEW_TECH_FALSE = 'No new-to-world tech, business model or IP'

export const R_AND_D_TRUE = 'Has R&D budget'
export const R_AND_D_FALSE = 'No R&D budget'

export const NOT_LINKED_TO_R_AND_D = 'Not linked to a non-FDI R&D project'

export const PROPOSITION_STATUSES = {
  ongoing: 'Ongoing',
  abandoned: 'Abandoned',
  completed: 'Completed',
  late: 'Late',
}

export const VIRUS_SCAN_STATUSES = {
  not_virus_scanned: 'File not virus scanned',
  virus_scanning_scheduled: 'Virus scanning scheduled',
  virus_scanning_in_progress:
    'File is being scanned, try again in a few moments',
  virus_scanning_failed: (
    <strong>Virus scanning failed, contact your administrator</strong>
  ),
}

export const LABELS = {
  stage: 'Stage',
  sector: 'Sector',
  country: 'Country',
  adviser: 'Adviser',
  ukRegion: 'UK region',
  projectStatus: 'Status',
  investmentType: 'Investment type',
  likelihoodToLand: 'Likelihood of landing',
  actualLandDateAfter: 'Actual land date from',
  actualLandDateBefore: 'Actual land date to',
  involvementLevel: 'Involvement level',
  estimatedLandDateAfter: 'Estimated land date from',
  estimatedLandDateBefore: 'Estimated land date to',
  landDate: 'Land date',
  includeRelatedCompanies: 'Include related companies',
  name: 'Project name',
  projectCode: 'Project code',
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
  { label: 'Referred', value: 'referred' },
  { label: 'Abandoned', value: 'abandoned' },
  { label: 'Lost', value: 'lost' },
  { label: 'Dormant', value: 'dormant' },
]

export const ITEMS_PER_PAGE = 10

export const FDI_TYPES = {
  capitalOnly: {
    value: '840f62c1-bbcb-44e4-b6d4-a258d2ffa07d',
    label: 'Capital only',
    labelWithHintText: 'Capital only (minimum investment value is £15 million)',
  },
  expansionOfExistingSiteOrActivity: {
    value: 'd08a2f07-c366-4133-9a7e-35b6c88a3270',
    label: 'Expansion of existing site or activity',
  },
  jointVenture: {
    value: 'a7dbf6b3-9c04-43a7-9be9-d3072f138fab',
    label: 'Joint venture',
  },
}

export const INVESTOR_TYPES = {
  existing: {
    value: '40e33f91-f565-4b89-8e18-cfefae192245',
    label: 'Existing Investor',
  },
  new: {
    value: 'e6a01052-8c36-4a32-b5b9-fc2be4b34408',
    label: 'New Investor',
  },
}
