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
  StatusMessage,
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

const EYBLeadCollection = ({ filterOptions, payload, ...props }) => {
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
        <InputPlaceholder count={2} />
        <CheckboxPlaceholder count={2} />
      </>
    ),
    startOnRender: {
      onSuccessDispatch: INVESTMENTS__EYB_LEAD_FILTER_OPTIONS_LOADED,
    },
  }
  return (
    <>
      <StatusMessage>
        <strong>Work in progress</strong>
        <p>
          {' '}
          We are working to add Expand Your Business (EYB) data to Data Hub. It
          will be available here soon.
        </p>
      </StatusMessage>
      <FilteredCollectionList
        {...props}
        collectionName="EYB Lead"
        taskProps={collectionListTask}
        entityName="eybLead"
        defaultQueryParams={{
          page: 1,
        }}
        selectedFilters={selectedFilters}
      >
        <CollectionFilters taskProps={collectionListMetadataTask}>
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
