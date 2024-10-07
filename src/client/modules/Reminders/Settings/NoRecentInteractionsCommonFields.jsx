import React from 'react'
import { isEmpty } from 'lodash'
import styled from 'styled-components'

import { getReminderDaysFromFormValues } from '../transformers'

import {
  OPTION_NO,
  OPTION_YES,
  OPTIONS_YES_NO,
} from '../../../../common/constants'

import { FieldRadios, FieldAddAnother, FieldInput } from '../../../components'

const OPTIONS_NO_YES = [...OPTIONS_YES_NO].reverse()

const StyledFieldInput = styled(FieldInput)({
  width: 50,
})

const MAX_DAYS = 365
const POSITIVE_INT_REGEX = /^[0-9]+$/
const ERROR_MESSAGE = 'Add a number between 1 and 365'

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

const NoRecentInteractionsCommonFields = ({
  reminders,
  reminderDays,
  emailRemindersEnabled,
  legendPrefix,
  doYouWantQuestion,
  whenYouWantQuestion,
  emptyErrorMessage,
  remindersDaysLabelHint,
}) => {
  return (
    <>
      {reminderDays && (
        <>
          <FieldRadios
            name="reminders"
            legend={`${legendPrefix} reminders`}
            showBorder={true}
            label={doYouWantQuestion}
            hint="Selecting 'no' deletes current settings so you'll get no reminders or emails."
            initialValue={isEmpty(reminderDays) ? OPTION_NO : OPTION_YES}
            options={OPTIONS_NO_YES.map((option) => ({
              ...option,
              ...(option.value === OPTION_YES && {
                children: (
                  <>
                    <FieldAddAnother
                      name="days"
                      label={whenYouWantQuestion}
                      hint="You can add up to 5 reminders"
                      itemName="reminder"
                      buttonText="Add another"
                      limitChildGroupCount={5}
                      initialChildGroupCount={reminderDays.length || 1}
                    >
                      {({ groupIndex }) => (
                        <StyledFieldInput
                          type="text"
                          text={
                            remindersDaysLabelHint || 'days with no interaction'
                          }
                          label={
                            remindersDaysLabelHint || 'days with no interaction'
                          }
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
                                return 'Add a different number of days for each reminder'
                              }
                              return formValue > 0 && formValue <= MAX_DAYS
                                ? null
                                : ERROR_MESSAGE
                            } else if (isEmpty(value)) {
                              return emptyErrorMessage
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
              legend={`${legendPrefix} email notifications`}
              label="Do you want to get emails as well as on-line reminders?"
              options={OPTIONS_NO_YES}
              initialValue={emailRemindersEnabled ? OPTION_YES : OPTION_NO}
            />
          )}
        </>
      )}
    </>
  )
}

export default NoRecentInteractionsCommonFields
