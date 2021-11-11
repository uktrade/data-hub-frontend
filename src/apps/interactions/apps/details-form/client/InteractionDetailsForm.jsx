import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import StepInteractionType from './StepInteractionType'
import StepInteractionDetails from './StepInteractionDetails'
import Step from '../../../../../client/components/Form/elements/Step.jsx'
import Task from '../../../../../client/components/Task'
import TaskForm from '../../../../../client/components/Task/Form/index.jsx'
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

const getFlashMessage = (interactionId, wasPolicyFeedbackProvided) => {
  if (!interactionId) {
    if (wasPolicyFeedbackProvided) {
      const body = [
        'Thanks for submitting business intelligence (BI), which feeds into the Business Intelligence Unit’s reports. If they need more information, they will contact you.',
        '',
        'For more on the value of BI, <a href="https://workspace.trade.gov.uk/working-at-dit/policies-and-guidance/business-intelligence-reports/" target="_blank">See the Digital Workspace article</a> (opens in new tab)',
      ].join('<br />')
      return ['Interaction created', body]
    } else {
      return 'Interaction created'
    }
  } else {
    return 'Interaction updated'
  }
}

const InteractionDetailsForm = ({
  companyId,
  referralId,
  investmentId,
  contactId,
  returnLink,
  updatedInteractionId,
  wasPolicyFeedbackProvided,
  initialValues,
  has_related_trade_agreements,
  related_trade_agreements,
  interactionId,
  ...props
}) => {
  return (
    <Task>
      {(getTask) => {
        const openContactFormTask = getTask(TASK_OPEN_CONTACT_FORM, STATE_ID)
        const companyIds = [companyId]
        return (
          <TaskForm
            id={STATE_ID}
            submissionTaskName={TASK_SAVE_INTERACTION}
            initialValues={initialValues}
            // TODO update when taskform analytics finalised
            analyticsFormName="placeholder"
            transformPayload={(values) => ({
              values,
              companyIds,
              referralId,
            })}
            redirectTo={({ data }) =>
              getReturnLink(
                companyId,
                referralId,
                investmentId,
                contactId,
                data.id
              )
            }
            flashMessage={({ data }) =>
              getFlashMessage(interactionId, data.was_policy_feedback_provided)
            }
          >
            {({ values, currentStep }) => (
              <>
                {(!initialValues.theme || !initialValues.kind) && (
                  <Step name="interaction_type">
                    {() => <StepInteractionType />}
                  </Step>
                )}

                <Step
                  name="interaction_details"
                  forwardButton={
                    initialValues.id ? 'Save interaction' : 'Add interaction'
                  }
                >
                  {() => (
                    <StepInteractionDetails
                      companyId={companyId}
                      interactionId={interactionId}
                      activeEvent={initialValues.event}
                      relatedOpportunity={
                        initialValues.large_capital_opportunity
                      }
                      onOpenContactForm={(e) => {
                        e.preventDefault()
                        openContactFormTask.start({
                          payload: {
                            values,
                            currentStep,
                            companyId,
                            url: e.target.href,
                          },
                          onSuccessDispatch:
                            ADD_INTERACTION_FORM__CONTACT_FORM_OPENED,
                        })
                      }}
                      {...props}
                    />
                  )}
                </Step>
              </>
            )}
          </TaskForm>
        )
      }}
    </Task>
  )
}

InteractionDetailsForm.propTypes = {
  updatedInteractionId: PropTypes.string,
  wasPolicyFeedbackProvided: PropTypes.bool,
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
