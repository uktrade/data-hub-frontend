import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import DataSummary from '../DataSummary'
import { ID as CHECK_INVESTMENTS_ID } from '../PersonalisedDashboard/state'

import { ID } from './state'

const state2props = (state) => {
  const { summary: unfilteredSummary } = state[CHECK_INVESTMENTS_ID]
  const { summary } = state[ID]
  return { summary: summary.length ? summary : unfilteredSummary }
}

const InvestmentProjectSummary = ({ summary = [] }) => (
  <DataSummary
    subject="Project"
    description="Projects in the current financial year"
    headers={['Stage', 'Projects']}
    data={summary}
  />
)

InvestmentProjectSummary.propTypes = {
  summary: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
}

export default connect(state2props)(InvestmentProjectSummary)
