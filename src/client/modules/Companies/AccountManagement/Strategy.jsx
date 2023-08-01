import React from 'react'
import { TASK_SAVE_STRATEGY } from './state'
import { FORM_LAYOUT } from '../../../../common/constants'
import Form from '../../../components/Form'
import { DefaultLayout, FormLayout, FieldTextarea } from '../../../components'

import urls from '../../../../lib/urls'
import { useParams } from 'react-router-dom'
import { CompanyResource } from '../../../components/Resource'

const Strategy = () => {
  const { companyId } = useParams()
  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <DefaultLayout
          heading={`Add strategy for ${company.name}`}
          pageTitle={'Strategy'}
          breadcrumbs={[
            { link: urls.dashboard.index(), text: 'Home' },
            { link: urls.companies.index(), text: 'Companies' },
            { link: urls.companies.detail(companyId), text: company.name },
            {
              link: urls.companies.accountManagement.index(companyId),
              text: 'Account management',
            },
            {
              text: `Strategy for ${company.name}`,
            },
          ]}
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
