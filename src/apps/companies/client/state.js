import qs from 'qs'

export const TASK_GET_COMPANIES_LIST = 'TASK_GET_COMPANIES_LIST'
export const TASK_GET_COMPANIES_METADATA = 'TASK_GET_COMPANIES_METADATA'

export const ID = 'companiesList'

import { companyNameLabel, headquarterTypeLabel, sectorLabel } from './labels'

const parseVariablePropType = (prop) =>
  prop ? (Array.isArray(prop) ? prop : [prop]) : prop

const searchParamProps = ({
  page = 1,
  headquarter_type = false,
  name = false,
  sector_descends = false,
}) => ({
  page: parseInt(page, 10),
  headquarter_type,
  name,
  sector_descends: parseVariablePropType(sector_descends),
})

const collectionListPayload = (paramProps) => {
  return Object.fromEntries(
    Object.entries(searchParamProps(paramProps)).filter((v) => v[1])
  )
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
  const filteredQueryProps = collectionListPayload(queryProps)
  const { headquarter_type = [], name, sector_descends = [] } = queryProps
  const { metadata } = state[ID]

  const selectedFilters = {
    selectedHeadquarterTypes: buildOptionsFilter({
      options: metadata.headquarterTypeOptions,
      value: headquarter_type,
      categoryLabel: headquarterTypeLabel,
    }),
    selectedName: name
      ? [
          {
            value: name,
            label: name,
            categoryLabel: companyNameLabel,
          },
        ]
      : [],
    selectedSectors: buildOptionsFilter({
      options: metadata.sectorOptions,
      value: sector_descends,
      categoryLabel: sectorLabel,
    }),
  }
  return {
    ...state[ID],
    payload: filteredQueryProps,
    optionMetadata: { sortOptions: [], ...metadata },
    selectedFilters,
  }
}
