import React from 'react'

import { Form, FieldRadios } from '../../../components'

import { TASK_SAVE_COMPLETED_REMINDER_SUBSCRIPTIONS } from '../state'

import {
  OPTION_NO,
  OPTION_YES,
  OPTIONS_YES_NO,
} from '../../../../common/constants'

import urls from '../../../../lib/urls'
import { TaskCompletedSettingsResource } from '../../../components/Resource'

const OPTIONS_NO_YES = [...OPTIONS_YES_NO].reverse()
const redirectUrl = `${urls.reminders.settings.index()}?my_tasks_task_completed=true`

export const TaskCompletedFormFields = ({ settings }) => (
  <Form
    id="reminders-settings-task-completed"
    submissionTaskName={TASK_SAVE_COMPLETED_REMINDER_SUBSCRIPTIONS}
    redirectTo={() => redirectUrl}
    transformPayload={({ emailRemindersEnabled }) => ({
      email_reminders_enabled: emailRemindersEnabled === OPTION_YES,
    })}
    analyticsFormName="remindersSettingsTaskCompleted"
    flashMessage={() => 'Settings updated'}
    cancelRedirectTo={() => redirectUrl}
  >
    {() => (
      <FieldRadios
        name="emailRemindersEnabled"
        showBorder={true}
        legend="Task completed email notifications"
        label="Do you want to get emails as well as on-line reminders?"
        options={OPTIONS_NO_YES}
        initialValue={settings.emailRemindersEnabled ? OPTION_YES : OPTION_NO}
      />
    )}
  </Form>
)

const TaskCompletedForm = () => (
  <TaskCompletedSettingsResource>
    {(settings) => <TaskCompletedFormFields settings={settings} />}
  </TaskCompletedSettingsResource>
)

export default TaskCompletedForm
