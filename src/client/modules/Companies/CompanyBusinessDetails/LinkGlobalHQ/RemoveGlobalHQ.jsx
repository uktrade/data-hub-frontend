import React from 'react'
import { useParams } from 'react-router-dom-v5-compat'

import { DefaultLayout } from '../../../../components'
import Task from '../../../../components/Task'
import { TASK_REMOVE_GLOBAL_HQ, REMOVE_GLOBAL_HQ_ID } from './state'
import urls from '../../../../../lib/urls'
import { CompanyResource } from '../../../../components/Resource'
import { buildCompanyBreadcrumbs } from '../../utils'

const RemoveGlobalHQ = () => {
  const { companyId } = useParams()
  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <DefaultLayout
          heading={'Remove Global HQ'}
          pageTitle={`Remove Global HQ - ${company.name} - Companies`}
          breadcrumbs={buildCompanyBreadcrumbs(
            {
              link: urls.companies.businessDetails(company.id),
              text: 'Business details',
            },
            { text: 'Remove Global HQ' },
            company.name,
            companyId
          )}
          useReactRouter={false}
        >
          <Task.Status
            name={TASK_REMOVE_GLOBAL_HQ}
            id={REMOVE_GLOBAL_HQ_ID}
            progressMessage={`Removing Global HQ for ${company.name}`}
            startOnRender={{
              payload: { companyId },
            }}
          >
            {() => {
              window.location.assign(urls.companies.businessDetails(companyId))
            }}
          </Task.Status>
        </DefaultLayout>
      )}
    </CompanyResource>
  )
}

export default RemoveGlobalHQ
