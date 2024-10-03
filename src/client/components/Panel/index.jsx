import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typography } from '@govuk-react/lib'
import { SPACING } from '@govuk-react/constants'

import { WHITE, BLUE, LIGHT_BLUE_50 } from '../../../client/utils/colours'

const focusMixin = {
  ':focus': { color: BLUE },
}
const hoverMixin = { color: LIGHT_BLUE_50 }

const StyledPanel = styled('div')({
  padding: SPACING.SCALE_4,
  color: WHITE,
  backgroundColor: BLUE,
  a: {
    ':link': { color: WHITE },
    ':visited': { color: WHITE },
    ':hover': hoverMixin,
    ...focusMixin,
    ':active': {
      ...hoverMixin,
      ...focusMixin,
    },
  },
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
