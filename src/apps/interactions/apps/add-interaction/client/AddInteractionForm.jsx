import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { LoadingBox } from 'govuk-react'
import { connect } from 'react-redux'

import Form from '../../../../../client/components/Form'
import StepInteractionType from './StepInteractionType'
import StepInteractionDetails from './StepInteractionDetails'
import Task from '../../../../../client/components/Task'
import {
  ADD_INTERACTION_FORM__CONTACT_FORM_OPENED,
  ADD_INTERACTION_FORM__SUBMIT,
} from '../../../../../client/actions'
import {
  ID as STATE_ID,
  TASK_CREATE_INTERACTION,
  TASK_OPEN_CONTACT_FORM,
} from './state'
import urls from '../../../../../lib/urls'

const AddInteractionForm = ({
  companyId,
  referral,
  returnLink,
  newInteractionId,
  defaultValues,
  progress = false,
  ...props
}) => {
  useEffect(() => {
    if (newInteractionId) {
      window.location.href =
        `${returnLink}/${newInteractionId}`.replace('//', '/') ||
        urls.interactions.detail(newInteractionId)
    }
  }, [newInteractionId, returnLink])

  return (
    <Task>
      {(getTask) => {
        const createInteractionTask = getTask(TASK_CREATE_INTERACTION, STATE_ID)
        const openContactFormTask = getTask(TASK_OPEN_CONTACT_FORM, STATE_ID)

        return (
          <Form
            id={STATE_ID}
            onSubmit={(values) => {
              createInteractionTask.start({
                payload: {
                  values: {
                    ...defaultValues,
                    ...values,
                  },
                  companyId,
                  referral,
                },
                onSuccessDispatch: ADD_INTERACTION_FORM__SUBMIT,
              })
            }}
            submissionError={createInteractionTask.errorMessage}
          >
            {({ values, currentStep }) => (
              <LoadingBox loading={progress}>
                {!defaultValues.theme && !defaultValues.kind && (
                  <Form.Step name="interaction_type">
                    {() => <StepInteractionType />}
                  </Form.Step>
                )}

                <Form.Step
                  name="interaction_details"
                  forwardButton="Add interaction"
                >
                  {() => (
                    <StepInteractionDetails
                      companyId={companyId}
                      defaultValues={defaultValues}
                      onOpenContactForm={(e) => {
                        e.preventDefault()
                        openContactFormTask.start({
                          payload: {
                            values,
                            currentStep,
                            companyId,
                            url: e.target.href,
                          },
                          onSuccessDispatch: ADD_INTERACTION_FORM__CONTACT_FORM_OPENED,
                        })
                      }}
                      {...props}
                    />
                  )}
                </Form.Step>
              </LoadingBox>
            )}
          </Form>
        )
      }}
    </Task>
  )
}

AddInteractionForm.propTypes = {
  newInteractionId: PropTypes.string,
  referral: PropTypes.object,
  returnLink: PropTypes.string,
  progress: PropTypes.bool,
  ...StepInteractionDetails.propTypes,
}

export default connect(
  ({ values, ...state }) => ({
    ...state[STATE_ID],
    values,
  }),
  (dispatch) => ({
    openContactForm: (page, event) => {
      event.target.blur()
      event.preventDefault()
      dispatch({
        type: ADD_INTERACTION_FORM__SUBMIT,
        page,
      })
    },
  })
)(AddInteractionForm)
