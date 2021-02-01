import React from 'react'
import PropTypes from 'prop-types'

const InvestmentTimeline = ({ stage }) => <div>Stage: {stage.name}</div>

InvestmentTimeline.propTypes = {
  stage: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
}

export default InvestmentTimeline
