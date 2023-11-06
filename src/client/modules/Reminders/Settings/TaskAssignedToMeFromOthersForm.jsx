import React from 'react'

import { Form, FieldRadios } from '../../../components'

import { TASK_SAVE_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER_SUBSCRIPTIONS } from '../state'

import {
  OPTION_NO,
  OPTION_YES,
  OPTIONS_YES_NO,
} from '../../../../common/constants'

import urls from '../../../../lib/urls'
import { TaskAssignedToMeFromOthersSettingsResource } from '../../../components/Resource'

const OPTIONS_NO_YES = [...OPTIONS_YES_NO].reverse()
const redirectUrl = `${urls.reminders.settings.index()}?task_assigned_to_me_from_others=true`

export const TaskAssignedToMeFromOthersFormFields = ({ settings }) => (
  <Form
    id="reminders-settings-task-assigned-to-me-from-others"
    submissionTaskName={
      TASK_SAVE_TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDER_SUBSCRIPTIONS
    }
    redirectTo={() => redirectUrl}
    transformPayload={({ emailRemindersEnabled }) => ({
      email_reminders_enabled: emailRemindersEnabled === OPTION_YES,
    })}
    analyticsFormName="remindersSettingsTaskAssignedToMeFromOthers"
    flashMessage={() => 'Settings updated'}
    cancelRedirectTo={() => redirectUrl}
  >
    {() => (
      <FieldRadios
        name="emailRemindersEnabled"
        showBorder={true}
        legend="Task assigned to me from others email notifications"
        label="Do you want to get emails as well as on-line reminders?"
        options={OPTIONS_NO_YES}
        initialValue={settings.emailRemindersEnabled ? OPTION_YES : OPTION_NO}
      />
    )}
  </Form>
)

const TaskAssignedToMeFromOthersForm = () => (
  <TaskAssignedToMeFromOthersSettingsResource>
    {(settings) => <TaskAssignedToMeFromOthersFormFields settings={settings} />}
  </TaskAssignedToMeFromOthersSettingsResource>
)

export default TaskAssignedToMeFromOthersForm
