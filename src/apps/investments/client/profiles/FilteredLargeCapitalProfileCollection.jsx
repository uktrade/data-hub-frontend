import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import qs from 'qs'

import {
  FilteredCollectionList,
  CollectionFilters,
  RoutedTypeahead,
} from '../../../../client/components/'
import RoutedInputField from '../../../../client/components/RoutedInputField'
import { TASK_GET_PROFILES_LIST, ID } from './state'
import { INVESTMENTS__PROFILES_LOADED } from '../../../../client/actions'

const QS_PARAMS = {
  countryOfOrigin: 'country_of_origin',
  assetClassesOfInterest: 'asset_classes_of_interest',
  investorCompanyName: 'investor_company_name',
}

const resolveSelectedOptions = (values = [], options = []) =>
  values
    .map((id) => options.filter(({ value }) => value === id)[0])
    .filter(Boolean)

const LargeCapitalProfileCollection = ({
  count,
  results,
  isComplete,
  filterOptions,
}) => (
  <Route>
    {({ location }) => {
      const qsParams = qs.parse(location.search.slice(1))
      const selectedCountries = resolveSelectedOptions(
        qsParams[QS_PARAMS.countryOfOrigin],
        filterOptions.countries
      )
      const selectedAssetClassesOfInterest = resolveSelectedOptions(
        qsParams[QS_PARAMS.assetClassesOfInterest],
        filterOptions.assetClassesOfInterest
      )

      const resolveSelectedInvestorCompanyName = () => {
        const companyName = qsParams[QS_PARAMS.investorCompanyName]
        return companyName ? [{ label: companyName, value: companyName }] : []
      }

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
                countryOfOrigin: qsParams[QS_PARAMS.countryOfOrigin],
                assetClassesOfInterest:
                  qsParams[QS_PARAMS.assetClassesOfInterest],
                investorCompanyName: qsParams[QS_PARAMS.investorCompanyName],
              },
              onSuccessDispatch: INVESTMENTS__PROFILES_LOADED,
            },
          }}
          baseDownloadLink="/investments/profiles/export"
          entityName="profile"
          selectedFilters={{
            selectedCountryOfOrigin: selectedCountries,
            selectedAssetClassesOfInterest,
            selectedInvestorCompanyName: resolveSelectedInvestorCompanyName(),
          }}
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
            <RoutedTypeahead
              isMulti={true}
              legend="Asset class of interest"
              name="asset-class-of-interest"
              qsParam={QS_PARAMS.assetClassesOfInterest}
              placeholder="Search countries"
              options={filterOptions.assetClassesOfInterest}
              selectedOptions={selectedAssetClassesOfInterest}
              data-test="asset-class-of-interest-filter"
            />
            <RoutedInputField
              id="LargeCapitalProfileCollection.investor-company-name"
              qsParam="investor_company_name"
              name="investor-company-name"
              label="Company name"
              placeholder="Search company name"
            />
          </CollectionFilters>
        </FilteredCollectionList>
      )
    }}
  </Route>
)

export default connect((state) => state[ID])(LargeCapitalProfileCollection)
