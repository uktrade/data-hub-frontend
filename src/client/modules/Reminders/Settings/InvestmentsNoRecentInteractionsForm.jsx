import React from 'react'

import NoRecentInteractionsCommonFields from './NoRecentInteractionsCommonFields'
import { Form } from '../../../components'

import { OPTION_YES } from '../../../../common/constants'
import urls from '../../../../lib/urls'

const redirectUrl = `${urls.reminders.settings.index()}?investments_no_recent_interactions=true`

import {
  TASK_GET_NRI_REMINDER_SUBSCRIPTIONS,
  TASK_SAVE_NRI_REMINDER_SUBSCRIPTIONS,
} from '../state'
import {
  transformReminderDaysToAPI,
  transformNRIFormValuesToAnalyticsData,
} from '../transformers'
import FooterLink from '../FooterLink'

const InvestmentsNoRecentInteractionsForm = () => (
  <>
    <Form
      id="reminders-settings-no-recent-interaction"
      initialValuesTaskName={TASK_GET_NRI_REMINDER_SUBSCRIPTIONS}
      submissionTaskName={TASK_SAVE_NRI_REMINDER_SUBSCRIPTIONS}
      redirectTo={() => redirectUrl}
      transformPayload={(formValues) => ({
        reminder_days: transformReminderDaysToAPI(formValues),
        email_reminders_enabled: formValues.emailNotifications === OPTION_YES,
      })}
      analyticsFormName="editNoRecentInteractionReminderSettings"
      analyticsData={transformNRIFormValuesToAnalyticsData}
      flashMessage={() => 'Settings updated'}
      cancelRedirectTo={() => redirectUrl}
    >
      {({ values: { reminder_days, email_reminders_enabled, reminders } }) => (
        <>
          {reminder_days && (
            <NoRecentInteractionsCommonFields
              reminders={reminders}
              reminderDays={reminder_days}
              emailRemindersEnabled={email_reminders_enabled}
              legendPrefix="Investment"
              doYouWantQuestion="Do you want to get reminders for projects with no recent interactions?"
              whenYouWantQuestion="When do you want to get projects reminders?"
              emptyErrorMessage="Add when you want to get project reminders"
            />
          )}
        </>
      )}
    </Form>
    <FooterLink
      headingText="Need Help?"
      linkUrl={'urls.external.reminderAndSettings'}
      linkText="guidance on reminders and email notifications"
    />
  </>
)

export default InvestmentsNoRecentInteractionsForm
