import React from 'react'

import { Form, FieldRadios } from '../../../components'

import { TASK_OVERDUE_REMINDER_SUBSCRIPTIONS } from '../state'

import {
  OPTION_NO,
  OPTION_YES,
  OPTIONS_YES_NO,
} from '../../../../common/constants'

import urls from '../../../../lib/urls'
import { TaskOverdueSettingsResource } from '../../../components/Resource'

const OPTIONS_NO_YES = [...OPTIONS_YES_NO].reverse()
const redirectUrl = `${urls.reminders.settings.index()}?task_overdue=true`

export const TaskOverdueFormFields = ({ settings }) => (
  <Form
    id="reminders-settings-task-overdue"
    submissionTaskName={TASK_OVERDUE_REMINDER_SUBSCRIPTIONS}
    redirectTo={() => redirectUrl}
    transformPayload={({ emailRemindersEnabled }) => ({
      email_reminders_enabled: emailRemindersEnabled === OPTION_YES,
    })}
    analyticsFormName="remindersSettingsTaskOverdue"
    flashMessage={() => 'Settings updated'}
    cancelRedirectTo={() => redirectUrl}
  >
    {() => (
      <FieldRadios
        name="emailRemindersEnabled"
        showBorder={true}
        legend="Task Overdue"
        label="Do you want to get emails as well as on-line reminders?"
        options={OPTIONS_NO_YES}
        initialValue={settings.emailRemindersEnabled ? OPTION_YES : OPTION_NO}
      />
    )}
  </Form>
)

const TaskOverdueForm = () => (
  <TaskOverdueSettingsResource>
    {(settings) => <TaskOverdueFormFields settings={settings} />}
  </TaskOverdueSettingsResource>
)

export default TaskOverdueForm
