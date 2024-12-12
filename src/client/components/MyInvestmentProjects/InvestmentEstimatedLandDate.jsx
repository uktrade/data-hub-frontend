import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import {
  BLACK,
  BUTTON_COLOUR,
  GREY_2,
  RED,
  YELLOW,
  rgba,
} from '../../../client/utils/colours'

const {
  getDifferenceInDays,
  getDifferenceInDaysLabel,
} = require('../../utils/date')

const { formatDate, DATE_FORMAT_FULL_DAY } = require('../../utils/date-utils')

const StyledPanel = styled('div')`
  padding: ${SPACING.SCALE_2};
  color: ${BLACK};
  background-color: ${YELLOW};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const GreenPanel = styled(StyledPanel)`
  background-color: ${rgba(BUTTON_COLOUR, 0.3)};
`
const AmberPanel = styled(StyledPanel)`
  background-color: ${rgba(YELLOW, 0.5)};
`
const RedPanel = styled(StyledPanel)`
  background-color: ${rgba(RED, 0.4)};
`
const GreyPanel = styled(StyledPanel)`
  background-color: ${rgba(GREY_2, 0.5)};
`

const StyledTitle = styled('h2')`
  margin: 0;
  text-align: center;
  font-size: ${FONT_SIZE.SIZE_24};
  font-weight: ${FONT_WEIGHTS.bold};
`
const StyledBody = styled('div')`
  text-align: center;
  font-size: ${FONT_SIZE.SIZE_14};
`

const InvestmentEstimatedLandDate = ({ estimatedLandDate, ...props }) => {
  const difference = getDifferenceInDays(estimatedLandDate)
  const Panel =
    difference >= 90
      ? GreenPanel
      : difference >= 30
        ? AmberPanel
        : difference >= 0
          ? RedPanel
          : GreyPanel

  return (
    <Panel data-test="estimated-land-date" {...props}>
      <StyledBody data-test="estimated-land-date-label">
        Estimated land date
      </StyledBody>
      <StyledTitle data-test="estimated-land-date-countdown">
        {getDifferenceInDaysLabel(estimatedLandDate)}
      </StyledTitle>
      <StyledBody data-test="estimated-land-date-date">
        {formatDate(new Date(estimatedLandDate), DATE_FORMAT_FULL_DAY)}
      </StyledBody>
    </Panel>
  )
}

InvestmentEstimatedLandDate.propTypes = {
  estimatedLandDate: PropTypes.string.isRequired,
}

export default InvestmentEstimatedLandDate
