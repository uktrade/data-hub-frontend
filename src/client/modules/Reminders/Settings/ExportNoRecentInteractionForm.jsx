import React from 'react'

import CommonNoInteractionFields from './CommonNoInteractionFields'
import { Form } from '../../../components'

import { OPTION_YES } from '../../../../common/constants'
import urls from '../../../../lib/urls'

import {
  TASK_GET_EXPORT_NRI_REMINDER_SUBSCRIPTIONS,
  TASK_SAVE_EXPORT_NRI_REMINDER_SUBSCRIPTIONS,
} from '../state'
import {
  transformReminderDaysToAPI,
  transformNRIFormValuesToAnalyticsData,
} from '../transformers'

const redirectUrl = `${urls.reminders.settings.index()}?exports_no_recent_interactions=true`

const ExportNoRecentInteractionForm = () => (
  <Form
    id="reminders-settings-export-no-recent-interaction"
    initialValuesTaskName={TASK_GET_EXPORT_NRI_REMINDER_SUBSCRIPTIONS}
    submissionTaskName={TASK_SAVE_EXPORT_NRI_REMINDER_SUBSCRIPTIONS}
    redirectTo={() => redirectUrl}
    transformPayload={(formValues) => ({
      reminder_days: transformReminderDaysToAPI(formValues),
      email_reminders_enabled: formValues.emailNotifications === OPTION_YES,
    })}
    analyticsFormName="editExportNoRecentInteractionReminderSettings"
    analyticsData={transformNRIFormValuesToAnalyticsData}
    flashMessage={() => 'Settings updated'}
    cancelRedirectTo={() => redirectUrl}
  >
    {({ values: { reminder_days, email_reminders_enabled, reminders } }) => (
      <>
        {reminder_days && (
          <CommonNoInteractionFields
            reminders={reminders}
            reminderDays={reminder_days}
            emailRemindersEnabled={email_reminders_enabled}
            legendPrefix="Export"
            doYouWantQuestion="Do you want to get reminders for companies with no recent interactions?"
            whenYouWantQuestion="When do you want to get company reminders?"
            emptyErrorMessage="Add when you want to get company reminders"
          />
        )}
      </>
    )}
  </Form>
)

export default ExportNoRecentInteractionForm
