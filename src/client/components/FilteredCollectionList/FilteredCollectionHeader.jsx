import React from 'react'
import PropTypes from 'prop-types'
import { BLACK, GREY_3 } from 'govuk-colours'
import { HEADING_SIZES, SPACING } from '@govuk-react/constants'
import { FONT_SIZE, FONT_WEIGHTS } from '@govuk-react/constants'
import { H2 } from '@govuk-react/heading'
import Button from '@govuk-react/button'
import styled from 'styled-components'
import pluralize from 'pluralize'

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

const StyledSummary = styled('div')`
  font-size: ${FONT_SIZE.SIZE_16};
`

const StyledSummaryTotal = styled('span')`
  font-weight: ${FONT_WEIGHTS.bold};
`

const RoutedFilterChipsCollection = ({ selectedFilters }) => {
  return (
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
}
function FilteredCollectionHeader({
  totalItems,
  summary,
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
      {summary && (
        <StyledSummary data-test="summary">
          Total value:{' '}
          <StyledSummaryTotal>
            £{decimal(summary.total_subtotal_cost / 100)}
          </StyledSummaryTotal>
        </StyledSummary>
      )}
      <CollectionHeaderRow data-test="filter-chips" id="filter-chips">
        <RoutedFilterChipsCollection selectedFilters={selectedFilters} />
      </CollectionHeaderRow>
    </CollectionHeaderRowContainer>
  )
}

FilteredCollectionHeader.propTypes = {
  totalItems: PropTypes.number.isRequired,
  summary: PropTypes.object,
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
