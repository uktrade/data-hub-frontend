import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import HintText from '@govuk-react/hint-text'
import { SPACING } from '@govuk-react/constants'

import RoutedFilterInput from '../RoutedInput/Filter'
import FilterLabel from '../FilterLabel'

const StyledFilterLabel = styled(FilterLabel)({
  marginBottom: SPACING.SCALE_5,
})

const StyledHintText = styled(HintText)({
  marginBottom: SPACING.SCALE_2,
})

const RoutedAventriIdFieldFilter = ({ label, hint, ...props }) => (
  <StyledFilterLabel>
    {label}
    <StyledHintText>{hint}</StyledHintText>
    <RoutedFilterInput {...props} />
  </StyledFilterLabel>
)

RoutedAventriIdFieldFilter.propTypes = {
  label: PropTypes.node.isRequired,
  hint: PropTypes.string,
}

export default RoutedAventriIdFieldFilter
