import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import { H3 } from '@govuk-react/heading'
import { HEADING_SIZES, MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import { GREY_2, DARK_GREY } from '../../utils/colours'
import Badge from '../Badge/'
import Metadata from '../../components/Metadata/'
import Tag from '../Tag'
import AccessibleLink from '../Link'

const ItemWrapper = styled('li')`
  border-bottom: 1px solid ${GREY_2};
  padding: ${SPACING.SCALE_3} 0;
`

export const StyledBadgesWrapper = styled('div')`
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

const StyledInlineTagWrapper = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: SPACING.SCALE_2,
  paddingBottom: '10px',
})

const StyledHeader = styled(H3)`
  font-size: ${HEADING_SIZES.SMALL}px;
`

const StyledSubheading = styled('p')`
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}px` : '14px')};
  line-height: 20px;
  color: ${DARK_GREY};
  font-weight: normal;
  margin: -${SPACING.SCALE_3} 0 ${SPACING.SCALE_2} 0;
`

const StyledButtonWrapper = styled('div')`
  margin-bottom: -30px;
  margin-right: 10px;

  ${MEDIA_QUERIES.TABLET} {
    text-align: right;
  }
`
const StyledFooterWrapper = styled('div')`
  margin-right: 10px;
  text-align: right;
`

export const renderTags = (tags) =>
  tags.map((tag, index) => (
    <Tag
      key={`tag_${index}`}
      colour={tag.colour}
      data-test={tag.dataTest ? tag.dataTest : 'collection-item-tag'}
    >
      {tag.text}
    </Tag>
  ))

const CollectionItem = ({
  headingText,
  subheading,
  subheadingUrl,
  headingUrl,
  badges,
  tags,
  metadata,
  metadataRenderer,
  onClick,
  titleRenderer = null,
  useReactRouter = false,
  buttons,
  footerRenderer,
  footerdata,
  showTagsInMetadata = false,
  getLinkText,
  getAriaLabel,
  ...itemProps
}) => {
  const itemDataForCustomFunctions = { headingText, metadata, ...itemProps }

  const linkTextToDisplay = getLinkText
    ? getLinkText(itemDataForCustomFunctions)
    : headingText

  const ariaLabelToUse = getAriaLabel
    ? getAriaLabel(itemDataForCustomFunctions)
    : undefined

  return (
    <ItemWrapper data-test="collection-item">
      {/* tags take precidence over badges as they are the newer style, however
      not all components have been updated so the component needs to handle
      rendering both props */}
      {tags && tags.length > 0 && !showTagsInMetadata && (
        <StyledBadgesWrapper data-test="collection-item-tags">
          {renderTags(tags)}
        </StyledBadgesWrapper>
      )}

      {!tags && badges && (
        <StyledBadgesWrapper data-test="collection-item-badges">
          {badges.map((badge) => (
            <Badge key={badge.text} borderColour={badge.borderColour}>
              {badge.text}
            </Badge>
          ))}
        </StyledBadgesWrapper>
      )}

      {titleRenderer ? (
        titleRenderer(linkTextToDisplay, headingUrl)
      ) : headingUrl ? (
        <StyledHeader>
          {useReactRouter ? (
            <AccessibleLink
              showUnderline={false}
              as={RouterLink}
              to={headingUrl}
              onClick={onClick}
              aria-label={ariaLabelToUse}
            >
              {linkTextToDisplay}
            </AccessibleLink>
          ) : (
            <AccessibleLink
              showUnderline={false}
              href={headingUrl}
              onClick={onClick}
              aria-label={ariaLabelToUse}
            >
              {linkTextToDisplay}
            </AccessibleLink>
          )}
        </StyledHeader>
      ) : (
        <StyledHeader>{linkTextToDisplay}</StyledHeader>
      )}
      {subheading ? (
        subheadingUrl ? (
          <StyledSubheading
            data-test="collection-item-subheading"
            fontSize={19}
          >
            <AccessibleLink href={subheadingUrl}>{subheading}</AccessibleLink>
          </StyledSubheading>
        ) : (
          <StyledSubheading data-test="collection-item-subheading">
            {subheading}
          </StyledSubheading>
        )
      ) : null}

      {showTagsInMetadata && (
        <StyledInlineTagWrapper>{renderTags(tags)}</StyledInlineTagWrapper>
      )}
      {metadataRenderer ? (
        metadataRenderer(metadata)
      ) : (
        <Metadata rows={metadata} />
      )}
      {buttons && <StyledButtonWrapper>{buttons}</StyledButtonWrapper>}
      {footerRenderer && (
        <StyledFooterWrapper>{footerRenderer(footerdata)} </StyledFooterWrapper>
      )}
    </ItemWrapper>
  )
}

CollectionItem.propTypes = {
  headingUrl: PropTypes.string,
  headingText: PropTypes.string,
  subheading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  subheadingUrl: PropTypes.string,
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      borderColour: PropTypes.string,
    })
  ),
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      colour: PropTypes.string,
    })
  ),
  metadata: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.string,
      value: PropTypes.node,
    })
  ),
  type: PropTypes.string,
  metadataRenderer: PropTypes.func,
  titleRenderer: PropTypes.func,
  buttonRenderer: PropTypes.func,
  footerRenderer: PropTypes.func,
  getLinkText: PropTypes.func,
  getAriaLabel: PropTypes.func,
}

export default CollectionItem
