import React from 'react'
import qs from 'qs'

import {
  CollectionFilters,
  FilteredCollectionList,
  Filters,
} from '../../../components'
import {
  listSkeletonPlaceholder,
  ToggleHeadingPlaceholder,
} from '../../../components/SkeletonPlaceholder'

import { sanitizeFilter } from '../../../filters'

const QS_PARAMS = {
  eybLeadCompanyName: 'eyb_lead_company_name',
  // assetClassesOfInterest: 'asset_classes_of_interest',
}

// const resolveSelectedOptions = (values = [], options = []) =>
//   values
//     .map((id) => options.filter(({ value }) => value === id)[0])
//     .filter(Boolean)

const EYBLeadCollection = ({
  count,
  results,
  isComplete,
  // filterOptions,
}) => {
  const qsParams = qs.parse(location.search.slice(1))
  // const selectedAssetClassesOfInterest = resolveSelectedOptions(
  //   qsParams[QS_PARAMS.assetClassesOfInterest],
  //   filterOptions.assetClassesOfInterest
  // )

  const resolveSelectedEYBLeadCompanyName = () => {
    const companyName = qsParams[QS_PARAMS.eybLeadCompanyName]
    return companyName ? [{ label: companyName, value: companyName }] : []
  }
  return (
    <FilteredCollectionList
      count={count}
      results={results}
      isComplete={isComplete}
      collectionName="eybLead"
      sanitizeFiltersForAnalytics={({ eybLeadCompanyName }) => ({
        ...sanitizeFilter(eybLeadCompanyName, 'Company name'),
      })}
      taskProps={{
        // name: TASK_GET_PROFILES_LIST,
        // id: ID,
        progressMessage: 'Loading EYB leads',
        renderProgress: listSkeletonPlaceholder({
          listItemFields: 2,
        }),
        startOnRender: {
          payload: {
            page: parseInt(qsParams.page, 10),
            // assetClassesOfInterest: qsParams[QS_PARAMS.assetClassesOfInterest],
            eybLeadCompanyName: qsParams[QS_PARAMS.eybLeadCompanyName],
          },
          // onSuccessDispatch: INVESTMENTS__PROFILES_LOADED,
        },
      }}
      entityName="eybLead"
      selectedFilters={{
        eybLeadCompanyName: {
          queryParam: QS_PARAMS.eybLeadCompanyName,
          options: resolveSelectedEYBLeadCompanyName(),
        },
        //   assetClassesOfInterest: {
        //     queryParam: QS_PARAMS.assetClassesOfInterest,
        //     options: selectedAssetClassesOfInterest,
        //   },
      }}
    >
      <CollectionFilters
        taskProps={{
          name: 'EYB leads filters',
          id: 'investments/eyb-leads',
          progressMessage: 'Loading filters',
          renderProgress: () => (
            <>
              <ToggleHeadingPlaceholder count={4} />
            </>
          ),
          startOnRender: {
            onSuccessDispatch: 'INVESTMENTS_PROFILES__FILTER_OPTIONS_LOADED',
          },
        }}
      >
        <br></br>
        <Filters.Input
          id="EYBLeadCollection.eyb-lead-company-name"
          qsParam="eyb_lead_company_name"
          name="eyb-lead-company-name"
          label="Company name"
          placeholder="Search company name"
        />
        {/* <Filters.Typeahead
            isMulti={true}
            label="Sector of interest"
            name="asset-class"
            qsParam={QS_PARAMS.assetClassesOfInterest}
            placeholder="Search sector of interest"
            options={filterOptions.assetClassesOfInterest}
            selectedOptions={selectedAssetClassesOfInterest}
            data-test="asset-class-filter"
          /> */}
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default EYBLeadCollection
