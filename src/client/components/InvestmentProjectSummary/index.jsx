import React from 'react'
import PropTypes from 'prop-types'

import DataSummaryPicker from '../DataSummaryPicker'

const InvestmentProjectSummary = ({ results }) => (
  <DataSummaryPicker
    title="My project summary"
    subject="Project"
    description="Projects in the current financial year"
    headers={['Stage', 'Amount']}
    dataRanges={results}
  />
)

InvestmentProjectSummary.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      range: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          value: PropTypes.number.isRequired,
          link: PropTypes.string,
        })
      ).isRequired,
    })
  ),
}

export default InvestmentProjectSummary
