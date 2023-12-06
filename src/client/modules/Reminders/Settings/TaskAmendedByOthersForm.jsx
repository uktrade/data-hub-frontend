import React from 'react'

import { Form, FieldRadios } from '../../../components'

import { TASK_SAVE_TASK_AMENDED_BY_OTHERS_REMINDER_SUBSCRIPTIONS } from '../state'

import {
  OPTION_NO,
  OPTION_YES,
  OPTIONS_YES_NO,
} from '../../../../common/constants'

import urls from '../../../../lib/urls'
import { TaskAmendedByOthersSettingsResource } from '../../../components/Resource'

const OPTIONS_NO_YES = [...OPTIONS_YES_NO].reverse()
const redirectUrl = `${urls.reminders.settings.index()}?my_tasks_task_amended_by_others=true`

export const TaskAmendedByOthersFormFields = ({ settings }) => (
  <Form
    id="reminders-settings-task-amended-by-others"
    submissionTaskName={TASK_SAVE_TASK_AMENDED_BY_OTHERS_REMINDER_SUBSCRIPTIONS}
    redirectTo={() => redirectUrl}
    transformPayload={({ emailRemindersEnabled }) => ({
      email_reminders_enabled: emailRemindersEnabled === OPTION_YES,
    })}
    analyticsFormName="remindersSettingsTaskAmendedByOthers"
    flashMessage={() => 'Settings updated'}
    cancelRedirectTo={() => redirectUrl}
  >
    {() => (
      <FieldRadios
        name="emailRemindersEnabled"
        showBorder={true}
        legend="Task amended by others email notifications"
        label="Do you want to get emails as well as on-line reminders?"
        options={OPTIONS_NO_YES}
        initialValue={settings.emailRemindersEnabled ? OPTION_YES : OPTION_NO}
      />
    )}
  </Form>
)

const TaskAmendedByOthersForm = () => (
  <TaskAmendedByOthersSettingsResource>
    {(settings) => <TaskAmendedByOthersFormFields settings={settings} />}
  </TaskAmendedByOthersSettingsResource>
)

export default TaskAmendedByOthersForm
