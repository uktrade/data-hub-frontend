import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { SPACING } from '@govuk-react/constants'

import {
  CollectionFilters,
  FilteredCollectionList,
  FilterToggleSection,
  Filters,
  DefaultLayout,
  Panel,
} from '../../../../components'
import {
  companyCollectionListTask,
  companyCollectionListMetadataTask,
} from '../../../Companies/utils'
import { LABELS } from '../../../Companies/CollectionList/constants'
import { ID, state2props, TASK_GET_COMPANIES } from './state'
import urls from '../../../../../lib/urls'

const StyledPanel = styled(Panel)`
  margin-bottom: ${SPACING.SCALE_3};
`

const SelectOrderCompany = ({
  companyId,
  companyName,
  payload,
  currentAdviserId,
  optionMetadata,
  selectedFilters,
  ...props
}) => (
  <DefaultLayout
    pageTitle="Select a company"
    heading="Select a company"
    breadcrumbs={[
      {
        link: urls.dashboard.index(),
        text: 'Home',
      },
      { link: urls.omis.index(), text: 'Orders (OMIS)' },
      { text: 'Add an order' },
    ]}
  >
    <StyledPanel>
      <p>Select the company that will pay for the order.</p>
    </StyledPanel>
    <FilteredCollectionList
      collectionName="company"
      sortOptions={optionMetadata.sortOptions}
      taskProps={companyCollectionListTask(TASK_GET_COMPANIES, ID, {
        ...payload,
      })}
      selectedFilters={selectedFilters}
      entityName="company"
      entityNamePlural="companies"
      {...props}
    >
      <CollectionFilters taskProps={companyCollectionListMetadataTask(ID)}>
        <FilterToggleSection
          id="CompanyCollection.company-details-filters"
          label="Company details"
          isOpen={true}
        >
          <Filters.Input
            id="CompanyCollection.name"
            qsParam="name"
            name="name"
            label={LABELS.companyName}
            placeholder="Search company name"
            data-test="company-name-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label={LABELS.sector}
            name="sector"
            qsParam="sector_descends"
            placeholder="Search sector"
            options={optionMetadata.sectorOptions}
            selectedOptions={selectedFilters.sectors.options}
            data-test="sector-filter"
          />
        </FilterToggleSection>

        <FilterToggleSection
          id="CompanyCollection.location-details-filters"
          label="Location details"
          isOpen={false}
        >
          <Filters.Typeahead
            isMulti={true}
            label={LABELS.country}
            name="country"
            qsParam="country"
            placeholder="Search country"
            options={optionMetadata.countryOptions}
            selectedOptions={selectedFilters.countries.options}
            data-test="country-filter"
          />
          <Filters.Input
            id="CompanyCollection.postcode"
            qsParam="uk_postcode"
            name="uk_postcode"
            label={LABELS.ukPostcode}
            placeholder="Search UK postcode"
            data-test="uk-postcode-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label={LABELS.ukRegion}
            name="uk_region"
            qsParam="uk_region"
            placeholder="Search UK region"
            options={optionMetadata.ukRegionOptions}
            selectedOptions={selectedFilters.ukRegions.options}
            data-test="uk-region-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label={LABELS.usState}
            name="us_state"
            qsParam="us_state"
            placeholder="Search US state"
            options={optionMetadata.usStateOptions}
            selectedOptions={selectedFilters.usStates.options}
            data-test="us-state-filter"
          />
          <Filters.Typeahead
            isMulti={true}
            label={LABELS.canadianProvince}
            name="canadian_province"
            qsParam="canadian_province"
            placeholder="Search Canadian province"
            options={optionMetadata.canadianProvinceOptions}
            selectedOptions={selectedFilters.canadianProvinces.options}
            data-test="canadian-province-filter"
          />
        </FilterToggleSection>
      </CollectionFilters>
    </FilteredCollectionList>
  </DefaultLayout>
)

export default connect(state2props)(SelectOrderCompany)
