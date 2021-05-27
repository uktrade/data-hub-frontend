import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { TASK_SAVE_OPPORTUNITY_DETAILS, ID, state2props } from './state'

import { INVESTMENT_OPPORTUNITY__DETAILS_CHANGE } from '../../../../../client/actions'

import Task from '../../../../../client/components/Task'
import {
  Main,
  Step,
  FieldInput,
  FormStateful,
} from '../../../../../client/components'

function OpportunityDetailsForm(state) {
  const { opportunityId, formInitialValues } = state

  return (
    <Task>
      {(getTask) => (
        <FormStateful
          initialValues={formInitialValues}
          onSubmit={(values) => {
            getTask(TASK_SAVE_OPPORTUNITY_DETAILS, ID).start({
              payload: {
                values,
                opportunityId,
              },
              onSuccessDispatch: INVESTMENT_OPPORTUNITY__DETAILS_CHANGE,
            })
            return null
          }}
        >
          {() => (
            <>
              <Main>
                <Task.Status name={TASK_SAVE_OPPORTUNITY_DETAILS} id={ID} />
                <Step name="updateOpportunityDetails">
                  <FieldInput
                    label="Opportunity name"
                    name="name"
                    type="text"
                    required="Please enter a name to continue"
                  />
                </Step>
              </Main>
            </>
          )}
        </FormStateful>
      )}
    </Task>
  )
}

OpportunityDetailsForm.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}

export default connect(state2props)(OpportunityDetailsForm)
