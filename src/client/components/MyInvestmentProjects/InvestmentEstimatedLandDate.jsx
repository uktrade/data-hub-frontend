import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'
import { BLACK, BUTTON_COLOUR, GREY_3, RED, YELLOW } from 'govuk-colours'
import { format } from 'date-fns'

import { DATE_DAY_LONG_FORMAT } from '../../../common/constants'
import {
  getDifferenceInDays,
  getDifferenceInDaysLabel,
} from '../../utils/date-utils'
import { rgba } from '../../utils/colors'

const StyledPanel = styled('div')`
  padding: ${SPACING.SCALE_4};
  color: ${BLACK};
  background-color: ${YELLOW};
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
  background-color: ${rgba(GREY_3, 0.5)};
`

const StyledTitle = styled('h2')`
  margin-top: ${SPACING.SCALE_4};
  margin-bottom: ${SPACING.SCALE_4};
  text-align: center;
  font-size: ${FONT_SIZE.SIZE_24};
  font-weight: ${FONT_WEIGHTS.bold};
`
const StyledBody = styled('div')`
  text-align: center;
  font-size: ${FONT_SIZE.SIZE_14};
`

const InvestmentEstimatedLandDate = ({ estimatedLandDate }) => {
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
    <Panel>
      <StyledBody>Estimated land date</StyledBody>
      <StyledTitle>{getDifferenceInDaysLabel(estimatedLandDate)}</StyledTitle>
      <StyledBody>
        {format(new Date(estimatedLandDate), DATE_DAY_LONG_FORMAT)}
      </StyledBody>
    </Panel>
  )
}

InvestmentEstimatedLandDate.propTypes = {
  estimatedLandDate: PropTypes.string.isRequired,
}

export default InvestmentEstimatedLandDate
