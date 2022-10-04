import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'
import { typography } from '@govuk-react/lib'
import { kebabCase } from 'lodash'

const StyledSectionHeader = styled('div')`
  ${typography.font({ size: 24, weight: 'bold' })};
  margin-bottom: ${SPACING.SCALE_4};
`

const SectionHeader = ({ type, children }) => (
  <StyledSectionHeader data-test={kebabCase(`${type}-header`)}>
    {children}
  </StyledSectionHeader>
)

SectionHeader.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
}

export default SectionHeader
