import React from 'react'
import { useParams } from 'react-router-dom'

import { TASK_SAVE_STRATEGY } from './state'
import { FORM_LAYOUT } from '../../../../common/constants'
import {
  DefaultLayout,
  Form,
  FormLayout,
  FieldTextarea,
} from '../../../components'
import urls from '../../../../lib/urls'
import { CompanyResource } from '../../../components/Resource'
import { buildCompanyBreadcrumbs } from '../utils'

const Strategy = () => {
  const { companyId } = useParams()
  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <DefaultLayout
          heading={`Add strategy for ${company.name}`}
          pageTitle={'Strategy'}
          breadcrumbs={buildCompanyBreadcrumbs(
            [
              {
                link: urls.companies.accountManagement.index(companyId),
                text: 'Account management',
              },
              {
                text: `Strategy for ${company.name}`,
              },
            ],
            company.id,
            company.name
          )}
          useReactRouter={false}
        >
          <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
            <Form
              id="strategy-form"
              analyticsFormName="createStrategyForm"
              cancelRedirectTo={() =>
                urls.companies.accountManagement.index(companyId)
              }
              redirectTo={() =>
                urls.companies.accountManagement.index(companyId)
              }
              submissionTaskName={TASK_SAVE_STRATEGY}
              initialValues={company}
              transformPayload={({ strategy }) => ({ companyId, strategy })}
              flashMessage={() => 'Strategy saved'}
              submitButtonLabel="Save strategy"
              cancelButtonLabel="Back"
            >
              {() => (
                <>
                  <FieldTextarea
                    name="strategy"
                    label="Strategy"
                    hint="This should outline a plan than provides a concise overview of the
                  business direction and DBT's approach to help them achieve that."
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

export default Strategy
