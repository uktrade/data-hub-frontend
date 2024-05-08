import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import styled from 'styled-components'
import pluralize from 'pluralize'
import { H2 } from '@govuk-react/heading'
import { HEADING_SIZES } from '@govuk-react/constants'

import CollectionHeaderRow from './CollectionHeaderRow'
import { BLACK, GREY_3 } from '../../../client/utils/colours'
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

function CollectionHeader({
  totalItems,
  collectionName = 'result',
  addItemUrl,
  shouldPluralize = true,
  ...rest
}) {
  const formattedTotal = decimal(totalItems)
  const counterSuffix = shouldPluralize
    ? pluralize(collectionName, totalItems)
    : collectionName

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
    <CollectionHeaderRow primary={true} actions={actions} {...rest}>
      <StyledHeaderText data-test="collection-header-name">
        <StyledResultCount data-test="collection-count">
          {formattedTotal}
        </StyledResultCount>
        {` ${counterSuffix}`}
      </StyledHeaderText>
    </CollectionHeaderRow>
  )
}

CollectionHeader.propTypes = {
  totalItems: PropTypes.number.isRequired,
  collectionName: PropTypes.string.isRequired,
  addItemUrl: PropTypes.string,
}

export default CollectionHeader
