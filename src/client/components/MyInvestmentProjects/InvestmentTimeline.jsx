import React from 'react'
import PropTypes from 'prop-types'

import { Timeline } from '../../components'

const InvestmentTimeline = ({ stage, ...props }) => (
  <Timeline
    stages={['Prospect', 'Assign PM', 'Active', 'Verify win', 'Won']}
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
