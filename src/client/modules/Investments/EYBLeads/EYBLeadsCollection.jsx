import React from 'react'
import qs from 'qs'

import {
  CollectionFilters,
  FilteredCollectionList,
  Filters,
  FilterToggleSection,
} from '../../../components'
import {
  listSkeletonPlaceholder,
  ToggleHeadingPlaceholder,
} from '../../../components/SkeletonPlaceholder'

import { sanitizeFilter } from '../../../filters'

const QS_PARAMS = {
  eybLeadCompanyName: 'eybLead_company_name',
}

const resolveSelectedOptions = (values = [], options = []) =>
  values
    .map((id) => options.filter(({ value }) => value === id)[0])
    .filter(Boolean)

const EYBLeadCollection = ({ count, results, isComplete, filterOptions }) => {
  const qsParams = qs.parse(location.search.slice(1))
  const selectedAssetClassesOfInterest = resolveSelectedOptions(
    qsParams[QS_PARAMS.assetClassesOfInterest],
    filterOptions.assetClassesOfInterest
  )
  return (
    <FilteredCollectionList
      count={count}
      results={results}
      isComplete={isComplete}
      collectionName="eybLeads"
      sanitizeFiltersForAnalytics={({ eybLeadCompanyName }) => ({
        ...sanitizeFilter(eybLeadCompanyName, 'Company name'),
      })}
      taskProps={{
        name: TASK_GET_PROFILES_LIST,
        id: ID,
        progressMessage: 'Loading profiles',
        renderProgress: listSkeletonPlaceholder({
          listItemFields: 2,
        }),
        startOnRender: {
          payload: {
            page: parseInt(qsParams.page, 10),
            assetClassesOfInterest: qsParams[QS_PARAMS.assetClassesOfInterest],
            eybLeadCompanyName: qsParams[QS_PARAMS.eybLeadCompanyName],
          },
          onSuccessDispatch: INVESTMENTS__PROFILES_LOADED,
        },
      }}
      baseDownloadLink="/investments/profiles/export"
      entityName="eybLead"
      selectedFilters={{
        eybLeadCompanyName: {
          queryParam: QS_PARAMS.investorCompanyName,
          options: resolveSelectedEYBLeadCompanyName(),
        },
        assetClassesOfInterest: {
          queryParam: QS_PARAMS.assetClassesOfInterest,
          options: selectedAssetClassesOfInterest,
        },
      }}
    >
      <CollectionFilters
        taskProps={{
          name: 'Large investment profiles filters',
          id: 'investments/profiles',
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
        <FilterToggleSection
          id="FilteredLargeCapitalProfileCollection.core-filters"
          label="Core filters"
        >
          <Filters.Typeahead
            isMulti={true}
            label="Sector of interest"
            name="asset-class"
            qsParam={QS_PARAMS.assetClassesOfInterest}
            placeholder="Search sector of interest"
            options={filterOptions.assetClassesOfInterest}
            selectedOptions={selectedAssetClassesOfInterest}
            data-test="asset-class-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label="Country of company origin"
            name="country"
            qsParam={QS_PARAMS.countryOfOrigin}
            placeholder="Search country"
            options={filterOptions.countries}
            selectedOptions={selectedCountries}
            data-test="country-filter"
          />
          <Filters.Input
            id="LargeCapitalProfileCollection.investor-company-name"
            qsParam="investor_company_name"
            name="investor-company-name"
            label="Company name"
            placeholder="Search company name"
          />
        </FilterToggleSection>
        <FilterToggleSection
          id="FilteredLargeCapitalProfileCollection.investor-details-filters"
          label="Investor details"
        >
          <Filters.Typeahead
            isMulti={true}
            label="Investor type"
            name="investor-type"
            qsParam={QS_PARAMS.investorTypes}
            placeholder="Search investor type"
            options={filterOptions.investorTypes}
            selectedOptions={selectedInvestorTypes}
            data-test="investor-type-filter"
          />
          <Filters.NumericRange
            qsParam={QS_PARAMS.globalAssetsUnderManagement}
            id="LargeCapitalProfileCollection.global-assets-under-management"
            label="Global assets under management £"
          />
          <Filters.NumericRange
            qsParam={QS_PARAMS.investableCapital}
            id="LargeCapitalProfileCollection.investable-capital"
            label="Investable capital £"
          />
          <Filters.Typeahead
            isMulti={true}
            label="Check clearance"
            name="required-checks-conducted"
            qsParam={QS_PARAMS.requiredChecksConducted}
            placeholder="Search clearance"
            options={filterOptions.requiredChecksConducted}
            selectedOptions={selectedRequiredChecksConducted}
            data-test="required-checks-conducted-filter"
          />
        </FilterToggleSection>
        <FilterToggleSection
          id="FilteredLargeCapitalProfileCollection.investor-requirements-filters"
          label="Investor requirements"
        >
          <Filters.Typeahead
            isMulti={true}
            label="Deal ticket size"
            name="deal-ticket-size"
            qsParam={QS_PARAMS.dealTicketSize}
            placeholder="Search deal ticket size"
            options={filterOptions.dealTicketSize}
            selectedOptions={selectedDealTicketSize}
            data-test="deal-ticket-size-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label="Types of investment"
            name="types-of-investment"
            qsParam={QS_PARAMS.investmentTypes}
            placeholder="Search types of investment"
            options={filterOptions.investmentTypes}
            selectedOptions={selectedInvestmentTypes}
            data-test="types-of-investment-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label="Minimum return rate"
            name="minimum-return-rate"
            qsParam={QS_PARAMS.minimumReturnRate}
            placeholder="Search return rate"
            options={filterOptions.minimumReturnRate}
            selectedOptions={selectedMinimumReturnRate}
            data-test="minimum-return-rate-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label="Time horizon"
            name="time-horizon-tenor"
            qsParam={QS_PARAMS.timeHorizon}
            placeholder="Search time horizon"
            options={filterOptions.timeHorizon}
            selectedOptions={selectedTimeHorizon}
            data-test="time-horizon-tenor-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label="Restrictions and conditions"
            name="restrictions-conditions"
            qsParam={QS_PARAMS.restrictions}
            placeholder="Search restrictions"
            options={filterOptions.restrictions}
            selectedOptions={selectedRestrictions}
            data-test="restrictions-conditions-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label="Construction risk"
            name="construction-risk"
            qsParam={QS_PARAMS.constructionRisk}
            placeholder="Search construction risk"
            options={filterOptions.constructionRisk}
            selectedOptions={selectedConstructionRisk}
            data-test="construction-risk-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label="Minimum equity percentage"
            name="minimum-equity-percentage"
            qsParam={QS_PARAMS.minimumEquityPercentage}
            placeholder="Search equity percentage"
            options={filterOptions.minimumEquityPercentage}
            selectedOptions={selectedMinimumEquityPercentage}
            data-test="minimum-equity-percentage-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label="Desired deal role"
            name="desired-deal-role"
            qsParam={QS_PARAMS.desiredDealRole}
            placeholder="Search desired deal role"
            options={filterOptions.desiredDealRole}
            selectedOptions={selectedDesiredDealRole}
            data-test="desired-deal-role-filter"
          />
        </FilterToggleSection>
        <FilterToggleSection
          id="FilteredLargeCapitalProfileCollection.location-filters"
          label="Location"
        >
          <Filters.Typeahead
            isMulti={true}
            label="UK regions of interest"
            name="uk-regions-of-interest"
            qsParam={QS_PARAMS.ukRegionsOfInterest}
            placeholder="Search UK region"
            options={filterOptions.ukRegionsOfInterest}
            selectedOptions={selectedUkRegionsOfInterest}
            data-test="uk-regions-of-interest"
          />
        </FilterToggleSection>
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default EYBLeadCollection
