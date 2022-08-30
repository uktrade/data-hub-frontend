import React from 'react'
import { isEmpty } from 'lodash'
import styled from 'styled-components'

import urls from '../../../../lib/urls'
import {
  transformReminderDaysToAPI,
  getReminderDaysFromFormValues,
  transformFormDataToAnalyticsData,
} from '../transformers'

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

const MAX_DAYS = 365
const POSITIVE_INT_REGEX = /^[0-9]+$/
const ERROR_MESSAGE = 'Enter a whole number that’s between 1 and 365, like 25'
const EMPTY_ERROR_MESSAGE =
  'Enter when you want to get reminders for your projects'

const isPositiveInteger = (value) => POSITIVE_INT_REGEX.test(value)

const hasReminderDayDuplicates = (formValue, field, formValues) => {
  const reminderDays = getReminderDaysFromFormValues(formValues)
  // Filter out the current field that's being validated for duplicity
  const filteredReminderDays = Object.keys(reminderDays).reduce(
    (object, key) => {
      return {
        ...object,
        ...(key === field.name ? {} : { [key]: reminderDays[key] }),
      }
    },
    {}
  )
  return Object.values(filteredReminderDays).includes(formValue)
}

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
      transformPayload={(formValues) => ({
        reminder_days: transformReminderDaysToAPI(formValues),
        email_reminders_enabled: formValues.emailNotifications === OPTION_YES,
      })}
      analyticsFormName="editNoRecentInteractionReminderSettings"
      analyticsData={(formValues) =>
        transformFormDataToAnalyticsData(formValues)
      }
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
                              validate={(value, field, state) => {
                                if (isPositiveInteger(value)) {
                                  const formValue = parseInt(value, 10)
                                  if (
                                    hasReminderDayDuplicates(
                                      formValue,
                                      field,
                                      state.values
                                    )
                                  ) {
                                    return 'Enter a different number of days for each reminder'
                                  }
                                  return formValue > 0 && formValue <= MAX_DAYS
                                    ? null
                                    : ERROR_MESSAGE
                                } else if (isEmpty(value)) {
                                  return EMPTY_ERROR_MESSAGE
                                } else {
                                  return ERROR_MESSAGE
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
