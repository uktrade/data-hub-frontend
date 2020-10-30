export { countryOptions } from './countries'
export { sectorOptions } from './sectors'
<<<<<<< HEAD
export { ukRegionOptions } from './uk-regions'
=======
export { projectStageOptions } from './checkboxes'
>>>>>>> c5551a5f3... Add chip component for checkboxes

export const estimatedLandDateBeforeLabel = 'Estimated land date before'
export const estimatedLandDateAfterLabel = 'Estimated land date after'
export const actualLandDateBeforeLabel = 'Actual land date before'
export const actualLandDateAfterLabel = 'Actual land date after'

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
