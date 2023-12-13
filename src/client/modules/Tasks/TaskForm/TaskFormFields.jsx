import React from 'react'
import styled from 'styled-components'
import { Details, ListItem, UnorderedList, Input } from 'govuk-react'

import {
  FieldRadios,
  FieldInput,
  Form,
  FormLayout,
  FieldTextarea,
  FieldDate,
  FieldAdvisersTypeahead,
  NewWindowLink,
} from '../../../components'

import { validateDaysRange, validateIfDateInFuture } from './validators'
import { FORM_LAYOUT, OPTIONS_YES_NO } from '../../../../common/constants'
import { OPTIONS } from './constants'
import urls from '../../../../lib/urls'
import { TASK_SAVE_TASK_DETAILS } from './state'

const StyledFieldInput = styled(FieldInput)`
  text-align: center;
`

const InputFieldWrapper = styled.div`
  ${Input} {
    width: 50px;
  }
`

const taskDueDateOptions = [
  { label: 'Custom date', value: 'custom' },
  { label: '1 week', value: 'week' },
  { label: '1 month', value: 'month' },
  { label: 'No due date', value: 'none' },
]

const TaskFormFields = ({
  currentAdviserId,
  task,
  analyticsFormName,
  cancelRedirectUrl,
  redirectToUrl,
}) => (
  <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
    <Form
      id="investment-project-task-form"
      analyticsFormName={analyticsFormName}
      cancelRedirectTo={() => cancelRedirectUrl}
      redirectTo={() => redirectToUrl}
      submissionTaskName={TASK_SAVE_TASK_DETAILS}
      transformPayload={(values) => ({
        values,
        currentAdviserId,
        taskId: values.id,
      })}
      initialValues={task}
      flashMessage={() => 'Task saved'}
      submitButtonLabel="Save task"
      cancelButtonLabel="Back"
    >
      {() => (
        <>
          <FieldInput
            label="Task title"
            name="title"
            type="text"
            required="Enter a task title"
          />
          <FieldTextarea
            name="description"
            label="Task description (optional)"
            hint="Add details of the task, especially if you intend to assign it to someone else."
          />
          <FieldRadios
            name="assignedTo"
            legend="Task assigned to"
            required="Select who this task is assigned to"
            options={OPTIONS.ASSIGNED_TO.map((option) => ({
              ...option,
              ...(option.label === 'Someone else' && {
                children: (
                  <FieldAdvisersTypeahead
                    name="advisers"
                    required="Select an adviser"
                    isMulti={true}
                  />
                ),
              }),
            }))}
          />
          <Details summary="What happens when I assign someone a task">
            <p>
              When you assign a task the assignee will be sent a reminder,
              according to their Data Hub reminder preferences. They will be
              able to edit, re-assign or complete the task.
            </p>
            <p>
              As the creator of the task you will be sent a reminder when the
              task is changed, re-assigned or completed. You can change when you
              receive these updates in your{' '}
              <NewWindowLink href={urls.reminders.settings.index()}>
                reminder settings
              </NewWindowLink>
            </p>
          </Details>
          <FieldRadios
            name="dueDate"
            legend="Task due date"
            required="Select task due date"
            options={taskDueDateOptions.map((option) => ({
              ...option,
              ...(option.label === 'Custom date' && {
                children: <FieldDueDate />,
              }),
            }))}
          />
          <FieldRadios
            name="emailRemindersEnabled"
            legend="Do you want to set a reminder for this task?"
            required="Select reminder"
            options={OPTIONS_YES_NO.map((option) => ({
              ...option,
              ...(option.label === 'Yes' && {
                children: <FieldReminder />,
              }),
            }))}
          />
          <Details summary="Find out more about task reminders">
            <p>
              By default reminders are sent at 8am, on the specified date by:
            </p>
            <UnorderedList listStyleType="bullet">
              <ListItem>emails to the assignee</ListItem>
              <ListItem>Data Hub reminder</ListItem>
            </UnorderedList>
          </Details>
          <FieldInput type="hidden" name="investmentProject" />
        </>
      )}
    </Form>
  </FormLayout>
)

const FieldDueDate = ({ initialValue = null }) => (
  <FieldDate
    name="customDate"
    hint="For example 28 11 2025"
    required="Enter a date"
    defaultValue={initialValue}
    validate={validateIfDateInFuture}
  />
)

const FieldReminder = ({ initialValue = null }) => (
  <InputFieldWrapper>
    <StyledFieldInput
      name="reminderDays"
      type="number"
      validate={validateDaysRange}
      defaultValue={initialValue}
      text={'day(s) before the due date'}
    ></StyledFieldInput>
  </InputFieldWrapper>
)

export default TaskFormFields
