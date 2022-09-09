import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import HintText from '@govuk-react/hint-text'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'
import { GREY_1 } from 'govuk-colours'

import RoutedFilterInput from '../RoutedInput/Filter'
import FilterLabel from '../FilterLabel'

const StyledFilterLabel = styled(FilterLabel)({
  marginBottom: SPACING.SCALE_2,
})

const StyledHintText = styled(HintText)({
  fontSize: FONT_SIZE.SIZE_16,
  color: GREY_1,
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
}

export default RoutedAventriIdFieldFilter
