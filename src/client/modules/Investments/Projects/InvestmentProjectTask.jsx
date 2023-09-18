import React from 'react'

import { TASK_SAVE_INVESTMENT_PROJECT_TASK } from './state'
import { FORM_LAYOUT } from '../../../../common/constants'
import {
  DefaultLayout,
  //FieldRadios,
  FieldInput,
  Form,
  FormLayout,
  FieldTextarea,
} from '../../../components'
import urls from '../../../../lib/urls'
import { CompanyResource } from '../../../components/Resource'
import { useParams } from 'react-router-dom'
//import { DateField } from 'govuk-react'
import { buildCompanyBreadcrumbs } from '../../Companies/utils'

const InvestmentProjectTask = () => {
  const { companyId } = useParams()
  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <DefaultLayout
          heading={`Add task for ${company.name}`}
          pageTitle={'Task'}
          breadcrumbs={buildCompanyBreadcrumbs(
            [
              {
                text: `Add task for ${company.name}`,
              },
            ],
            company.id,
            company.name
          )}
          useReactRouter={false}
        >
          <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
            <Form
              id="investment-project-task-form"
              analyticsFormName="createInvestmentTaskForm"
              cancelRedirectTo={() => urls.companies.index(companyId)}
              redirectTo={() => urls.companies.index(companyId)}
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
                  {/* <FieldRadios
                    name="companyLocation"
                    legend="Where is this company located?"
                    required="Specify location of the company"
                    options={<DateField hint="true" />}
                    bigLegend={true}
                  /> */}
                </>
              )}
            </Form>
          </FormLayout>
        </DefaultLayout>
      )}
    </CompanyResource>
  )
}

export default InvestmentProjectTask
