import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import RoutedFilterInput from '../RoutedInput/Filter'
import FilterLabel from '../FilterLabel'

const StyledContainer = styled.div({
  display: 'flex',
  alignItems: 'baseline',
})

const StyledDivider = styled.div({
  padding: '0.5rem',
})

const StyledFieldset = styled.fieldset({
  marginBottom: 38,
})

const RoutedNumericRangeField = ({ id, qsParam, label, ...props }) => (
  <StyledFieldset {...props}>
    <FilterLabel as="legend">{label}</FilterLabel>
    <StyledContainer>
      <RoutedFilterInput
        id={`${id}-min`}
        qsParam={`${qsParam}_min`}
        type="number"
        placeholder="No min"
        aria-label={`${label} min`}
      />
      <StyledDivider>-</StyledDivider>
      <RoutedFilterInput
        id={`${id}-max`}
        qsParam={`${qsParam}_max`}
        type="number"
        placeholder="No max"
        aria-label={`${label} max`}
      />
    </StyledContainer>
  </StyledFieldset>
)

RoutedNumericRangeField.propTypes = {
  label: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  qsParam: PropTypes.string.isRequired,
}

export default RoutedNumericRangeField
