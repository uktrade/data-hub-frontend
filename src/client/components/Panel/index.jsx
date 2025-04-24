import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typography } from '@govuk-react/lib'
import { SPACING } from '@govuk-react/constants'

import { WHITE, BLUE } from '../../../client/utils/colours'

const StyledPanel = styled('div')({
  padding: SPACING.SCALE_4,
  color: WHITE,
  backgroundColor: BLUE,
})

const StyledTitle = styled('h2')`
  margin-top: 0;
  font-size: ${typography.font({ size: 19, weight: 'bold' })};
`
const StyledBody = styled('div')`
  font-size: ${typography.font({ size: 16 })};
`

/**
 * Making it easier for users to notice and find help content / DH updates
 */
const Panel = ({ title, children, ...rest }) => (
  <StyledPanel {...rest}>
    {title && <StyledTitle>{title}</StyledTitle>}
    {children && <StyledBody>{children}</StyledBody>}
  </StyledPanel>
)

Panel.propTypes = {
  /**
   * Text for title
   */
  title: PropTypes.string,
  /**
   * Text for panel
   */
  children: PropTypes.element,
}

export default Panel
