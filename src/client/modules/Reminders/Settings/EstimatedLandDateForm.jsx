import React from 'react'
import Label from '@govuk-react/label'
import { isEmpty } from 'lodash'

import {
  Form,
  FieldRadios,
  DefaultLayout,
  FieldCheckboxes,
} from '../../../components'

import Heading from '../Heading'

import {
  TASK_GET_ELD_REMINDER_SUBSCRIPTIONS,
  TASK_SAVE_ELD_REMINDER_SUBSCRIPTIONS,
} from '../state'

import {
  OPTION_NO,
  OPTION_YES,
  OPTIONS_YES_NO,
} from '../../../../common/constants'

import urls from '../../../../lib/urls'

const OPTIONS_NO_YES = [...OPTIONS_YES_NO].reverse()

const EstimatedLandDateForm = () => (
  <DefaultLayout
    heading={
      <Heading preHeading="Settings for">
        approaching estimated land dates
      </Heading>
    }
    pageTitle="Settings for approaching estimates land dates"
    breadcrumbs={[
      {
        link: urls.dashboard(),
        text: 'Home',
      },
      {
        link: urls.reminders.settings.index(),
        text: 'Reminders and email notifications settings',
      },
      {
        text: 'Settings for approaching estimated land dates',
      },
    ]}
  >
    <Form
      id="reminders-settings-estimated-land-date"
      initialValuesTaskName={TASK_GET_ELD_REMINDER_SUBSCRIPTIONS}
      submissionTaskName={TASK_SAVE_ELD_REMINDER_SUBSCRIPTIONS}
      redirectTo={() => urls.reminders.settings.index()}
      transformPayload={({ emailRemindersEnabled, reminderDays }) => ({
        email_reminders_enabled: emailRemindersEnabled === OPTION_YES,
        reminder_days: reminderDays ? reminderDays : [],
      })}
      analyticsFormName="remindersSettingsEstimatedLandDate"
      flashMessage={() => 'Settings updated'}
      cancelRedirectTo={() => urls.reminders.settings.index()}
    >
      {({ values: { estimatedLandDate, reminders } }) => (
        <>
          {estimatedLandDate && (
            <>
              <FieldRadios
                name="reminders"
                showBorder={true}
                legend="Reminders"
                label={
                  <Label>
                    Do you want to get reminders for projects with approaching
                    estimated land dates?
                  </Label>
                }
                hint="Selecting 'no' deletes current settings so you'll get no reminders or emails."
                initialValue={
                  isEmpty(estimatedLandDate.reminderDays)
                    ? OPTION_NO
                    : OPTION_YES
                }
                options={OPTIONS_NO_YES.map((option) => ({
                  ...option,
                  ...(option.value === OPTION_YES && {
                    children: (
                      <FieldCheckboxes
                        name="reminderDays"
                        label="When do you want to get reminders for your projects?"
                        hint="Select all that apply"
                        required="Select when you want to get reminders"
                        initialValue={estimatedLandDate.reminderDays}
                        options={[
                          {
                            value: 60,
                            label: '60 days before estimated land date',
                          },
                          {
                            value: 30,
                            label: '30 days before estimated land date',
                          },
                        ]}
                      />
                    ),
                  }),
                }))}
              />
              {reminders === OPTION_YES && (
                <FieldRadios
                  name="emailRemindersEnabled"
                  showBorder={true}
                  legend="Email notifications"
                  label="Do you want to get emails at the same time as reminders?"
                  options={OPTIONS_NO_YES}
                  initialValue={
                    estimatedLandDate.emailRemindersEnabled
                      ? OPTION_YES
                      : OPTION_NO
                  }
                />
              )}
            </>
          )}
        </>
      )}
    </Form>
  </DefaultLayout>
)

export default EstimatedLandDateForm
