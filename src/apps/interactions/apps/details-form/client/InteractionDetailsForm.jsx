import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'

import StepInteractionType from './StepInteractionType'
import StepInteractionDetails from './StepInteractionDetails'
import Step from '../../../../../client/components/Form/elements/Step.jsx'
import Task from '../../../../../client/components/Task'
import TaskForm from '../../../../../client/components/Form/index.jsx'
import {
  ID as STATE_ID,
  TASK_SAVE_INTERACTION,
  TASK_OPEN_CONTACT_FORM,
  TASK_GET_INTERACTION_INITIAL_VALUES,
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
  investmentId,
  contactId,
  user,
  interactionId,
  referral,
  ...props
}) => {
  return (
    <Task>
      {(getTask) => {
        const openContactFormTask = getTask(TASK_OPEN_CONTACT_FORM, STATE_ID)
        const companyIds = [companyId]
        return (
          <Route>
            {({ location }) => {
              const contactCreated =
                location.search.includes('new-contact-name')
              return (
                <TaskForm
                  id={STATE_ID}
                  submissionTaskName={TASK_SAVE_INTERACTION}
                  analyticsFormName={
                    interactionId ? 'editInteraction' : 'createInteraction'
                  }
                  analyticsData={(values) =>
                    _.pick(
                      values,
                      'was_policy_feedback_provided',
                      'were_countries_discussed'
                    )
                  }
                  initialValuesPayload={{
                    companyId,
                    referral,
                    investmentId,
                    contactId,
                    user,
                    interactionId,
                  }}
                  initialValuesTaskName={TASK_GET_INTERACTION_INITIAL_VALUES}
                  transformPayload={(values) => ({
                    values,
                    companyIds,
                    referralId: referral?.id,
                  })}
                  initialStepIndex={contactCreated && !interactionId ? 1 : 0}
                  redirectTo={({ data }) =>
                    getReturnLink(
                      companyId,
                      referral?.id,
                      investmentId,
                      contactId,
                      data.id
                    )
                  }
                  flashMessage={({ data }) =>
                    getFlashMessage(
                      interactionId,
                      data.was_policy_feedback_provided
                    )
                  }
                >
                  {({ values, currentStep }) => (
                    <>
                      {/* Step registered if creating the interaction
                  and haven't come from an investment project */}
                      {!interactionId && !investmentId && (
                        <Step name="interaction_type">
                          {() => <StepInteractionType />}
                        </Step>
                      )}

                      <Step
                        name="interaction_details"
                        forwardButton={
                          interactionId ? 'Save interaction' : 'Add interaction'
                        }
                      >
                        {() => (
                          <StepInteractionDetails
                            companyId={companyId}
                            onOpenContactForm={(e) => {
                              e.preventDefault()
                              openContactFormTask.start({
                                payload: {
                                  values,
                                  currentStep,
                                  companyId,
                                  url: e.target.href,
                                },
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
          </Route>
        )
      }}
    </Task>
  )
}

InteractionDetailsForm.propTypes = {
  companyId: PropTypes.string,
  referral: PropTypes.object,
  investmentId: PropTypes.string,
  contactId: PropTypes.string,
  interactionId: PropTypes.string,
  user: PropTypes.object,
  ...StepInteractionDetails.propTypes,
}

export default connect(
  ({ values, ...state }) => ({
    ...state[STATE_ID],
    values,
  }),
  () => ({
    openContactForm: (event) => {
      event.target.blur()
      event.preventDefault()
    },
  })
)(InteractionDetailsForm)
