import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import {
  Details,
  GridCol,
  GridRow,
  Label,
  ListItem,
  UnorderedList,
} from 'govuk-react'

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
import { InvestmentResource } from '../../../../components/Resource'

const StyledFieldInput = styled(FieldInput)({
  textAlign: 'center',
})

const StyledLabel = styled(Label)({
  textAlign: 'left',
})

const StyledLabelGridCol = styled(GridCol)({
  marginLeft: 'inherit',
  paddingTop: '5px',
})

const StyledInputGridCol = styled(GridCol)({
  flexGrow: '0',
})

const taskDueDateOptions = [
  { label: 'Custom date', value: 'custom' },
  { label: '1 week', value: 'week' },
  { label: '1 month', value: 'month' },
  { label: 'No due date', value: 'none' },
]

const InvestmentProjectTask = ({ currentAdviserId }) => {
  const { projectId } = useParams()
  return (
    <InvestmentResource id={projectId}>
      {(investmentProject) => (
        <DefaultLayout
          heading={`Add task for ${investmentProject.investorCompany?.name}`}
          pageTitle={'Add Task'}
          breadcrumbs={[
            { link: urls.investments.index(), text: 'Investments' },
            { link: urls.investments.projects.index(), text: 'Projects' },
            {
              link: urls.investments.projects.details(investmentProject.id),
              text: investmentProject.name,
            },
            { text: `Add task for ${investmentProject.investorCompany?.name}` },
          ]}
          useReactRouter={false}
        >
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
        </DefaultLayout>
      )}
    </InvestmentResource>
  )
}

const FieldDueDate = ({ initialValue = null }) => (
  <FieldDate
    name="customDate"
    hint="For example 28 11 2025"
    required="Enter a date"
    defaultValue={initialValue}
  />
)

const FieldReminder = ({ initialValue = null }) => (
  <GridRow>
    <StyledInputGridCol>
      <StyledFieldInput
        className="govuk-input--width-2"
        name="taskReminderDays"
        type="number"
        required="Enter a number between 1 and 365"
        validate={(value) =>
          value && (value < 1 || value > 365)
            ? 'Enter a number between 1 and 365'
            : null
        }
        defaultValue={initialValue}
      ></StyledFieldInput>
    </StyledInputGridCol>
    <StyledLabelGridCol>
      <StyledLabel>days before the due date</StyledLabel>
    </StyledLabelGridCol>
  </GridRow>
)

export default connect(state2props)(InvestmentProjectTask)
