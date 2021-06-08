import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const TASK_GET_COMPANIES_LIST = 'TASK_GET_COMPANIES_LIST'
export const TASK_GET_COMPANIES_METADATA = 'TASK_GET_COMPANIES_METADATA'

export const ID = 'companiesList'

import * as labels from './labels'
import { COMPANY_STATUS_OPTIONS } from './metadata'

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
  const {
    country = [],
    headquarter_type = [],
    name,
    sector_descends = [],
    uk_region = [],
    archived = [],
    export_to_countries = [],
    future_interest_countries = [],
  } = queryProps
  const { metadata } = state[ID]

  const selectedFilters = {
    selectedCountries: buildOptionsFilter({
      options: metadata.countryOptions,
      value: country,
      categoryLabel: labels.COUNTRY,
    }),
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
    selectedUkRegions: buildOptionsFilter({
      options: metadata.ukRegionOptions,
      value: uk_region,
      categoryLabel: labels.UK_REGION,
    }),
    selectedCompanyStatuses: buildOptionsFilter({
      options: COMPANY_STATUS_OPTIONS,
      value: archived,
      categoryLabel: labels.COMPANY_STATUS,
    }),
    selectedExportToCountries: buildOptionsFilter({
      options: metadata.countryOptions,
      value: export_to_countries,
      categoryLabel: labels.CURRENTLY_EXPORTING_TO,
    }),
    selectedFutureCountriesOfInterest: buildOptionsFilter({
      options: metadata.countryOptions,
      value: future_interest_countries,
      categoryLabel: labels.FUTURE_COUNTRIES_OF_INTEREST,
    }),
  }
  return {
    ...state[ID],
    payload: filteredQueryProps,
    optionMetadata: {
      sortOptions: [],
      companyStatuses: COMPANY_STATUS_OPTIONS,
      ...metadata,
    },
    selectedFilters,
  }
}
