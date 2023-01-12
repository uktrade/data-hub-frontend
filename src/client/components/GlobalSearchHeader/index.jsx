import React from 'react'
import PropTypes from 'prop-types'
import { BLACK, GREY_3 } from 'govuk-colours'
import { HEADING_SIZES, SPACING } from '@govuk-react/constants'
import { H2 } from '@govuk-react/heading'
import Button from '@govuk-react/button'
import styled from 'styled-components'
import pluralize from 'pluralize'
import { kebabCase } from 'lodash'

import {
  GlobalSearchHeaderRow,
  //   RoutedFilterChips,
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
  margin-left: 15px;
  white-space: nowrap;
`

const StyledResultCount = styled('span')`
  font-size: 36px;
  font-weight: 600;
  line-height: 1;
`

const GlobalSearchHeaderRowContainer = styled('div')`
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

function GlobalSearchHeader({
  count,
  countLabel = 'result',
  actionButtons = [],
  actionLinks = [],
  highlightTerm,
}) {
  const formattedTotal = decimal(count)
  const counterSuffix = pluralize(countLabel, count)
  const actions = actionButtons.map(
    (actionButton) =>
      actionButton?.url && (
        <Button
          id={`add-${kebabCase(countLabel)}`}
          as={StyledLink}
          href={actionButton.url}
          buttonColour={GREY_3}
          buttonTextColour={BLACK}
          data-test="add-collection-item-button"
        >
          {actionButton.label}
        </Button>
      )
  )
  const links = actionLinks.map(
    (actionLink) =>
      actionLink?.url && (
        <StyledLink
          id={`link-to-${kebabCase(actionLink.label)}`}
          href={actionLink.url}
          data-test="link-to-collection-list"
        >
          {actionLink.label}
        </StyledLink>
      )
  )
  return (
    <GlobalSearchHeaderRowContainer>
      <GlobalSearchHeaderRow actions={actions}>
        <StyledDiv>
          <StyledHeaderText>
            <StyledResultCount data-test="collectionCount">
              {formattedTotal}
            </StyledResultCount>{' '}
            {counterSuffix}
            {highlightTerm && <span> matching {highlightTerm}</span>}
          </StyledHeaderText>
        </StyledDiv>
        {links}
      </GlobalSearchHeaderRow>
    </GlobalSearchHeaderRowContainer>
  )
}

GlobalSearchHeader.propTypes = {
  count: PropTypes.number.isRequired,
  countLabel: PropTypes.string,
  actionButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  actionLinks: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  highlightTerm: PropTypes.string,
}

export default GlobalSearchHeader
