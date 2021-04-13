import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { TEXT_COLOUR, ERROR_COLOUR } from 'govuk-colours'

import { H2 } from '@govuk-react/heading'
import Paragraph from '@govuk-react/paragraph'
import UnorderedList from '@govuk-react/unordered-list'
import Link from '@govuk-react/link'
import ListItem from '@govuk-react/list-item'

import {
  NTA_LIGHT,
  FONT_SIZE,
  BORDER_WIDTH,
  BORDER_WIDTH_MOBILE,
  LINE_HEIGHT,
  SPACING,
  MEDIA_QUERIES,
  RESPONSIVE_4,
} from '@govuk-react/constants'

import { spacing } from '@govuk-react/lib'

import { focusMixin } from '../../styles'

const StyledErrorText = styled(Link)({
  fontFamily: NTA_LIGHT,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  fontWeight: 700,
  marginBottom: SPACING.SCALE_1,
  textDecoration: 'underline',
  textDecorationSkipInk: 'none',
  textTransform: 'none',
  cursor: 'pointer',
  fontSize: FONT_SIZE.SIZE_16,
  lineHeight: LINE_HEIGHT.SIZE_16,
  ':link': {
    color: `${ERROR_COLOUR}`,
  },
  ':visited': {
    color: `${ERROR_COLOUR}`,
  },
  [MEDIA_QUERIES.LARGESCREEN]: {
    fontSize: FONT_SIZE.SIZE_19,
    lineHeight: LINE_HEIGHT.SIZE_19,
  },
  paddingTop: '4px',
  paddingBottom: '2px',
})

const StyledErrorSummary = styled('div')(
  {
    color: TEXT_COLOUR,
    padding: RESPONSIVE_4.mobile,
    border: `${BORDER_WIDTH_MOBILE} solid ${ERROR_COLOUR}`,
    ...focusMixin,
    [MEDIA_QUERIES.LARGESCREEN]: {
      padding: RESPONSIVE_4.tablet,
      border: `${BORDER_WIDTH} solid ${ERROR_COLOUR}`,
    },
  },
  spacing.withWhiteSpace({ marginBottom: 6 })
)

const ErrorSummary = ({
  heading = 'There is a problem',
  description = null,
  errors,
  ...props
}) => (
  <StyledErrorSummary tabIndex={-1} {...props}>
    <H2 size="MEDIUM">{heading}</H2>
    {description && <Paragraph mb={3}>{description}</Paragraph>}
    {errors.length > 0 && (
      <UnorderedList mb={0} listStyleType="none">
        {errors.map(({ targetName, text }) => (
          <ListItem key={targetName}>
            <StyledErrorText href={`#field-${targetName}`}>
              {text}
            </StyledErrorText>
          </ListItem>
        ))}
      </UnorderedList>
    )}
  </StyledErrorSummary>
)

ErrorSummary.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      targetName: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired
  ),
}

export default ErrorSummary
