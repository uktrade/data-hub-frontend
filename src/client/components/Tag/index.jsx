import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import GovUkTag from '@govuk-react/tag'

import TAG_COLOUR_MAP, { TAG_COLOURS } from './colours'

const StyledTag = styled(GovUkTag)`
  white-space: nowrap;
  font-weight: normal;
  letter-spacing: normal;
  text-transform: none;
  color: ${(props) => TAG_COLOUR_MAP[props.colour]?.colour};
  background-color: ${(props) =>
    TAG_COLOUR_MAP[props.colour]?.backgroundColour};
`

/**
 * `Tag` is a customisable tag component based on the
 * [GovUK Design System Tag component](https://design-system.service.gov.uk/components/tag/).
 *
 * Use the `Tag` component to visually indicate a status or label. For example,
 * use it to show the completion status in a [task list](https://design-system.service.gov.uk/components/task-list/).
 *
 * ### Key Props
 * - `colour`: Apply a colour scheme based on keys in the `TAG_COLOUR_MAP` object.
 *   If omitted, defaults to a blue background with dark blue text.
 * - `children`: Content to display within the tag, typically status or label text.
 */
const Tag = ({ children, colour = TAG_COLOURS.BLUE, ...props }) => (
  <StyledTag colour={colour} {...props}>
    {children}
  </StyledTag>
)

Tag.propTypes = {
  /**
   * Content to display within the tag, such as a status or label text.
   */
  children: PropTypes.node.isRequired,
  /**
   * Colour scheme for the tag. Must be one of the keys defined in `TAG_COLOURS`.
   */
  colour: PropTypes.oneOf(Object.values(TAG_COLOURS)),
}

export default Tag
export { TAG_COLOURS }
