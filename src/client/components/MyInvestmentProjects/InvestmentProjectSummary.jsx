import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  PURPLE,
  ORANGE,
  BLUE,
  YELLOW,
  GREEN,
} from '../../../client/utils/colours'

import PieChart from '../PieChart'
import { ID as CHECK_INVESTMENTS_ID } from '../PersonalisedDashboard/state'
import { ID as INVESTMENT_PROJECTS_ID } from './state'

const segmentColours = [PURPLE, ORANGE, BLUE, YELLOW, GREEN]

const state2props = (state) => {
  const { summary: unfilteredSummary } = state[CHECK_INVESTMENTS_ID]
  const { summary: projectsSummary } = state[INVESTMENT_PROJECTS_ID]
  const summaryData = projectsSummary.length
    ? projectsSummary
    : unfilteredSummary
  return {
    summary: summaryData.map(({ label, value, ...rest }, index) => ({
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
