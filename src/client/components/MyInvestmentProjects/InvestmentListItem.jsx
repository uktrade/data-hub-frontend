import React from 'react'
import PropTypes from 'prop-types'
import { Details } from 'govuk-react'
import styled from 'styled-components'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import InvestmentEstimatedLandDate from './InvestmentEstimatedLandDate'
import InvestmentTimeline from './InvestmentTimeline'

const StyledDetails = styled(Details)`
  > div {
    border: none;
    padding: 0;
    margin-bottom: ${SPACING.SCALE_2};
  }
`

const TimelineRow = styled('div')`
  display: flex;
  width: 100%;
`

const StyledInvestmentTimeline = styled(InvestmentTimeline)`
  display: none;
  width: 80%;
  ${MEDIA_QUERIES.TABLET} {
    display: block;
  }
`

const StyledInvestmentEstimatedLandDate = styled(InvestmentEstimatedLandDate)`
  width: 20%;
`

const InvestmentListItem = ({
  name,
  stage,
  estimated_land_date,
  showDetails,
}) => {
  return (
    <li>
      <StyledDetails summary={name} open={showDetails}>
        <div>+ Add Interaction...</div>
        <TimelineRow>
          <StyledInvestmentTimeline stage={stage} />
          <StyledInvestmentEstimatedLandDate
            estimatedLandDate={estimated_land_date}
          />
        </TimelineRow>
      </StyledDetails>
    </li>
  )
}

InvestmentListItem.propTypes = {
  name: PropTypes.string.isRequired,
  stage: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  estimated_land_date: PropTypes.string.isRequired,
}

export default InvestmentListItem
