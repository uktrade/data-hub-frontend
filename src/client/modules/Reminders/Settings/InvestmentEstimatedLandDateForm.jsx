import React from 'react'
import Label from '@govuk-react/label'
import { isEmpty } from 'lodash'

import { Form, FieldRadios, FieldCheckboxes } from '../../../components'
import { transformELDFormValuesToAnalyticsData } from '../transformers'

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
const redirectUrl = `${urls.reminders.settings.index()}?investments_estimated_land_dates=true`

const InvestmentEstimatedLandDateForm = () => (
  <Form
    id="reminders-settings-estimated-land-date"
    initialValuesTaskName={TASK_GET_ELD_REMINDER_SUBSCRIPTIONS}
    submissionTaskName={TASK_SAVE_ELD_REMINDER_SUBSCRIPTIONS}
    redirectTo={() => redirectUrl}
    transformPayload={({ emailRemindersEnabled, reminderDays }) => ({
      email_reminders_enabled: emailRemindersEnabled === OPTION_YES,
      reminder_days: reminderDays ? reminderDays : [],
    })}
    analyticsFormName="remindersSettingsEstimatedLandDate"
    analyticsData={transformELDFormValuesToAnalyticsData}
    flashMessage={() => 'Settings updated'}
    cancelRedirectTo={() => redirectUrl}
  >
    {({ values: { estimatedLandDate, reminders } }) => (
      <>
        {estimatedLandDate && (
          <>
            <FieldRadios
              name="reminders"
              showBorder={true}
              legend="Investment reminders"
              label={
                <Label>
                  Do you want to get reminders for projects with approaching
                  estimated land dates?
                </Label>
              }
              hint="Selecting 'no' deletes current settings so you'll get no reminders or emails."
              initialValue={
                isEmpty(estimatedLandDate.reminderDays) ? OPTION_NO : OPTION_YES
              }
              options={OPTIONS_NO_YES.map((option) => ({
                ...option,
                ...(option.value === OPTION_YES && {
                  children: (
                    <FieldCheckboxes
                      name="reminderDays"
                      label="When do you want to get project reminders?"
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
                legend="Investment email notifications"
                label="Do you want to get emails as well as on-line reminders?"
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
)

export default InvestmentEstimatedLandDateForm
