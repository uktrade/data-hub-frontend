import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ID, TASK_GET_MY_INVESTMENTS_LIST, state2props } from './state'
import { MY_INVESTMENTS__LIST_LOADED } from '../../actions'
import Task from '../Task/index.jsx'

import InvestmentListHeader from './InvestmentListHeader'
import InvestmentList from './InvestmentList'

const MyInvestmentProjects = ({ page = 1, adviser, items = [] }) => (
  <article>
    <InvestmentListHeader />
    <Task.Status
      name={TASK_GET_MY_INVESTMENTS_LIST}
      id={ID}
      progressMessage="Loading your investment projects"
      startOnRender={{
        payload: {
          page,
          adviser,
        },
        onSuccessDispatch: MY_INVESTMENTS__LIST_LOADED,
      }}
    >
      {() => <InvestmentList items={items} />}
    </Task.Status>
  </article>
)

MyInvestmentProjects.propTypes = {
  adviser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  items: PropTypes.array,
}

export default connect(state2props)(MyInvestmentProjects)
