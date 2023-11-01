import React from 'react'

import { Form, FieldRadios } from '../../../components'

import { TASK_SAVE_MY_TASKS_DUE_DATE_APPROACHING_REMINDER_SUBSCRIPTIONS } from '../state'

import {
  OPTION_NO,
  OPTION_YES,
  OPTIONS_YES_NO,
} from '../../../../common/constants'

import urls from '../../../../lib/urls'
import { MyTasksDueDateApproachingSettingsResource } from '../../../components/Resource'

const OPTIONS_NO_YES = [...OPTIONS_YES_NO].reverse()
const redirectUrl = `${urls.reminders.settings.index()}?my_tasks_due_date_approaching=true`

export const DueDateApproachingFormFields = ({ settings }) => (
  <Form
    id="reminders-settings-my-tasks-due-date-approaching"
    submissionTaskName={
      TASK_SAVE_MY_TASKS_DUE_DATE_APPROACHING_REMINDER_SUBSCRIPTIONS
    }
    redirectTo={() => redirectUrl}
    transformPayload={({ emailRemindersEnabled }) => ({
      email_reminders_enabled: emailRemindersEnabled === OPTION_YES,
    })}
    analyticsFormName="remindersSettingsMyTasksDueDateApproaching"
    flashMessage={() => 'Settings updated'}
    cancelRedirectTo={() => redirectUrl}
  >
    {() => (
      <FieldRadios
        name="emailRemindersEnabled"
        showBorder={true}
        legend="Due date approaching email notifications"
        label="Do you want to get emails as well as on-line reminders?"
        options={OPTIONS_NO_YES}
        initialValue={settings.emailRemindersEnabled ? OPTION_YES : OPTION_NO}
      />
    )}
  </Form>
)

const DueDateApproachingForm = () => (
  <MyTasksDueDateApproachingSettingsResource>
    {(settings) => <DueDateApproachingFormFields settings={settings} />}
  </MyTasksDueDateApproachingSettingsResource>
)

export default DueDateApproachingForm
