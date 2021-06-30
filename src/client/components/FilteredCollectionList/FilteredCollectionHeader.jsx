import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import styled from 'styled-components'
import pluralize from 'pluralize'
import { H2 } from '@govuk-react/heading'
import { BLACK, GREY_3 } from 'govuk-colours'
import { HEADING_SIZES, SPACING } from '@govuk-react/constants'

import {
  CollectionHeaderRow,
  RoutedFilterChips,
  FilterReset,
} from '../../components'

import { decimal } from '../../utils/number-utils'

const StyledHeaderText = styled(H2)`
  margin-top: 0;
  font-weight: normal;
  font-size: ${HEADING_SIZES.MEDIUM}px;
  margin-bottom: 0;
`

const StyledLink = styled.a`
  margin-bottom: 0;
`

const StyledResultCount = styled('span')`
  font-size: 36px;
  font-weight: 600;
  line-height: 1;
`

const CollectionHeaderRowContainer = styled('div')`
  > div {
    border: none;
  }
  border-bottom: ${SPACING.SCALE_1} solid ${BLACK};
`

const StyledDiv = styled('div')`
  display: flex;
  flex: 50%;
  align-items: center;
  flex-flow: nowrap;

  h2 {
    flex-grow: 2;
  }

  button {
    text-align: right;
    width: auto;
    margin: 0;
  }
`

const RoutedFilterChipsCollection = ({ selectedFilters }) => (
  <>
    {Object.keys(selectedFilters).map((key) => (
      <RoutedFilterChips
        key={key}
        selectedOptions={selectedFilters[key].options}
        qsParamName={selectedFilters[key].queryParam}
      />
    ))}
  </>
)
function FilteredCollectionHeader({
  totalItems,
  collectionName = 'result',
  addItemUrl = null,
  selectedFilters,
}) {
  const formattedTotal = decimal(totalItems)
  const counterSuffix = pluralize(collectionName, totalItems)
  const actions = addItemUrl && (
    <Button
      as={StyledLink}
      href={addItemUrl}
      buttonColour={GREY_3}
      buttonTextColour={BLACK}
      data-test="add-collection-item-button"
    >
      Add {collectionName}
    </Button>
  )

  return (
    <CollectionHeaderRowContainer>
      <CollectionHeaderRow actions={actions}>
        <StyledDiv>
          <StyledHeaderText>
            <StyledResultCount data-test="collectionCount">
              {formattedTotal}
            </StyledResultCount>{' '}
            {counterSuffix}
          </StyledHeaderText>
          <FilterReset data-test="clear-filters" id="clear-filters">
            Remove all filters
          </FilterReset>
        </StyledDiv>
      </CollectionHeaderRow>

      <CollectionHeaderRow data-test="filter-chips" id="filter-chips">
        <RoutedFilterChipsCollection selectedFilters={selectedFilters} />
        {/*
        FIXME: This is supposed to be a generic component,
        thus the chips should not be hardcoded here
        */}
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedService}
          qsParamName="service"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedDatesAfter}
          qsParamName="date_after"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedDatesBefore}
          qsParamName="date_before"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedKind}
          qsParamName="kind"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedStages}
          qsParamName="stage"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedAdvisers}
          qsParamName="adviser"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedOrganisers}
          qsParamName="organiser"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedInvestmentOriginCountries}
          qsParamName="country_investment_originates_from"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedCountryOfOrigin}
          qsParamName="country_of_origin"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedAssetClassesOfInterest}
          qsParamName="asset_classes_of_interest"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedInvestorCompanyName}
          qsParamName="investor_company_name"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedDealTicketSize}
          qsParamName="deal_ticket_size"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedMinimumReturnRate}
          qsParamName="minimum_return_rate"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedTimeHorizon}
          qsParamName="time_horizon"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedRestrictions}
          qsParamName="restriction"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedConstructionRisk}
          qsParamName="construction_risk"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedMinimumEquityPercentage}
          qsParamName="minimum_equity_percentage"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedDesiredDealRole}
          qsParamName="desired_deal_role"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedProjectStatuses}
          qsParamName="status"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedInvestmentTypes}
          qsParamName="investment_type"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedEventTypes}
          qsParamName="event_type"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedLikelihoodToLands}
          qsParamName="likelihood_to_land"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedStartDateAfter}
          qsParamName="start_date_after"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedStartDateBefore}
          qsParamName="start_date_before"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedEstimatedLandDatesBefore}
          qsParamName="estimated_land_date_before"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedEstimatedLandDatesAfter}
          qsParamName="estimated_land_date_after"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedActualLandDatesBefore}
          qsParamName="actual_land_date_before"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedActualLandDatesAfter}
          qsParamName="actual_land_date_after"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedInvolvementLevels}
          qsParamName="level_of_involvement_simplified"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedInvestorTypes}
          qsParamName="investor_type"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedRequiredChecksConducted}
          qsParamName="required_checks_conducted"
        />
        <RoutedFilterChips
          selectedOptions={selectedFilters.selectedUkRegionsOfInterest}
          qsParamName="uk_regions_of_interest"
        />
        <RoutedFilterChips
          selectedOptions={
            selectedFilters.selectedInvestableCapital?.min
              ? [
                  {
                    categoryLabel: 'Investable capital min',
                    label: selectedFilters.selectedInvestableCapital.min,
                  },
                ]
              : []
          }
          qsParamName="investable_capital_min"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={
            selectedFilters.selectedInvestableCapital?.max
              ? [
                  {
                    categoryLabel: 'Investable capital max',
                    label: selectedFilters.selectedInvestableCapital.max,
                  },
                ]
              : []
          }
          qsParamName="investable_capital_max"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={
            selectedFilters.selectedGlobalAssetsUnderManagement?.min
              ? [
                  {
                    categoryLabel: 'Global assets under management min',
                    label:
                      selectedFilters.selectedGlobalAssetsUnderManagement.min,
                  },
                ]
              : []
          }
          qsParamName="global_assets_under_management_min"
          showCategoryLabels={true}
        />
        <RoutedFilterChips
          selectedOptions={
            selectedFilters.selectedGlobalAssetsUnderManagement?.max
              ? [
                  {
                    categoryLabel: 'Global assets under management max',
                    label:
                      selectedFilters.selectedGlobalAssetsUnderManagement.max,
                  },
                ]
              : []
          }
          qsParamName="global_assets_under_management_max"
          showCategoryLabels={true}
        />
      </CollectionHeaderRow>
    </CollectionHeaderRowContainer>
  )
}

FilteredCollectionHeader.propTypes = {
  totalItems: PropTypes.number.isRequired,
  collectionName: PropTypes.string.isRequired,
  addItemUrl: PropTypes.string,
  selectedFilters: PropTypes.objectOf(
    PropTypes.shape({
      queryParam: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string,
          categoryLabel: PropTypes.string,
        })
      ),
    })
  ),
}

export default FilteredCollectionHeader
