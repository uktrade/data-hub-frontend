import React from 'react'

import NoRecentInteractionsCommonFields from './NoRecentInteractionsCommonFields'
import { Form } from '../../../components'

import { OPTION_YES } from '../../../../common/constants'
import urls from '../../../../lib/urls'

import {
  TASK_GET_EXPORT_NI_REMINDER_SUBSCRIPTIONS,
  TASK_SAVE_EXPORT_NI_REMINDER_SUBSCRIPTIONS,
} from '../state'
import {
  transformReminderDaysToAPI,
  transformNRIFormValuesToAnalyticsData,
} from '../transformers'

const redirectUrl = `${urls.reminders.settings.index()}?companies_new_interactions=true`
const doYouWantQuestion =
  'Do you want to get reminders for new company interactions?'
const whenYouWantQuestion =
  'When do you want to get reminders for new company interactions?'
const remindersDaysLabelHint = 'days after the interaction was posted'

const ExportsNewInteractionsForm = () => (
  <Form
    id="reminders-settings-companies-new-interaction"
    initialValuesTaskName={TASK_GET_EXPORT_NI_REMINDER_SUBSCRIPTIONS}
    submissionTaskName={TASK_SAVE_EXPORT_NI_REMINDER_SUBSCRIPTIONS}
    redirectTo={() => redirectUrl}
    transformPayload={(formValues) => ({
      reminder_days: transformReminderDaysToAPI(formValues),
      email_reminders_enabled: formValues.emailNotifications === OPTION_YES,
    })}
    analyticsFormName="editCompaniesNewInteractionReminderSettings"
    analyticsData={transformNRIFormValuesToAnalyticsData}
    flashMessage={() => 'Settings updated'}
    cancelRedirectTo={() => redirectUrl}
  >
    {({ values: { reminder_days, email_reminders_enabled, reminders } }) => (
      <>
        {reminder_days && (
          <NoRecentInteractionsCommonFields
            legendPrefix="Export"
            reminderDays={reminder_days}
            emailRemindersEnabled={email_reminders_enabled}
            reminders={reminders}
            doYouWantQuestion={doYouWantQuestion}
            whenYouWantQuestion={whenYouWantQuestion}
            remindersDaysLabelHint={remindersDaysLabelHint}
            emptyErrorMessage="Add when you want to get company reminders"
          />
        )}
      </>
    )}
  </Form>
)

export default ExportsNewInteractionsForm
