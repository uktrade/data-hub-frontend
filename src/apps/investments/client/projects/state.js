import qs from 'qs'
import dateFns from 'date-fns'

import {
  actualLandDateBeforeLabel,
  actualLandDateAfterLabel,
  countryOptions,
<<<<<<< HEAD
=======
  sortOptions,
  sectorOptions,
  projectStageOptions,
>>>>>>> c5551a5f3... Add chip component for checkboxes
  estimatedLandDateBeforeLabel,
  estimatedLandDateAfterLabel,
  sectorOptions,
  sortOptions,
  ukRegionOptions,
} from './metadata'

export const TASK_GET_PROJECTS_LIST = 'TASK_GET_PROJECTS_LIST'
export const TASK_GET_ADVISER_NAME = 'TASK_GET_ADVISER_NAME'

export const ID = 'projectsList'

const parseVariablePropType = (prop) =>
  prop ? (Array.isArray(prop) ? prop : [prop]) : prop

const searchParamProps = ({
  sortby = 'created_on:desc',
  page = 1,
  adviser = false,
  sector_descends = false,
  country = false,
<<<<<<< HEAD
  uk_region = false,
=======
  stage = false,
>>>>>>> c5551a5f3... Add chip component for checkboxes
  estimated_land_date_before = null,
  estimated_land_date_after = null,
  actual_land_date_before = null,
  actual_land_date_after = null,
}) => ({
  adviser: parseVariablePropType(adviser),
  sector_descends: parseVariablePropType(sector_descends),
  country: parseVariablePropType(country),
<<<<<<< HEAD
  uk_region: parseVariablePropType(uk_region),
=======
  stage: parseVariablePropType(stage),
>>>>>>> c5551a5f3... Add chip component for checkboxes
  estimated_land_date_before,
  estimated_land_date_after,
  actual_land_date_before,
  actual_land_date_after,
  sortby,
  page,
})

const collectionListPayload = (paramProps) => {
  return Object.fromEntries(
    Object.entries(searchParamProps(paramProps)).filter((v) => v[1])
  )
}

const listSelectedFilters = (metadataOptions, filterProp) =>
  metadataOptions.filter((option) => filterProp.includes(option.value))

const getDateLabel = (paramLabel, value) =>
  value ? `${paramLabel} : ${dateFns.format(value, 'D MMMM YYYY')}` : paramLabel

const buildDatesFilter = (paramLabel, value) =>
  value ? [{ label: getDateLabel(paramLabel, value), value }] : []

/**
 * Convert both location and redux state to investment projects props
 *
 * Selected filters are built from the page's query props as well as the
 * selected advisers in state.
 */
export const state2props = ({ router, ...state }) => {
  const queryProps = qs.parse(router.location.search.slice(1))
  const filteredQueryProps = collectionListPayload(queryProps)
  const { selectedAdvisers } = state.projectsList
  const {
    sector_descends = [],
    country = [],
<<<<<<< HEAD
    uk_region = [],
=======
    stage = [],
>>>>>>> c5551a5f3... Add chip component for checkboxes
    estimated_land_date_before,
    estimated_land_date_after,
    actual_land_date_before,
    actual_land_date_after,
  } = queryProps

  const selectedFilters = {
    selectedAdvisers: selectedAdvisers.map(({ advisers }) => ({
      label: advisers.name,
      value: advisers.id,
    })),
    selectedSectors: listSelectedFilters(sectorOptions, sector_descends),
<<<<<<< HEAD
    selectedCountries: listSelectedFilters(countryOptions, country),
    selectedUkRegions: listSelectedFilters(ukRegionOptions, uk_region),
=======
    selectedStage: listSelectedFilters(projectStageOptions, stage),
>>>>>>> c5551a5f3... Add chip component for checkboxes
    selectedEstimatedLandDatesBefore: buildDatesFilter(
      estimatedLandDateBeforeLabel,
      estimated_land_date_before
    ),
    selectedEstimatedLandDatesAfter: buildDatesFilter(
      estimatedLandDateAfterLabel,
      estimated_land_date_after
    ),
    selectedActualLandDatesBefore: buildDatesFilter(
      actualLandDateBeforeLabel,
      actual_land_date_before
    ),
    selectedActualLandDatesAfter: buildDatesFilter(
      actualLandDateAfterLabel,
      actual_land_date_after
    ),
  }

  return {
    ...state[ID],
    payload: filteredQueryProps,
    optionMetadata: {
      countryOptions,
      sortOptions,
      sectorOptions,
<<<<<<< HEAD
      ukRegionOptions,
=======
      projectStageOptions,
>>>>>>> c5551a5f3... Add chip component for checkboxes
    },
    selectedFilters,
  }
}
