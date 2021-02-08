import React from 'react'
import PropTypes from 'prop-types'
import { Details } from 'govuk-react'

import InvestmentEstimatedLandDate from './InvestmentEstimatedLandDate'
import InvestmentTimeline from './InvestmentTimeline'

const InvestmentListItem = ({ name, stage, estimated_land_date }) => {
  return (
    <Details summary={name}>
      <div>+ Add Interaction...</div>
      <InvestmentTimeline stage={stage} />
      <InvestmentEstimatedLandDate estimatedLandDate={estimated_land_date} />
    </Details>
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
