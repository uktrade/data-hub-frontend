import React from 'react'
import PropTypes from 'prop-types'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'
import { GREY_1, BLUE } from 'govuk-colours'
import styled from 'styled-components'

const StyledActivitySubject = styled('h3')`
  color: ${GREY_1};
  font-size: ${FONT_SIZE.SIZE_20};
  font-weight: ${FONT_WEIGHTS.bold};
  line-height: ${FONT_SIZE.SIZE_24};
  margin-top: ${SPACING.SCALE_2};
  margin-bottom: ${SPACING.SCALE_2};
  & > a:link,
  a:visited,
  a:hover,
  a:active {
    text-decoration: none;
    color: ${BLUE};
  }
`

const ActivityCardSubject = ({ children }) => {
  return <StyledActivitySubject>{children}</StyledActivitySubject>
}

ActivityCardSubject.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ActivityCardSubject
