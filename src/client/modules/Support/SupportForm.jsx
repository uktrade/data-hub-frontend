import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'govuk-react'

import urls from '../../../lib/urls'
import {
  FieldInput,
  FieldRadios,
  FieldTextarea,
  LocalHeader,
  Main,
} from '../../components'
import Form from '../../components/Form'
import { FEEDBACK_TYPE_OPTIONS } from './constants'
import { email } from '../../components/Form/validators'
import { TASK_SUBMIT_SUPPORT_REQUEST } from './state'

const SupportForm = ({ zenVariables }) => {
  return (
    <>
      <LocalHeader
        heading={'Report a problem or leave feedback'}
        breadcrumbs={[
          { link: urls.dashboard(), text: 'Home' },
          {
            text: 'Leave feedback',
          },
        ]}
      />
      <Main>
        <p>
          Take a look at our{' '}
          <Link
            href={urls.external.helpCentre.dhHomepage()}
            aria-label="help centre"
          >
            help centre
          </Link>{' '}
          for help, guidance and updates.
        </p>
        <Form
          id="support-form"
          submissionTaskName={TASK_SUBMIT_SUPPORT_REQUEST}
          analyticsFormName="supportForm"
          redirectTo={() => urls.support.thankYou()}
          flashMessage={(result) =>
            `Created new report, reference number ${result.data.ticket.id}`
          }
          transformPayload={(values) => ({
            values: {
              ...values,
              zenVariables,
            },
          })}
          submitButtonLabel={'Send'}
        >
          <FieldInput
            label="Title"
            hint="A brief summary of your feedback or problem"
            name="titleField"
            required="Your feedback needs a title"
            type="text"
          />

          <FieldRadios
            name="feedbackType"
            required="You need to choose between raising a problem and leaving feedback"
            options={FEEDBACK_TYPE_OPTIONS}
          />

          <FieldTextarea
            type="text"
            name="feedbackField"
            label="Description"
            hint="If you were having a problem, explain what you did, what happened and what you expected to happen. If you want to provide feedback or a suggestion, describe it here."
            required="You must enter some feedback or information about your problem"
          />

          <FieldInput
            label="Email"
            name="emailField"
            required="A valid email address is required"
            type="text"
            validate={email}
          />

          <FieldInput
            label="Web browser (optional)"
            hint="The name of the web browser and version you were using"
            name="browserField"
            type="text"
          />
        </Form>
      </Main>
    </>
  )
}

SupportForm.propTypes = {
  interactionId: PropTypes.string.isRequired,
}

export default SupportForm
