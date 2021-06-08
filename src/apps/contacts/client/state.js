import { omitBy, isEmpty } from 'lodash'
import qs from 'qs'

export const TASK_GET_CONTACTS_LIST = 'TASK_GET_CONTACTS_LIST'
export const TASK_GET_CONTACTS_METADATA = 'TASK_GET_CONTACTS_METADATA'
export const ID = 'contactsList'

import {
  SECTOR,
  COUNTRY,
  UK_REGION,
  CONTACTS_NAME,
  COMPANY_NAME,
  STATUS,
} from './labels'

import { STATUS_OPTIONS } from './metadata'

const buildOptionsFilter = ({ options = [], value, categoryLabel }) =>
  options
    .filter((option) => value && value.includes(option.value))
    .map(({ value, label }) => ({
      value,
      label,
      categoryLabel,
    }))

const getFilteredQueryParams = (router) => {
  const queryParams = router.location.search.slice(1)
  const filteredQueryParams = omitBy({ ...qs.parse(queryParams) }, isEmpty)
  return {
    ...filteredQueryParams,
    page: parseInt(filteredQueryParams.page || 1, 10),
  }
}

const transformArchivedToAPI = (params) => ({
  ...params,
  archived: params.archived?.length === 1
    ? params.archived[0] === 'true'
    : undefined,
})

export const state2props = ({ router, ...state }) => {
  const filteredQueryParams = getFilteredQueryParams(router)
  const { metadata } = state[ID]

  const selectedFilters = {
    selectedName: filteredQueryParams.name
      ? [
          {
            value: filteredQueryParams.name,
            label: filteredQueryParams.name,
            categoryLabel: CONTACTS_NAME,
          },
        ]
      : [],
    selectedCompanyName: filteredQueryParams.company_name
      ? [
          {
            value: filteredQueryParams.company_name,
            label: filteredQueryParams.company_name,
            categoryLabel: COMPANY_NAME,
          },
        ]
      : [],
    selectedCompanySectors: buildOptionsFilter({
      options: metadata.sectorOptions,
      value: filteredQueryParams.company_sector_descends,
      categoryLabel: SECTOR,
    }),
    selectedAddressCountries: buildOptionsFilter({
      options: metadata.countryOptions,
      value: filteredQueryParams.address_country,
      categoryLabel: COUNTRY,
    }),
    selectedCompanyUkRegions: buildOptionsFilter({
      options: metadata.ukRegionOptions,
      value: filteredQueryParams.company_uk_region,
      categoryLabel: UK_REGION,
    }),
    selectedStatus: buildOptionsFilter({
      options: STATUS_OPTIONS,
      value: filteredQueryParams.archived,
      categoryLabel: STATUS,
    }),
  }

  return {
    ...state[ID],
    selectedFilters,
    payload: transformArchivedToAPI(filteredQueryParams),
    optionMetadata: {
      sortOptions: [],
      statusOptions: STATUS_OPTIONS,
      ...metadata,
    },
  }
}
