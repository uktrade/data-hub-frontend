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
  TASK_SAVE_INTERACTION,
  TASK_OPEN_CONTACT_FORM,
} from './state'
import urls from '../../../../../lib/urls'

const getReturnLink = (
  companyId,
  referralId,
  investmentId,
  contactId,
  interactionId
) => {
  if (referralId) {
    return urls.companies.referrals.interactions.detail(
      companyId,
      referralId,
      interactionId
    )
  } else if (investmentId) {
    return urls.investments.projects.interactions.detail(
      investmentId,
      interactionId
    )
  } else if (contactId) {
    return urls.contacts.interactions.detail(contactId, interactionId)
  }

  return urls.companies.interactions.detail(companyId, interactionId)
}

const InteractionDetailsForm = ({
  companyId,
  referralId,
  investmentId,
  contactId,
  returnLink,
  updatedInteractionId,
  initialValues,
  progress = false,
  ...props
}) => {
  useEffect(() => {
    if (updatedInteractionId) {
      window.location.href = getReturnLink(
        companyId,
        referralId,
        investmentId,
        contactId,
        updatedInteractionId
      )
    }
  }, [updatedInteractionId, returnLink])
  return (
    <Task>
      {(getTask) => {
        const saveInteractionTask = getTask(TASK_SAVE_INTERACTION, STATE_ID)
        const openContactFormTask = getTask(TASK_OPEN_CONTACT_FORM, STATE_ID)

        return (
          <Form
            id={STATE_ID}
            initialValues={initialValues}
            onSubmit={(values) => {
              saveInteractionTask.start({
                payload: {
                  values,
                  companyId,
                  referralId,
                },
                onSuccessDispatch: ADD_INTERACTION_FORM__SUBMIT,
              })
            }}
            submissionError={saveInteractionTask.errorMessage}
          >
            {({ values, currentStep }) => (
              <LoadingBox loading={progress}>
                {(!initialValues.theme || !initialValues.kind) && (
                  <Form.Step name="interaction_type">
                    {() => <StepInteractionType />}
                  </Form.Step>
                )}

                <Form.Step
                  name="interaction_details"
                  forwardButton={
                    initialValues.id ? 'Save interaction' : 'Add interaction'
                  }
                >
                  {() => (
                    <StepInteractionDetails
                      companyId={companyId}
                      activeEvent={initialValues.event}
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

InteractionDetailsForm.propTypes = {
  updatedInteractionId: PropTypes.string,
  companyId: PropTypes.string,
  referralId: PropTypes.string,
  investmentId: PropTypes.string,
  contactId: PropTypes.string,
  returnLink: PropTypes.string,
  progress: PropTypes.bool,
  initialValues: PropTypes.object,
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
)(InteractionDetailsForm)
