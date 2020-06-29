import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import GovUkTag from '@govuk-react/tag'
import TAG_COLOURS from './colours'

const StyledTag = styled(GovUkTag)`
  background-color: ${(props) => TAG_COLOURS[props.colour].background};
  color: ${(props) => TAG_COLOURS[props.colour].colour};
`

const Tag = ({ colour, children }) => (
  <StyledTag colour={colour}>{children}</StyledTag>
)

Tag.propTypes = {
  colour: PropTypes.oneOf(Object.keys(TAG_COLOURS)),
  children: PropTypes.node.isRequired,
}

Tag.defaultProps = {
  colour: 'default',
}

export default Tag
