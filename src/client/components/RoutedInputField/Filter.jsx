import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import RoutedFilterInput from '../RoutedInput/Filter'
import FilterLabel from '../FilterLabel'

const StyledFilterLabel = styled(FilterLabel)({
  marginBottom: 32,
})

const RoutedInputFieldFilter = ({ label, ...props }) => (
  <StyledFilterLabel>
    {label}
    <RoutedFilterInput {...props} />
  </StyledFilterLabel>
)

RoutedInputFieldFilter.propTypes = {
  label: PropTypes.node.isRequired,
}

export default RoutedInputFieldFilter
