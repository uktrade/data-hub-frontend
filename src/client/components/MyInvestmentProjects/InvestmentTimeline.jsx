import React from 'react'
import PropTypes from 'prop-types'

import { Timeline } from '../../components'
import { INVESTMENT_PROJECT_STAGES } from '../../modules/Investments/Projects/constants'

const InvestmentTimeline = ({ stage, ...props }) => (
  <Timeline
    stages={INVESTMENT_PROJECT_STAGES}
    currentStage={stage.name}
    {...props}
  />
)

InvestmentTimeline.propTypes = {
  stage: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
}

export default InvestmentTimeline
