import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import GovUkTag from '@govuk-react/tag'
import { BLUE, WHITE } from 'govuk-colours'

// Most of these colours aren't included as part of the govuk-colours package so we need to define them here. Currrently we only need them here, but we can lift them out into their own file if we start to use them elsewhere.
const TAG_COLOURS = {
  default: {
    color: WHITE,
    background: BLUE,
  },
  grey: {
    color: '#454a4d',
    background: '#eff0f1',
  },
  green: {
    color: '#005a30',
    background: '#cce2d8',
  },
  turquoise: {
    color: '#10403c',
    background: '#bfe3e0',
  },
  blue: {
    color: '#144e81',
    background: '#d2e2f1',
  },
  purple: {
    color: '#3d2375',
    background: '#dbd5e9',
  },
  pink: {
    color: '#80224d',
    background: '#f7d7e6',
  },
  red: {
    color: '#942514',
    background: '#f6d7d2',
  },
  orange: {
    color: '#6e3619',
    background: '#fcd6c3',
  },
  yellow: {
    color: '#594d00',
    background: '#fff7bf',
  },
}

const StyledTag = styled(GovUkTag)`
  background-color: ${(props) => TAG_COLOURS[props.colour].background};
  color: ${(props) => TAG_COLOURS[props.colour].color};
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
