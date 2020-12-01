import qs from 'qs'

import {
  sortOptions,
  sectorOptions,
  estimatedLandDateBefore,
  estimatedLandDateAfter,
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
  estimated_land_date_before = null,
  estimated_land_date_after = null,
}) => ({
  adviser: parseVariablePropType(adviser),
  sector_descends: parseVariablePropType(sector_descends),
  estimated_land_date_before,
  estimated_land_date_after,
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

export const state2props = ({ router, ...state }) => {
  /*
   * Convert both location and redux state to investment projects props
   *
   * Selected filters are built from the page's query props as well as the
   * selected advisers in state.
   */
  const queryProps = qs.parse(router.location.search.slice(1))
  const filteredQueryProps = collectionListPayload(queryProps)
  const { selectedAdvisers } = state.projectsList
  const {
    sector_descends = [],
    estimated_land_date_before,
    estimated_land_date_after,
  } = queryProps

  const selectedFilters = {
    selectedAdvisers: selectedAdvisers.map(({ advisers }) => ({
      label: advisers.name,
      value: advisers.id,
    })),
    selectedSectors: listSelectedFilters(sectorOptions, sector_descends),
    selectedEstimatedLandDatesBefore: [
      {
        label: estimatedLandDateBefore,
        value: estimated_land_date_before,
      },
    ],
    selectedEstimatedLandDatesAfter: [
      {
        label: estimatedLandDateAfter,
        value: estimated_land_date_after,
      },
    ],
  }

  return {
    ...state[ID],
    payload: filteredQueryProps,
    optionMetadata: { sortOptions, sectorOptions },
    selectedFilters,
  }
}
