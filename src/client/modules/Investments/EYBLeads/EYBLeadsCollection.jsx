import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import qs from 'qs'

import {
  INVESTMENTS__EYB_LEADS_LOADED,
  INVESTMENTS__EYB_LEAD_FILTER_OPTIONS_LOADED,
} from '../../../actions'
import {
  CollectionFilters,
  FilteredCollectionList,
  Filters,
} from '../../../components'
import {
  INVESTMENT_EYB_LEADS_ID,
  TASK_GET_EYB_LEADS_LIST,
  TASK_GET_EYB_LEADS_METADATA,
  state2props,
} from './state.js'
import { QS_PARAMS, VALUE_OPTIONS } from './constants.js'
import {
  listSkeletonPlaceholder,
  CheckboxPlaceholder,
  InputPlaceholder,
} from '../../../components/SkeletonPlaceholder'

const EYBLeadCollection = ({
  filterOptions,
  payload,
  optionMetadata,
  sortOptions,
  ...props
}) => {
  const location = useLocation()
  const qsParams = useMemo(
    () => qs.parse(location.search.slice(1)),
    [location.search]
  )

  const resolveCompanyName = () => {
    const companyName = qsParams[QS_PARAMS.companyName]
    return companyName ? [{ label: companyName, value: companyName }] : []
  }
  const resolveSelectedOptions = (values = [], options = []) =>
    options.filter(({ value }) => values.includes(value))

  const setupSelectedFilters = (qsParams, filterOptions) => ({
    overseasRegionId: {
      queryParam: QS_PARAMS.overseasRegionId,
      options: resolveSelectedOptions(
        qsParams[QS_PARAMS.overseasRegionId],
        filterOptions.overseasRegions
      ),
    },
    countryId: {
      queryParam: QS_PARAMS.countryId,
      options: resolveSelectedOptions(
        qsParams[QS_PARAMS.countryId],
        filterOptions.countries
      ),
    },
    companyName: {
      queryParam: QS_PARAMS.companyName,
      options: resolveCompanyName(),
    },
    sectorId: {
      queryParam: QS_PARAMS.sectorId,
      options: resolveSelectedOptions(
        qsParams[QS_PARAMS.sectorId],
        filterOptions.sectors
      ),
    },
    valueOfLead: {
      queryParam: QS_PARAMS.valueOfLead,
      options: resolveSelectedOptions(
        qsParams[QS_PARAMS.valueOfLead],
        VALUE_OPTIONS
      ),
    },
  })
  const selectedFilters = setupSelectedFilters(qsParams, filterOptions)

  const collectionListTask = {
    id: INVESTMENT_EYB_LEADS_ID,
    name: TASK_GET_EYB_LEADS_LIST,
    progressMessage: 'Loading EYB leads',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload: {
        ...payload,
      },
      onSuccessDispatch: INVESTMENTS__EYB_LEADS_LOADED,
    },
  }
  const collectionListMetadataTask = {
    id: INVESTMENT_EYB_LEADS_ID,
    name: TASK_GET_EYB_LEADS_METADATA,
    progressMessage: 'Loading filters',
    renderProgress: () => (
      <>
        <InputPlaceholder count={3} />
        <CheckboxPlaceholder count={2} />
      </>
    ),
    startOnRender: {
      onSuccessDispatch: INVESTMENTS__EYB_LEAD_FILTER_OPTIONS_LOADED,
    },
  }
  return (
    <>
      <FilteredCollectionList
        {...props}
        collectionName="EYB lead"
        sortOptions={sortOptions}
        taskProps={collectionListTask}
        entityName="eybLead"
        defaultQueryParams={{
          page: 1,
          sortby: '-triage_created',
        }}
        selectedFilters={selectedFilters}
      >
        <CollectionFilters taskProps={collectionListMetadataTask}>
          &nbsp;
          <Filters.CheckboxGroup
            legend="Value"
            name="lead-value"
            qsParam={QS_PARAMS.valueOfLead}
            options={VALUE_OPTIONS}
            selectedOptions={selectedFilters.valueOfLead.options}
            data-test="lead-value-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label="HMTC region"
            name="overseas-region"
            qsParam={QS_PARAMS.overseasRegionId}
            placeholder="Search HMTC region"
            options={filterOptions.overseasRegions}
            selectedOptions={selectedFilters.overseasRegionId.options}
            data-test="overseas-region-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label="Country"
            name="country"
            qsParam={QS_PARAMS.countryId}
            placeholder="Search country"
            options={filterOptions.countries}
            selectedOptions={selectedFilters.countryId.options}
            data-test="lead-country-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label="Sector of interest"
            name="sector"
            qsParam={QS_PARAMS.sectorId}
            placeholder="Search sector"
            options={filterOptions.sectors}
            selectedOptions={selectedFilters.sectorId.options}
            data-test="sector-filter"
          />
          <Filters.Input
            id="EYBLeadsCollection.company-name"
            label="Company name"
            name="company-name"
            placeholder="Search company"
            qsParam={QS_PARAMS.companyName}
            data-test="company-name-filter"
          />
        </CollectionFilters>
      </FilteredCollectionList>
    </>
  )
}

export default connect(state2props)(EYBLeadCollection)
