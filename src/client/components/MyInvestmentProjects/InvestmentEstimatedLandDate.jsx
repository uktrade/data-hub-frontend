import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typography } from '@govuk-react/lib'
import { SPACING } from '@govuk-react/constants'
import { YELLOW, BLACK } from 'govuk-colours'
import { format } from 'date-fns'

import { getDifferenceInDays } from '../../utils/date-utils'

const StyledPanel = styled('div')`
  padding: ${SPACING.SCALE_4};
  color: ${BLACK};
  background-color: ${YELLOW};
`
const StyledTitle = styled('h2')`
  margin-top: ${SPACING.SCALE_4};
  margin-bottom: ${SPACING.SCALE_4};
  text-align: center;
  font-size: ${typography.font({ size: 36, weight: 'bold' })};
`
const StyledBody = styled('div')`
  text-align: center;
  font-size: ${typography.font({ size: 16 })};
`

const InvestmentEstimatedLandDate = ({ estimatedLandDate }) => (
  <StyledPanel>
    <StyledBody>Estimated land date</StyledBody>
    <StyledTitle>{getDifferenceInDays(estimatedLandDate)}</StyledTitle>
    <StyledBody>{format(estimatedLandDate, 'ddd, DD MMM YYYY')}</StyledBody>
  </StyledPanel>
)

InvestmentEstimatedLandDate.propTypes = {
  estimatedLandDate: PropTypes.string.isRequired,
}

export default InvestmentEstimatedLandDate
