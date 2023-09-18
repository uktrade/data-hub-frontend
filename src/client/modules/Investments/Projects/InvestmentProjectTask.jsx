import React from 'react'

import { TASK_SAVE_INVESTMENT_PROJECT_TASK } from './state'
import { FORM_LAYOUT } from '../../../../common/constants'
import {
  DefaultLayout,
  FieldRadios,
  FieldInput,
  Form,
  FormLayout,
  FieldTextarea,
} from '../../../components'
import urls from '../../../../lib/urls'

import { DateField } from 'govuk-react'
//import { buildCompanyBreadcrumbs } from '../../Companies/utils'

const InvestmentProjectTask = () => {
  return (
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
          cancelRedirectTo={() => urls.dashboard.index()}
          redirectTo={() => urls.dashboard.index()}
          submissionTaskName={TASK_SAVE_INVESTMENT_PROJECT_TASK}
          //transformPayload={({ strategy }) => ({ companyId, strategy })}
          flashMessage={() => 'Task created'}
          submitButtonLabel="Add task"
          cancelButtonLabel="Back"
        >
          {() => (
            <>
              <FieldInput
                label="Task title"
                name="Task title"
                type="text"
                required="Enter a task title"
              />
              <FieldTextarea
                name="Task description"
                label="Task description (optional)"
                hint="Add details of the task, especially if you intend to assign it to someone else."
              />
              <FieldRadios
                name="taskDueDate"
                legend="Task due date"
                required="Specify task due date"
                options={[
                  { label: 'Custom date', children: <DateField /> },
                  { label: '1 week', value: '1 week' },
                  { label: '1 month', value: '1 month' },
                  { label: 'No due date', value: 'No due date' },
                ]}
                bigLegend={true}
              />
            </>
          )}
        </Form>
      </FormLayout>
    </DefaultLayout>
  )
}

export default InvestmentProjectTask
