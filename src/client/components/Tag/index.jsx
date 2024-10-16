import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import GovUkTag from '@govuk-react/tag'

import { TAG_COLOURS } from '../../../client/utils/colours'

const StyledTag = styled(GovUkTag)`
  background-color: ${(props) => TAG_COLOURS[props.colour].background};
  color: ${(props) => TAG_COLOURS[props.colour].colour};
  white-space: nowrap;
  text-transform: ${(props) =>
    props.textTransform ? props.textTransform : 'uppercase'};
`

/**
 * `Tag` is a implementation of the [Tag](https://design-system.service.gov.uk/components/tag/) component from the GovUK Design System.
 *
 * Use the tag component when it’s possible for something to have more than one status and it’s useful for the user to know about that status.
 * For example, you can use a tag to show whether an item in a [task list](https://design-system.service.gov.uk/patterns/task-list-pages) has been ‘completed’.
 *
 * If no colour is specified the tag will default to a blue background and white text.
 */
const Tag = ({ colour = 'default', children, ...props }) => (
  <StyledTag colour={colour} {...props}>
    {children}
  </StyledTag>
)

Tag.propTypes = {
  /**
   * Dictates the `background-color` and `color`
   */
  colour: PropTypes.oneOf(Object.keys(TAG_COLOURS)),
  /**
   * Text of tag
   */
  children: PropTypes.node.isRequired,
}

export default Tag
