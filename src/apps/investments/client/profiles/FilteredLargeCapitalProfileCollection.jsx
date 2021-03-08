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
  investorTypes: 'investor_type',
  requiredChecksConducted: 'required_checks_conducted',
  dealTicketSize: 'deal_ticket_size',
  investmentTypes: 'investment_type',
  minimumReturnRate: 'minimum_return_rate',
  timeHorizon: 'time_horizon',
  restrictions: 'restriction',
  constructionRisk: 'construction_risk',
  minimumEquityPercentage: 'minimum_equity_percentage',
  desiredDealRole: 'desired_deal_role',
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
      const selectedInvestorTypes = resolveSelectedOptions(
        qsParams[QS_PARAMS.investorTypes],
        filterOptions.investorTypes
      )
      const selectedRequiredChecksConducted = resolveSelectedOptions(
        qsParams[QS_PARAMS.requiredChecksConducted],
        filterOptions.requiredChecksConducted
      )
      const selectedDealTicketSize = resolveSelectedOptions(
        qsParams[QS_PARAMS.dealTicketSize],
        filterOptions.dealTicketSize
      )
      const selectedInvestmentTypes = resolveSelectedOptions(
        qsParams[QS_PARAMS.investmentTypes],
        filterOptions.investmentTypes
      )
      const selectedMinimumReturnRate = resolveSelectedOptions(
        qsParams[QS_PARAMS.minimumReturnRate],
        filterOptions.minimumReturnRate
      )
      const selectedTimeHorizon = resolveSelectedOptions(
        qsParams[QS_PARAMS.timeHorizon],
        filterOptions.timeHorizon
      )
      const selectedRestrictions = resolveSelectedOptions(
        qsParams[QS_PARAMS.restrictions],
        filterOptions.restrictions
      )
      const selectedConstructionRisk = resolveSelectedOptions(
        qsParams[QS_PARAMS.constructionRisk],
        filterOptions.constructionRisk
      )
      const selectedMinimumEquityPercentage = resolveSelectedOptions(
        qsParams[QS_PARAMS.minimumEquityPercentage],
        filterOptions.minimumEquityPercentage
      )
      const selectedDesiredDealRole = resolveSelectedOptions(
        qsParams[QS_PARAMS.desiredDealRole],
        filterOptions.desiredDealRole
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
                investorTypes: qsParams[QS_PARAMS.investorTypes],
                assetClassesOfInterest:
                  qsParams[QS_PARAMS.assetClassesOfInterest],
                investorCompanyName: qsParams[QS_PARAMS.investorCompanyName],
                requiredChecksConducted:
                  qsParams[QS_PARAMS.requiredChecksConducted],
                dealTicketSize: qsParams[QS_PARAMS.dealTicketSize],
                investmentTypes: qsParams[QS_PARAMS.investmentTypes],
                minimumReturnRate: qsParams[QS_PARAMS.minimumReturnRate],
                timeHorizon: qsParams[QS_PARAMS.timeHorizon],
                restrictions: qsParams[QS_PARAMS.restrictions],
                constructionRisk: qsParams[QS_PARAMS.constructionRisk],
                minimumEquityPercentage:
                  qsParams[QS_PARAMS.minimumEquityPercentage],
                desiredDealRole: qsParams[QS_PARAMS.desiredDealRole],
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
            selectedInvestorTypes,
            selectedRequiredChecksConducted,
            selectedDealTicketSize,
            selectedInvestmentTypes,
            selectedMinimumReturnRate,
            selectedTimeHorizon,
            selectedRestrictions,
            selectedConstructionRisk,
            selectedMinimumEquityPercentage,
            selectedDesiredDealRole,
          }}
        >
          <CollectionFilters
            taskProps={{
              name: 'Large investment profiles filters',
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
              placeholder="Search asset classes"
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
            <RoutedTypeahead
              isMulti={true}
              legend="Investor type"
              name="investor-type"
              qsParam={QS_PARAMS.investorTypes}
              placeholder="Search investor type"
              options={filterOptions.investorTypes}
              selectedOptions={selectedInvestorTypes}
              data-test="investor-type-filter"
            />
            <RoutedTypeahead
              isMulti={true}
              legend="Check clearance"
              name="required-checks-conducted"
              qsParam={QS_PARAMS.requiredChecksConducted}
              placeholder="Check clearance"
              options={filterOptions.requiredChecksConducted}
              selectedOptions={selectedRequiredChecksConducted}
              data-test="required-checks-conducted-filter"
            />
            <RoutedTypeahead
              isMulti={true}
              legend="Deal ticket size"
              name="deal-ticket-size"
              qsParam={QS_PARAMS.dealTicketSize}
              placeholder="Search ticket sizes"
              options={filterOptions.dealTicketSize}
              selectedOptions={selectedDealTicketSize}
              data-test="deal-ticket-size-filter"
            />
            <RoutedTypeahead
              isMulti={true}
              legend="Types of investment"
              name="types-of-investment"
              qsParam={QS_PARAMS.investmentTypes}
              placeholder="Search types"
              options={filterOptions.investmentTypes}
              selectedOptions={selectedInvestmentTypes}
              data-test="types-of-investment-filter"
            />
            <RoutedTypeahead
              isMulti={true}
              legend="Minimum Return Rate"
              name="minimum-return-rate"
              qsParam={QS_PARAMS.minimumReturnRate}
              placeholder="Search return rates"
              options={filterOptions.minimumReturnRate}
              selectedOptions={selectedMinimumReturnRate}
              data-test="minimum-return-rate-filter"
            />
            <RoutedTypeahead
              isMulti={true}
              legend="Time horizon tenor"
              name="time-horizon-tenor"
              qsParam={QS_PARAMS.timeHorizon}
              placeholder="Search time horizons"
              options={filterOptions.timeHorizon}
              selectedOptions={selectedTimeHorizon}
              data-test="time-horizon-tenor-filter"
            />
            <RoutedTypeahead
              isMulti={true}
              legend="Restrictions and Conditions"
              name="restrictions-conditions"
              qsParam={QS_PARAMS.restrictions}
              placeholder="Search restrictions"
              options={filterOptions.restrictions}
              selectedOptions={selectedRestrictions}
              data-test="restrictions-conditions-filter"
            />
            <RoutedTypeahead
              isMulti={true}
              legend="Construction risk"
              name="construction-risk"
              qsParam={QS_PARAMS.constructionRisk}
              placeholder="Search risks"
              options={filterOptions.constructionRisk}
              selectedOptions={selectedConstructionRisk}
              data-test="construction-risk-filter"
            />
            <RoutedTypeahead
              isMulti={true}
              legend="Minimum equity percentage"
              name="minimum-equity-percentage"
              qsParam={QS_PARAMS.minimumEquityPercentage}
              placeholder="Search percentages"
              options={filterOptions.minimumEquityPercentage}
              selectedOptions={selectedMinimumEquityPercentage}
              data-test="minimum-equity-percentage-filter"
            />
            <RoutedTypeahead
              isMulti={true}
              legend="Desired deal role"
              name="desired-deal-role"
              qsParam={QS_PARAMS.desiredDealRole}
              placeholder="Search deal roles"
              options={filterOptions.desiredDealRole}
              selectedOptions={selectedDesiredDealRole}
              data-test="desired-deal-role-filter"
            />
          </CollectionFilters>
        </FilteredCollectionList>
      )
    }}
  </Route>
)

export default connect((state) => state[ID])(LargeCapitalProfileCollection)
