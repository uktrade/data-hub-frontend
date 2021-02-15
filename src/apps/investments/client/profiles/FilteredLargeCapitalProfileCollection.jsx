import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import qs from 'qs'

import {
  FilteredCollectionList,
  CollectionFilters,
  RoutedTypeahead,
} from '../../../../client/components/'
import { TASK_GET_PROFILES_LIST, ID, state2props } from './state'
import {
  INVESTMENTS__PROFILES_LOADED,
  INVESTMENTS__PROFILES_SELECT_PAGE,
} from '../../../../client/actions'

const QS_PARAMS = {
  countryOfOrigin: 'country_of_origin',
}

const LargeCapitalProfileCollection = ({
  count,
  results,
  isComplete,
  filterOptions,
}) => (
  <Route>
    {({ location }) => {
      const qsParams = qs.parse(location.search.slice(1))
      const selectedCountries = (qsParams[QS_PARAMS.countryOfOrigin] || [])
        .map(
          (id) => filterOptions.countries.filter(({ value }) => value === id)[0]
        )
        .filter(Boolean)

      return (
        <FilteredCollectionList
          count={count}
          results={results}
          isComplete={isComplete}
          collectionName="Profile"
          taskProps={{
            name: TASK_GET_PROFILES_LIST,
            id: ID,
            progressMessage: 'loading profiles...',
            startOnRender: {
              payload: {
                page: parseInt(qsParams.page, 10),
                countryOfOrigin: qsParams.country_of_origin,
              },
              onSuccessDispatch: INVESTMENTS__PROFILES_LOADED,
            },
          }}
          selectedFilters={{ selectedCountryOfOrigin: selectedCountries }}
          baseDownloadLink="/investments/profiles/export"
          entityName="profile"
        >
          <CollectionFilters
            taskProps={{
              name: 'Large investment profiles',
              id: 'investments/profiles',
              startOnRender: {
                onSuccessDispatch:
                  'INVESTMENTS_PROFILES__FILTER_OPTIONS_LOADED',
              },
            }}
          >
            <RoutedTypeahead
              isMulti={true}
              legend="Country of origin"
              name="country"
              qsParam={QS_PARAMS.countryOfOrigin}
              placeholder="Search countries"
              options={filterOptions.countries}
              selectedOptions={selectedCountries}
              data-test="country-filter"
            />
          </CollectionFilters>
        </FilteredCollectionList>
      )
    }}
  </Route>
)

export default connect(state2props, (dispatch) => ({
  onPageClick: (page) => {
    dispatch({
      type: INVESTMENTS__PROFILES_SELECT_PAGE,
      page,
    })
  },
}))(LargeCapitalProfileCollection)
