import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import HintText from '@govuk-react/hint-text'

import RoutedFilterInput from '../RoutedInput/Filter'
import FilterLabel from '../FilterLabel'

const StyledFilterLabel = styled(FilterLabel)({
  marginBottom: 32,
})

const StyledHintText = styled(HintText)({
  fontSize: 16,
  color: '#505A5F',
})
const RoutedInputFieldFilter = ({ label, hint, ...props }) => (
  <StyledFilterLabel>
    {label}
    <StyledHintText>{hint}</StyledHintText>
    <RoutedFilterInput {...props} />
  </StyledFilterLabel>
)

RoutedInputFieldFilter.propTypes = {
  label: PropTypes.node.isRequired,
}

export default RoutedInputFieldFilter
