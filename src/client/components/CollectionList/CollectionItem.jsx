import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'

import styled from 'styled-components'
import { H3 } from '@govuk-react/heading'
import Link from '@govuk-react/link'
import { HEADING_SIZES, MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import { GREY_2 } from 'govuk-colours'
import Badge from '../Badge/'
import Metadata from '../../components/Metadata/'

const ItemWrapper = styled('li')`
  border-bottom: 1px solid ${GREY_2};
  padding: ${SPACING.SCALE_3} 0;
`

const StyledBadgesWrapper = styled('div')`
  margin-bottom: ${SPACING.SCALE_2};

  & > * {
    margin-right: ${SPACING.SCALE_1};
    &:last-child {
      margin-right: 0;
    }
  }

  ${MEDIA_QUERIES.TABLET} {
    float: right;
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

const CollectionItem = ({
  headingText,
  subheading,
  headingUrl,
  badges,
  metadata,
  metadataRenderer,
  onClick,
  titleRenderer = null,
  useReactRouter = false,
}) => (
  <ItemWrapper data-test="collection-item">
    {badges && (
      <StyledBadgesWrapper>
        {badges.map((badge) => (
          <Badge key={badge.text} borderColour={badge.borderColour}>
            {badge.text}
          </Badge>
        ))}
      </StyledBadgesWrapper>
    )}

    {titleRenderer ? (
      titleRenderer(headingText, headingUrl)
    ) : headingUrl ? (
      <StyledLinkHeader>
        {useReactRouter ? (
          <Link as={RouterLink} to={headingUrl} onClick={onClick}>
            {headingText}
          </Link>
        ) : (
          <Link href={headingUrl} onClick={onClick}>
            {headingText}
          </Link>
        )}
      </StyledLinkHeader>
    ) : (
      <StyledHeader>{headingText}</StyledHeader>
    )}

    {subheading && <StyledSubheading>{subheading}</StyledSubheading>}

    {metadataRenderer ? (
      metadataRenderer(metadata)
    ) : (
      <Metadata rows={metadata} />
    )}
  </ItemWrapper>
)
CollectionItem.propTypes = {
  headingUrl: PropTypes.string,
  headingText: PropTypes.string.isRequired,
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
  metadataRenderer: PropTypes.func,
  titleRenderer: PropTypes.func,
}

export default CollectionItem
