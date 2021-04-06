import React from 'react'
import PropTypes from 'prop-types'

import { Timeline } from '../../components'
import { STAGES } from './constants'

const InvestmentTimeline = ({ stage, ...props }) => (
  <Timeline stages={STAGES} currentStage={stage.name} {...props} />
)

InvestmentTimeline.propTypes = {
  stage: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
}

export default InvestmentTimeline
