import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
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

import {
  BLACK,
  ERROR_COLOUR,
  FOCUS_COLOUR,
  TEXT_COLOUR,
} from '../../../client/utils/colours'
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
  ':focus': {
    outline: '3px solid transparent',
    color: BLACK,
    boxShadow: `0 -2px ${FOCUS_COLOUR}, 0 4px ${BLACK}`,
    textDecoration: 'none',
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

/**
 * When a user makes an error, you must show both an error summary and an error message next to each answer that contains an error. More information can be found on the [GDS Design system](https://design-system.service.gov.uk/components/error-summary/)
 *
 * Use this component at the top of a page to summarise any errors a user has made.
 */
const ErrorSummary = React.forwardRef(
  (
    { heading = 'There is a problem', description = null, errors, ...props },
    ref
  ) => (
    <StyledErrorSummary tabIndex={-1} {...props} ref={ref}>
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
)

ErrorSummary.propTypes = {
  /**
   * Text for the heading
   */
  heading: PropTypes.string,
  /**
   * Text for description
   */
  description: PropTypes.string,
  /**
   * The list of error descriptions and their target id's
   */
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      targetName: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired
  ),
}

export default ErrorSummary
