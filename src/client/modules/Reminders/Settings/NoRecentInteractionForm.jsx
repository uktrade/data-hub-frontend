import React from 'react'
import { isEmpty } from 'lodash'
import styled from 'styled-components'

import urls from '../../../../lib/urls'
import { transformReminderDaysToAPI } from '../transformers'

import {
  Form,
  FieldRadios,
  DefaultLayout,
  FieldAddAnother,
  FieldInput,
} from '../../../components'

import Heading from '../Heading'

import {
  TASK_GET_NRI_REMINDER_SUBSCRIPTIONS,
  TASK_SAVE_NRI_REMINDER_SUBSCRIPTIONS,
} from '../state'

import {
  OPTION_NO,
  OPTION_YES,
  OPTIONS_YES_NO,
} from '../../../../common/constants'

const OPTIONS_NO_YES = [...OPTIONS_YES_NO].reverse()

const StyledFieldInput = styled(FieldInput)({
  width: 50,
})

const MAX_DAYS = 32767 // Set on the API endpoint (DB constraint)
const POSITIVE_INT_REGEX = /^[0-9]+$/
const EMPTY_ERR_MSG = 'Enter when you want to get reminders for your projects'
const MIN_ERR_MSG = 'Enter a whole number that’s 1 or higher, like 25'
const MAX_ERR_MSG = `Enter a whole number that’s less than or equal to ${MAX_DAYS}`

const isPositiveInteger = (value) => POSITIVE_INT_REGEX.test(value)

const NoRecentInteractionForm = () => (
  <DefaultLayout
    heading={
      <Heading preHeading="Settings for projects with">
        no recent interaction
      </Heading>
    }
    pageTitle="Settings for projects with no recent interaction"
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
        text: 'Settings for projects with no recent interaction',
      },
    ]}
  >
    <Form
      id="reminders-settings-no-recent-interaction"
      initialValuesTaskName={TASK_GET_NRI_REMINDER_SUBSCRIPTIONS}
      submissionTaskName={TASK_SAVE_NRI_REMINDER_SUBSCRIPTIONS}
      redirectTo={() => urls.reminders.settings.index()}
      transformPayload={(state) => ({
        reminder_days: transformReminderDaysToAPI(state),
        email_reminders_enabled: state.emailNotifications === OPTION_YES,
      })}
      analyticsFormName="remindersSettingsNoRecentInteraction"
      flashMessage={() => 'Settings updated'}
      cancelRedirectTo={() => urls.reminders.settings.index()}
    >
      {({ values: { reminder_days, email_reminders_enabled, reminders } }) => (
        <>
          {reminder_days && (
            <>
              <FieldRadios
                name="reminders"
                legend="Reminders"
                showBorder={true}
                label="Do you want to get reminders for projects with no recent interaction?"
                hint="Selecting 'no' deletes current settings so you'll get no reminders or emails."
                initialValue={isEmpty(reminder_days) ? OPTION_NO : OPTION_YES}
                options={OPTIONS_NO_YES.map((option) => ({
                  ...option,
                  ...(option.value === OPTION_YES && {
                    children: (
                      <>
                        <FieldAddAnother
                          name="days"
                          label="When do you want to get reminders for your projects?"
                          hint="You can add up to 5 reminders"
                          itemName="reminder"
                          buttonText="Add another"
                          limitChildGroupCount={5}
                          initialChildGroupCount={reminder_days.length || 1}
                        >
                          {({ groupIndex }) => (
                            <StyledFieldInput
                              type="text"
                              text="days with no interaction"
                              name={`reminder_days_${groupIndex}`}
                              data-test={`reminder_days_${groupIndex}`}
                              validate={(value) => {
                                if (isPositiveInteger(value)) {
                                  const val = parseInt(value, 10)
                                  return val === 0
                                    ? MIN_ERR_MSG
                                    : val > MAX_DAYS
                                    ? MAX_ERR_MSG
                                    : null
                                } else {
                                  return isEmpty(value)
                                    ? EMPTY_ERR_MSG
                                    : MIN_ERR_MSG
                                }
                              }}
                            />
                          )}
                        </FieldAddAnother>
                      </>
                    ),
                  }),
                }))}
              />
              {reminders === OPTION_YES && (
                <FieldRadios
                  name="emailNotifications"
                  showBorder={true}
                  legend="Email notifications"
                  label="Do you want to get emails at the same time as reminders?"
                  options={OPTIONS_NO_YES}
                  initialValue={
                    email_reminders_enabled ? OPTION_YES : OPTION_NO
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

export default NoRecentInteractionForm
