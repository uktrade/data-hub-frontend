import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typography } from '@govuk-react/lib'
import { SPACING } from '@govuk-react/constants'
import { YELLOW, BLACK } from 'govuk-colours'
import { format, endOfToday, differenceInDays } from 'date-fns'

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

const getDifferenceInDays = (estimatedLandDate) => {
  const today = endOfToday()
  const difference = differenceInDays(estimatedLandDate, today)
  return difference === 1
    ? difference + ' day'
    : difference === 0
    ? 'Today'
    : difference < 0
    ? difference * -1 + ' days ago'
    : difference + ' days'
}

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
