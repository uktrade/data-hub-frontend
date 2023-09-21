import React from 'react'

import { TASK_SAVE_INVESTMENT_PROJECT_TASK } from './state'
import { FORM_LAYOUT } from '../../../../../common/constants'
import {
  DefaultLayout,
  FieldRadios,
  FieldInput,
  Form,
  FormLayout,
  FieldTextarea,
} from '../../../../components'
import urls from '../../../../../lib/urls'

import {
  DateField,
  Details,
  GridCol,
  GridRow,
  Label,
  ListItem,
  UnorderedList,
} from 'govuk-react'
import { OPTIONS_YES_NO } from '../../../../../apps/constants'
import styled from 'styled-components'
import { InvestmentResource } from '../../../../components/Resource'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
//import { buildCompanyBreadcrumbs } from '../../Companies/utils'

const InvestmentProjectTask = () => {
  const { projectId } = useParams()
  return (
    <InvestmentResource id={projectId}>
      {(investmentProject) => (
        <DefaultLayout
          heading={'Add task for COMPANY'}
          pageTitle={'Task'}
          // breadcrumbs={buildCompanyBreadcrumbs(
          //   [
          //     {
          //       text: `Add task for ${company.name}`,
          //     },
          //   ],
          //   company.id,
          //   company.name
          // )}
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
              transformPayload={({
                taskTitle,
                taskDescription,
                taskDueDate,
                taskReminder,
              }) => ({
                investmentProject,
                taskTitle,
                taskDescription,
                taskDueDate,
                taskReminder,
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
                    name="taskReminder"
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
  <DateField
    name="date"
    label="Date"
    hintText="For example 28 11 2025"
    required="Enter a date"
    defaultValue={initialValue}
  />
)

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

const FieldReminder = ({ initialValue = null }) => (
  <GridRow>
    <GridCol setWidth="10%">
      <StyledFieldInput
        name="reminder"
        defaultValue={initialValue}
      ></StyledFieldInput>
    </GridCol>
    <StyledGridCol>
      <StyledLabel>days before the due date</StyledLabel>
    </StyledGridCol>
  </GridRow>
)

const taskDueDateOptions = [
  { label: 'Custom date', value: 'Custom date' },
  { label: '1 week', value: '1 week' },
  { label: '1 month', value: '1 month' },
  { label: 'No due date', value: 'No due date' },
]

export default InvestmentProjectTask
