import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { LoadingBox } from 'govuk-react'
import { connect } from 'react-redux'

import Form from '../../../../../client/components/Form'
import StepInteractionType from './StepInteractionType'
import StepInteractionDetails from './StepInteractionDetails'
import Task from '../../../../../client/components/Task'
import { ADD_INTERACTION_FORM__SUBMIT } from '../../../../../client/actions'
import { ID as TASK_ID, state2props, TASK_NAME } from './state'
import urls from '../../../../../lib/urls'

const AddInteractionForm = ({ companyId, newInteractionId, ...props }) => {
  useEffect(() => {
    if (newInteractionId) {
      window.location.href = urls.interactions.detail(newInteractionId)
    }
  }, [newInteractionId])

  return (
    <Task>
      {(getTask) => {
        const task = getTask(TASK_NAME, TASK_ID)
        return (
          <Form
            id="add-interaction-form"
            onSubmit={(values) => {
              task.start({
                payload: { values, companyId },
                onSuccessDispatch: ADD_INTERACTION_FORM__SUBMIT,
              })
            }}
            submissionError={task.errorMessage}
          >
            <LoadingBox loading={task.progress}>
              <Form.Step name="interaction_type">
                {() => <StepInteractionType />}
              </Form.Step>

              <Form.Step
                name="interaction_details"
                forwardButton="Add interaction"
              >
                {() => <StepInteractionDetails {...props} />}
              </Form.Step>
            </LoadingBox>
          </Form>
        )
      }}
    </Task>
  )
}

AddInteractionForm.propTypes = {
  companyId: PropTypes.string.isRequired,
  newInteractionId: PropTypes.string,
  ...StepInteractionDetails.propTypes,
}

export default connect(state2props)(AddInteractionForm)
