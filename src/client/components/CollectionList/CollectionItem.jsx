import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import { H3 } from '@govuk-react/heading'
import Link from '@govuk-react/link'
import { HEADING_SIZES, SPACING } from '@govuk-react/constants'
import { GREY_2 } from 'govuk-colours'
import Details from '@govuk-react/details'
import Badge from '../Badge/'
import Metadata from '../../components/Metadata/'

const ItemWrapper = styled('div')`
  border-bottom: 1px solid ${GREY_2};
  padding: ${SPACING.SCALE_3} 0;
`

const StyledBadgesWrapper = styled('div')`
  float: right;
  & > * {
    margin-right: ${SPACING.SCALE_1};
    &:last-child {
      margin-right: 0;
    }
  }
`

const StyledHeader = styled(H3)`
  font-size: ${HEADING_SIZES.SMALL}px;
`

const StyledLinkHeader = styled(StyledHeader)`
  & > a:link,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
  }
`

const StyledSubheading = styled('h4')`
  font-size: 14px;
  line-height: 20px;
  color: #6f777b;
  font-weight: normal;
  margin: -${SPACING.SCALE_3} 0 ${SPACING.SCALE_2} 0;
`

const StyledDetails = styled(Details)`
  margin: ${SPACING.SCALE_3} 0 0 0;
`

const CollectionItem = ({
  headingText,
  subheading,
  headingUrl,
  badges,
  metadata,
  type,
}) => {
  const summaryMessage = type ? `View ${type} details` : 'View details'

  return (
    <ItemWrapper>
      {badges && (
        <StyledBadgesWrapper>
          {badges.map((badge) => (
            <Badge key={badge.text} borderColour={badge.borderColour}>
              {badge.text}
            </Badge>
          ))}
        </StyledBadgesWrapper>
      )}

      {headingUrl ? (
        <StyledLinkHeader>
          <Link href={headingUrl}>{headingText}</Link>
        </StyledLinkHeader>
      ) : (
        <StyledHeader>{headingText}</StyledHeader>
      )}

      {subheading && <StyledSubheading>{subheading}</StyledSubheading>}

      {metadata && metadata.length > 4 ? (
        <>
          <StyledDetails summary={summaryMessage}>
            <Metadata rows={metadata} />
          </StyledDetails>
        </>
      ) : (
        <Metadata rows={metadata} />
      )}
    </ItemWrapper>
  )
}

CollectionItem.propTypes = {
  headingUrl: PropTypes.string,
  name: PropTypes.string.isRequired,
  subheading: PropTypes.string,
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      borderColour: PropTypes.string,
    })
  ),
  metadata: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.node.isRequired,
    })
  ),
  type: PropTypes.string,
}

CollectionItem.defaultProps = {
  badges: null,
  subheading: null,
  metadata: null,
  headingUrl: null,
  type: null,
}

export default CollectionItem
