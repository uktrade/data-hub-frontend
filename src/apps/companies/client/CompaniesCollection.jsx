import React from 'react'
import { connect } from 'react-redux'

import {
  COMPANIES__LOADED,
  COMPANIES__SET_COMPANIES_METADATA,
  COMPANIES__SELECTED_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER,
} from '../../../client/actions'
import {
  CollectionFilters,
  FilteredCollectionList,
  RoutedAdvisersTypeahead,
  RoutedCheckboxGroupField,
  RoutedInputField,
  RoutedTypeahead,
} from '../../../client/components'

import * as labels from './labels'
import {
  ID,
  TASK_GET_COMPANIES_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER_NAME,
  TASK_GET_COMPANIES_LIST,
  TASK_GET_COMPANIES_METADATA,
  state2props,
} from './state'

const CompaniesCollection = ({
  payload,
  currentAdviserId,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_COMPANIES_LIST,
    id: ID,
    progressMessage: 'loading companies',
    startOnRender: {
      payload,
      onSuccessDispatch: COMPANIES__LOADED,
    },
  }

  const collectionListMetadataTask = {
    name: TASK_GET_COMPANIES_METADATA,
    id: ID,
    progressMessage: 'loading metadata',
    startOnRender: {
      onSuccessDispatch: COMPANIES__SET_COMPANIES_METADATA,
    },
  }

  const leadItaGlobalAccountManagerTask = {
    name: TASK_GET_COMPANIES_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER_NAME,
    id: ID,
    progressMessage: 'loading advisers',
    startOnRender: {
      payload: payload.one_list_group_global_account_manager,
      onSuccessDispatch: COMPANIES__SELECTED_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER,
    },
  }

  return (
    <FilteredCollectionList
      {...props}
      collectionName="Company"
      sortOptions={optionMetadata.sortOptions}
      taskProps={collectionListTask}
      selectedFilters={selectedFilters}
      baseDownloadLink="/companies/export"
      entityName="company"
      entityNamePlural="companies"
      addItemUrl="/companies/create"
      defaultQueryParams={{
        archived: ['false'],
        page: 1,
      }}
    >
      <CollectionFilters taskProps={collectionListMetadataTask}>
        <RoutedCheckboxGroupField
          legend={labels.HEADQUARTER_TYPE}
          name="headquarter_type"
          qsParam="headquarter_type"
          options={optionMetadata.headquarterTypeOptions}
          selectedOptions={selectedFilters.selectedHeadquarterTypes}
          data-test="headquarter-type-filter"
        />
        <RoutedInputField
          id="CompanyCollection.name"
          qsParam="name"
          name="name"
          label={labels.COMPANY_NAME}
          placeholder="Search company name"
          data-test="company-name-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={labels.SECTOR}
          name="sector"
          qsParam="sector_descends"
          placeholder="Search sector"
          options={optionMetadata.sectorOptions}
          selectedOptions={selectedFilters.selectedSectors}
          data-test="sector-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={labels.COUNTRY}
          name="country"
          qsParam="country"
          placeholder="Search country"
          options={optionMetadata.countryOptions}
          selectedOptions={selectedFilters.selectedCountries}
          data-test="country-filter"
        />
        <RoutedInputField
          id="CompanyCollection.postcode"
          qsParam="uk_postcode"
          name="uk_postcode"
          label={labels.UK_POSTCODE}
          placeholder="Search UK postcode"
          data-test="uk-postcode-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={labels.UK_REGION}
          name="uk_region"
          qsParam="uk_region"
          placeholder="Search UK region"
          options={optionMetadata.ukRegionOptions}
          selectedOptions={selectedFilters.selectedUkRegions}
          data-test="uk-region-filter"
        />
        <RoutedCheckboxGroupField
          legend={labels.COMPANY_STATUS}
          name="archived"
          qsParam="archived"
          options={optionMetadata.companyStatuses}
          selectedOptions={selectedFilters.selectedCompanyStatuses}
          data-test="company-status-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={labels.CURRENTLY_EXPORTING_TO}
          name="export_to_countries"
          qsParam="export_to_countries"
          placeholder="Search country"
          options={optionMetadata.countryOptions}
          selectedOptions={selectedFilters.selectedExportToCountries}
          data-test="currently-exporting-to-country-filter"
        />
        <RoutedTypeahead
          isMulti={true}
          legend={labels.FUTURE_COUNTRIES_OF_INTEREST}
          name="future_interest_countries"
          qsParam="future_interest_countries"
          placeholder="Search country"
          options={optionMetadata.countryOptions}
          selectedOptions={selectedFilters.selectedFutureCountriesOfInterest}
          data-test="future-countries-of-interest-filter"
        />
        <RoutedAdvisersTypeahead
          isMulti={true}
          taskProps={leadItaGlobalAccountManagerTask}
          legend={labels.LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER}
          name="one_list_group_global_account_manager"
          qsParam="one_list_group_global_account_manager"
          placeholder="Search adviser"
          noOptionsMessage={() => <>No advisers found</>}
          selectedOptions={
            selectedFilters.selectedLeadItaOrGlobalAccountManagers
          }
          data-test="lead-ita-global-account-manager-filter"
        />
      </CollectionFilters>
    </FilteredCollectionList>
  )
}

export default connect(state2props)(CompaniesCollection)
