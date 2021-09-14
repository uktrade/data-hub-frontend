import React from 'react'
import PropTypes from 'prop-types'
import { PURPLE, ORANGE, BLUE, YELLOW, GREEN } from 'govuk-colours'
import { connect } from 'react-redux'

import PieChart from '../PieChart'
import { ID as CHECK_INVESTMENTS_ID } from '../PersonalisedDashboard/state'

import { ID } from './state'

const segmentColours = [PURPLE, ORANGE, BLUE, YELLOW, GREEN]

const state2props = (state) => {
  const { summary: unfilteredSummary } = state[CHECK_INVESTMENTS_ID]
  const { summary } = state[ID]
  const data = summary.length ? summary : unfilteredSummary
  return {
    summary:
      data &&
      data.map(({ label, value, ...rest }, index) => ({
        ...rest,
        colour: segmentColours[index % segmentColours.length],
        value,
        id: label,
      })),
  }
}

const InvestmentProjectSummary = ({ summary = [] }) => (
  <PieChart unit="Project" height={290} data={summary} />
)

InvestmentProjectSummary.propTypes = {
  summary: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      link: PropTypes.string,
      colour: PropTypes.string,
    })
  ).isRequired,
}

export default connect(state2props)(InvestmentProjectSummary)
