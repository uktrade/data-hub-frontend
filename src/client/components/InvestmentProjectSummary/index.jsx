import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { INVESTMENT_SUMMARY__LOADED } from '../../actions'
import Task from '../Task/index.jsx'
import { MultiRangeChart } from '../Chart'
import { ID, TASK_GET_INVESTMENT_SUMMARY, state2props } from './state'
import { investmentSummaryAsDataRanges } from './utils'

const InvestmentProjectSummary = ({ adviser, investmentSummary = {} }) => {
  const dataRanges = investmentSummaryAsDataRanges(investmentSummary)

  return (
    <Task.Status
      name={TASK_GET_INVESTMENT_SUMMARY}
      id={ID}
      progressMessage="Loading your investment projects"
      startOnRender={{
        payload: { adviser },
        onSuccessDispatch: INVESTMENT_SUMMARY__LOADED,
      }}
    >
      {() => (
        <MultiRangeChart
          title="My project summary"
          subject="Project"
          description="Projects in the current financial year"
          headers={['Stage', 'Amount']}
          dataRanges={dataRanges}
        />
      )}
    </Task.Status>
  )
}

InvestmentProjectSummary.propTypes = {
  adviser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  investmentSummary: PropTypes.shape({
    adviser_id: PropTypes.string,
    annual_summaries: PropTypes.arrayOf(
      PropTypes.shape({
        financial_year: PropTypes.shape({
          label: PropTypes.string.isRequired,
          start: PropTypes.string.isRequired,
          end: PropTypes.string.isRequired,
        }).isRequired,
        totals: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            id: PropTypes.string,
            value: PropTypes.number,
          })
        ),
      })
    ),
  }),
}

export default connect(state2props)(InvestmentProjectSummary)
