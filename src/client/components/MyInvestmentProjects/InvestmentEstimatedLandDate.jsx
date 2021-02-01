import React from 'react'
import PropTypes from 'prop-types'

const InvestmentEstimatedLandDate = ({ estimatedLandDate }) => (
  <div>Estimated land date: {estimatedLandDate}</div>
)

InvestmentEstimatedLandDate.propTypes = {
  estimatedLandDate: PropTypes.string.isRequired,
}

export default InvestmentEstimatedLandDate
