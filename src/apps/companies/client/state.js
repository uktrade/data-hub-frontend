import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const TASK_GET_COMPANIES_LIST = 'TASK_GET_COMPANIES_LIST'
export const TASK_GET_COMPANIES_METADATA = 'TASK_GET_COMPANIES_METADATA'

export const ID = 'companiesList'

import * as labels from './labels'

const getFilteredQueryParams = (router) => {
  const queryParams = router.location.search.slice(1)
  const filteredQueryParams = omitBy({ ...qs.parse(queryParams) }, isEmpty)
  return {
    ...filteredQueryParams,
    page: parseInt(filteredQueryParams.page || 1, 10),
  }
}

/**
 * Build the options filter to include value, label and category label
 */
const buildOptionsFilter = ({ options = [], value, categoryLabel = '' }) => {
  const optionsFilter = options.filter((option) => value.includes(option.value))
  if (categoryLabel) {
    return optionsFilter.map(({ value, label }) => ({
      value,
      label,
      categoryLabel,
    }))
  } else {
    return optionsFilter
  }
}

/**
 * Convert both location and redux state to props
 */
export const state2props = ({ router, ...state }) => {
  const queryProps = qs.parse(router.location.search.slice(1))
  const filteredQueryProps = getFilteredQueryParams(router)
  const { headquarter_type = [], name, sector_descends = [] } = queryProps
  const { metadata } = state[ID]

  const selectedFilters = {
    selectedHeadquarterTypes: buildOptionsFilter({
      options: metadata.headquarterTypeOptions,
      value: headquarter_type,
      categoryLabel: labels.HEADQUARTER_TYPE,
    }),
    selectedName: name
      ? [
          {
            value: name,
            label: name,
            categoryLabel: labels.COMPANY_NAME,
          },
        ]
      : [],
    selectedSectors: buildOptionsFilter({
      options: metadata.sectorOptions,
      value: sector_descends,
      categoryLabel: labels.SECTOR,
    }),
  }
  return {
    ...state[ID],
    payload: filteredQueryProps,
    optionMetadata: { sortOptions: [], ...metadata },
    selectedFilters,
  }
}
