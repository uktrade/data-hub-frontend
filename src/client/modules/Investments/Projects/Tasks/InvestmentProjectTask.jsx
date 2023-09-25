import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'

import {
  Details,
  GridCol,
  GridRow,
  Label,
  ListItem,
  UnorderedList,
} from 'govuk-react'
import { TASK_SAVE_INVESTMENT_PROJECT_TASK } from './state'
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

const StyledGridCol = styled(GridCol)({
  marginLeft: 'inherit',
  paddingTop: '5px',
})

const InvestmentProjectTask = () => {
  const { projectId } = useParams()
  return (
    <InvestmentResource id={projectId}>
      {(investmentProject) => (
        <DefaultLayout
          heading={`Add task for ${investmentProject.investorCompany.name}`}
          pageTitle={'Task'}
          breadcrumbs={[
            { link: urls.investments.index(), text: 'Investments' },
            { link: urls.investments.index(), text: 'Projects' },
            {
              link: urls.investments.projects.details(investmentProject.id),
              text: investmentProject.name,
            },
            { text: `Add task for ${investmentProject.investorCompany.name}` },
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
              })}
              flashMessage={() => 'Task created'}
              submitButtonLabel="Add task"
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
                    data-test="task-description-input"
                    hint="Add details of the task, especially if you intend to assign it to someone else."
                  />
                  <FieldRadios
                    name="taskDueDate"
                    legend="Task due date"
                    required="Specify task due date"
                    options={taskDueDateOptions.map((option) => ({
                      ...option,
                      ...(option.label === 'Custom date' && {
                        children: <FieldDueDate />,
                      }),
                      ...option,
                      ...option,
                      ...option,
                    }))}
                  />
                  <FieldRadios
                    name="taskRemindersEnabled"
                    legend="Do you want to set a reminder for this task?"
                    required="Specify reminder"
                    options={OPTIONS_YES_NO.map((option) => ({
                      ...option,
                      ...(option.label === 'Yes' && {
                        children: <FieldReminder />,
                      }),
                      ...option,
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
    label="Date"
    hintText="For example 28 11 2025"
    required="Enter a date"
    defaultValue={initialValue}
  />
)

const FieldReminder = ({ initialValue = null }) => (
  <GridRow>
    <GridCol setWidth="12%">
      <StyledFieldInput
        name="taskReminderDays"
        type="number"
        validate={(value) =>
          value && value.length > 3 ? 'Enter a number between 1 and 365' : null
        }
        defaultValue={initialValue}
      ></StyledFieldInput>
    </GridCol>
    <StyledGridCol>
      <StyledLabel>days before the due date</StyledLabel>
    </StyledGridCol>
  </GridRow>
)

const taskDueDateOptions = [
  { label: 'Custom date', value: 'custom' },
  { label: '1 week', value: 'week' },
  { label: '1 month', value: 'month' },
  { label: 'No due date', value: 'none' },
]

export default InvestmentProjectTask
