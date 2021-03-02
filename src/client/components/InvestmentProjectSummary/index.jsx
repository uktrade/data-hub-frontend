import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { INVESTMENT_SUMMARY_DATA_RANGES__LOADED } from '../../actions'
import Task from '../Task/index.jsx'
import DataSummaryPicker from '../DataSummaryPicker'
import {
  ID,
  TASK_GET_INVESTMENT_SUMMARY_DATA_RANGES,
  state2props,
} from './state'

const InvestmentProjectSummary = ({
  adviser,
  investmentSummaryDataRanges = [],
}) => (
  <Task.Status
    name={TASK_GET_INVESTMENT_SUMMARY_DATA_RANGES}
    id={ID}
    progressMessage="Loading your investment projects"
    startOnRender={{
      payload: { adviser },
      onSuccessDispatch: INVESTMENT_SUMMARY_DATA_RANGES__LOADED,
    }}
  >
    {() => (
      <DataSummaryPicker
        title="My project summary"
        subject="Project"
        description="Projects in the current financial year"
        headers={['Stage', 'Amount']}
        dataRanges={investmentSummaryDataRanges}
      />
    )}
  </Task.Status>
)

InvestmentProjectSummary.propTypes = {
  adviser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  investmentSummaryDataRanges: PropTypes.arrayOf(
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

export default connect(state2props)(InvestmentProjectSummary)
