import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FieldCompany, Step } from '../../../../../client/components'
import Task from '../../../../../client/components/Task'

import {
  state2props,
  TASK_SEARCH_COMPANY,
  CREATE_INVESTMENT_PROJECT_ID,
} from './state'

import {
  INVESTMENT__COMPANY_SEARCH_TERM,
  INVESTMENT__SEARCH_COMPANY_LIST_LOADED,
} from '../../../../../client/actions'

const CompanySearchStep = ({ results, onSearchCompany, searchTerm }) => (
  <Step name="companySearch" forwardButton={null} backButton={null}>
    <Task>
      {(getTask) => {
        const searchCompanyTask = getTask(
          TASK_SEARCH_COMPANY,
          CREATE_INVESTMENT_PROJECT_ID
        )
        return (
          <FieldCompany
            results={results}
            searchTerm={searchTerm}
            progress={searchCompanyTask.progress}
            onSearchClick={(searchTerm) => {
              onSearchCompany(searchTerm)
              searchCompanyTask.start({
                payload: {
                  searchTerm,
                },
                onSuccessDispatch: INVESTMENT__SEARCH_COMPANY_LIST_LOADED,
              })
            }}
          />
        )
      }}
    </Task>
  </Step>
)

const dispatchToProps = (dispatch) => ({
  onSearchCompany: (searchTerm) =>
    dispatch({
      type: INVESTMENT__COMPANY_SEARCH_TERM,
      searchTerm,
    }),
})

CompanySearchStep.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object),
  onSearchCompany: PropTypes.func.isRequired,
  searchTerm: PropTypes.string,
}

export default connect(state2props, dispatchToProps)(CompanySearchStep)
