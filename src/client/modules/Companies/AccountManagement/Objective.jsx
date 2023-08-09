import React from 'react'
import { useParams } from 'react-router-dom'

import { TASK_SAVE_OBJECTIVE } from './state'
import { FORM_LAYOUT } from '../../../../common/constants'
import {
  DefaultLayout,
  Form,
  FormLayout,
  FieldTextarea,
  FieldInput,
  FieldDate,
  FieldRadios,
} from '../../../components'
import urls from '../../../../lib/urls'
import { CompanyResource } from '../../../components/Resource'
import { buildCompanyBreadcrumbs } from '../utils'
import { OPTIONS_YES_NO, OPTION_YES } from '../../../../apps/constants'

const Objective = () => {
  const { companyId } = useParams()
  const OBJECTIVE_PERCENTAGE = [
    {
      label: '0%',
      value: '0',
    },
    {
      label: '25%',
      value: '25',
    },
    {
      label: '50%',
      value: '50',
    },
    {
      label: '75%',
      value: '75',
    },
    {
      label: '100% - objective complete',
      value: '100',
    },
  ]
  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <DefaultLayout
          heading={
            company.objective
              ? `Edit objective for ${company.name}`
              : `Add objective for ${company.name}`
          }
          pageTitle={'Objective'}
          breadcrumbs={buildCompanyBreadcrumbs(
            [
              {
                link: urls.companies.accountManagement.index(companyId),
                text: 'Account management',
              },
              {
                text: `Objective for ${company.name}`,
              },
            ],
            company.id,
            company.name
          )}
          useReactRouter={false}
        >
          <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
            <Form
              id="objective-form"
              analyticsFormName="createObjectiveForm"
              cancelRedirectTo={() =>
                urls.companies.accountManagement.index(companyId)
              }
              redirectTo={() =>
                urls.companies.accountManagement.index(companyId)
              }
              submissionTaskName={TASK_SAVE_OBJECTIVE}
              transformPayload={(values) => ({ companyId, values })}
              flashMessage={() => 'Objective saved'}
              submitButtonLabel="Save objective"
              cancelButtonLabel="Back"
            >
              {() => (
                <>
                  <FieldInput
                    type="text"
                    name="subject"
                    label="Objective subject"
                    required="Enter an objective subject"
                    hint="This should be concise, specific, measurable, and aligned with the strategy"
                  />
                  <FieldTextarea
                    name="detail"
                    label="Objective detail (optional)"
                    hint="Provide more context and rationale for the objective. What does it aim to accomplish? How do we aim to help them achieve it?"
                  />
                  <FieldDate
                    name="target_date"
                    label="Target date"
                    invalid="Enter a valid target date"
                    required="Enter a target date"
                  />
                  <FieldRadios
                    name="has_blocker"
                    label="Are there any blockers to achieving this objective?"
                    required="Select if there are any blockers"
                    options={OPTIONS_YES_NO.map((option) => ({
                      ...option,
                      ...(option.value === OPTION_YES && {
                        children: (
                          <FieldTextarea
                            name="blocker_description"
                            label="Blocker description"
                          />
                        ),
                      }),
                    }))}
                  />
                  <FieldRadios
                    name="progress"
                    legend="How close are we to achieving this objective at the moment?"
                    required="Select a percentage"
                    options={OBJECTIVE_PERCENTAGE}
                  />
                </>
              )}
            </Form>
          </FormLayout>
        </DefaultLayout>
      )}
    </CompanyResource>
  )
}

export default Objective
