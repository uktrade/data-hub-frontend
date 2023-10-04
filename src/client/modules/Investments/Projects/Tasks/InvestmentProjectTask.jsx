import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { Details, ListItem, UnorderedList, Input } from 'govuk-react'

import { TASK_SAVE_INVESTMENT_PROJECT_TASK, state2props } from './state'
import { FORM_LAYOUT } from '../../../../../common/constants'
import {
  DefaultLayout,
  FieldRadios,
  FieldInput,
  Form,
  FormLayout,
  FieldTextarea,
  FieldDate,
} from '../../../../components'
import urls from '../../../../../lib/urls'
import { OPTIONS_YES_NO } from '../../../../../apps/constants'
import { validateDaysRange, validateIfDateInFuture } from './validators'
import { INVESTMENT_PROJECT_ID, TASK_GET_INVESTMENT_PROJECT } from '../state'
import { INVESTMENT__PROJECT_LOADED } from '../../../../actions'
import Task from '../../../../components/Task'
import { adviserTasksFeatureFlag } from '../../../AdviserTasks/constants'

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

const userCanViewTaskReminders = (activeFeatures) =>
  activeFeatures.includes(adviserTasksFeatureFlag)

const InvestmentProjectTask = ({
  currentAdviserId,
  investmentProject,
  activeFeatures,
}) => {
  const { projectId } = useParams()
  const investmentCompanyName = investmentProject?.investorCompany?.name || ''
  return (
    <DefaultLayout
      heading={`Add task for ${investmentCompanyName}`}
      pageTitle={'Add Task'}
      breadcrumbs={[
        { link: urls.investments.index(), text: 'Investments' },
        { link: urls.investments.projects.index(), text: 'Projects' },
        {
          link: urls.investments.projects.details(investmentProject?.id),
          text: investmentProject?.name || '',
        },
        { text: `Add task for ${investmentCompanyName}` },
      ]}
      useReactRouter={false}
    >
      <Task.Status
        name={TASK_GET_INVESTMENT_PROJECT}
        id={INVESTMENT_PROJECT_ID}
        startOnRender={{
          payload: projectId,
          onSuccessDispatch: INVESTMENT__PROJECT_LOADED,
        }}
      >
        {() => (
          <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
            <Form
              id="investment-project-task-form"
              analyticsFormName="createInvestmentTaskForm"
              cancelRedirectTo={() =>
                urls.investments.projects.details(projectId)
              }
              redirectTo={() => urls.investments.projects.details(projectId)}
              submissionTaskName={TASK_SAVE_INVESTMENT_PROJECT_TASK}
              transformPayload={(values) => ({
                values,
                investmentProject: investmentProject,
                currentAdviserId: currentAdviserId,
              })}
              flashMessage={() => 'Task created'}
              submitButtonLabel="Save task"
              cancelButtonLabel="Back"
            >
              {() => (
                <>
                  <FieldInput
                    label="Task title"
                    name="taskTitle"
                    type="text"
                    required="Enter a task title"
                  />
                  <FieldTextarea
                    name="taskDescription"
                    label="Task description (optional)"
                    hint="Add details of the task, especially if you intend to assign it to someone else."
                  />
                  <FieldRadios
                    name="taskDueDate"
                    legend="Task due date"
                    required="Select task due date"
                    options={taskDueDateOptions.map((option) => ({
                      ...option,
                      ...(option.label === 'Custom date' && {
                        children: <FieldDueDate />,
                      }),
                    }))}
                  />
                  {userCanViewTaskReminders(activeFeatures) && (
                    <FieldRadios
                      name="taskRemindersEnabled"
                      legend="Do you want to set a reminder for this task?"
                      required="Select reminder"
                      options={OPTIONS_YES_NO.map((option) => ({
                        ...option,
                        ...(option.label === 'Yes' && {
                          children: <FieldReminder />,
                        }),
                      }))}
                    />
                  )}
                  <Details summary="Find out more about task reminders">
                    <p>
                      By default reminders are sent at 8am, on the specified
                      date by:
                    </p>
                    <UnorderedList listStyleType="bullet">
                      <ListItem>emails to the assignee</ListItem>
                      <ListItem>Data Hub reminder</ListItem>
                    </UnorderedList>
                  </Details>
                </>
              )}
            </Form>
          </FormLayout>
        )}
      </Task.Status>
    </DefaultLayout>
  )
}

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
      name="taskReminderDays"
      type="number"
      required="Enter a number between 1 and 365"
      validate={validateDaysRange}
      defaultValue={initialValue}
      text={'day(s) before the due date'}
    ></StyledFieldInput>
  </InputFieldWrapper>
)

export default connect(state2props)(InvestmentProjectTask)
