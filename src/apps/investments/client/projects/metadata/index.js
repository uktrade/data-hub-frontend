export { countryOptions } from './countries'
export { sectorOptions } from './sectors'
export { ukRegionOptions } from './uk-regions'
export { projectStageOptions } from './project-stages'

export const adviserLabel = 'Adviser'
export const countryLabel = 'Country'
export const estimatedLandDateBeforeLabel = 'Estimated land date before'
export const estimatedLandDateAfterLabel = 'Estimated land date after'
export const actualLandDateBeforeLabel = 'Actual land date before'
export const actualLandDateAfterLabel = 'Actual land date after'
export const likelihoodToLandLabel = 'Likelihood to land'
export const investmentTypeLabel = 'Investment type'
export const involvementLevelLabel = 'Level of involvement specified'
export const sectorLabel = 'Sector'
export const ukRegionLabel = 'UK region'
export const stageLabel = 'Stage'
export const projectStatusLabel = 'Status'

export const sortOptions = [
  {
    name: 'Most recently created',
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
    name: 'Project name',
    value: 'name:asc',
  },
  {
    name: 'Stage',
    value: 'stage.name',
  },
]

export const involvementLevelOptions = [
  { label: 'Involved', value: 'involved' },
  { label: 'Not involved', value: 'not_involved' },
  { label: 'Unspecified', value: 'unspecified' },
]

export const likelihoodToLandOptions = [
  { label: 'Low', value: 'b3515282-dc36-487a-a5af-320cde165575' },
  { label: 'Medium', value: '683ca57b-bd69-462c-852f-d2177e35b2eb' },
  { label: 'High', value: '90531272-fc9c-4403-9320-b69e51fbec06' },
]

export const projectStatusOptions = [
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Delayed', value: 'delayed' },
  { label: 'Abandoned', value: 'abandoned' },
  { label: 'Lost', value: 'lost' },
  { label: 'Dormant', value: 'dormant' },
]

export const investmentTypeOptions = [
  {
    label: 'Commitment to invest',
    value: '031269ab-b7ec-40e9-8a4e-7371404f0622',
  },
  {
    label: 'FDI',
    value: '3e143372-496c-4d1e-8278-6fdd3da9b48b',
  },
  {
    label: 'Non-FDI',
    value: '9c364e64-2b28-401b-b2df-50e08b0bca44',
  },
]
