import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { WHITE, BLUE, LIGHT_BLUE_50 } from 'govuk-colours'
import { typography } from '@govuk-react/lib'
import { SPACING } from '@govuk-react/constants'

const StyledPanel = styled('div')`
  padding: ${SPACING.SCALE_4};
  color: ${WHITE};
  background-color: ${BLUE};
  a,
  a:visited {
    color: ${WHITE};
  }
  a:hover {
    color: ${LIGHT_BLUE_50};
  }
`
const StyledTitle = styled('h2')`
  margin-top: 0;
  font-size: ${typography.font({ size: 19, weight: 'bold' })};
`
const StyledBody = styled('div')`
  font-size: ${typography.font({ size: 16 })};
`

const Panel = ({ title, children, ...rest }) => (
  <StyledPanel {...rest}>
    <StyledTitle>{title}</StyledTitle>
    {children && <StyledBody>{children}</StyledBody>}
  </StyledPanel>
)

Panel.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element,
}

Panel.defaultProps = {
  children: null,
}

export default Panel
