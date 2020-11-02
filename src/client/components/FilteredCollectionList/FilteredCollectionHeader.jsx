import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import styled from 'styled-components'
import pluralize from 'pluralize'
import { H2 } from '@govuk-react/heading'
import { BLACK, GREY_3 } from 'govuk-colours'
import { HEADING_SIZES, SPACING } from '@govuk-react/constants'
import CollectionHeaderRow from '../CollectionList/CollectionHeaderRow'
import { AdviserFilterChips } from '../../components'
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

function FilteredCollectionHeader({
  totalItems,
  collectionName = 'result',
  addItemUrl,
  selectedAdvisers,
}) {
  const formattedTotal = decimal(totalItems)
  const counterSuffix = pluralize(collectionName, totalItems)
  const hasFilters = selectedAdvisers.length > 0

  const actions = addItemUrl && (
    <Button
      as={StyledLink}
      href={addItemUrl}
      buttonColour={GREY_3}
      buttonTextColour={BLACK}
    >
      Add {collectionName}
    </Button>
  )

  return (
    <CollectionHeaderRowContainer>
      <CollectionHeaderRow actions={actions}>
        <StyledHeaderText>
          <StyledResultCount>{formattedTotal}</StyledResultCount>
          {` ${counterSuffix}`}
        </StyledHeaderText>
      </CollectionHeaderRow>
      {hasFilters && (
        <CollectionHeaderRow>
          <AdviserFilterChips selectedAdvisers={selectedAdvisers} />
        </CollectionHeaderRow>
      )}
    </CollectionHeaderRowContainer>
  )
}

FilteredCollectionHeader.propTypes = {
  totalItems: PropTypes.number.isRequired,
  collectionName: PropTypes.string.isRequired,
  addItemUrl: PropTypes.string,
}

FilteredCollectionHeader.defaultProps = {
  addItemUrl: null,
}

export default FilteredCollectionHeader
