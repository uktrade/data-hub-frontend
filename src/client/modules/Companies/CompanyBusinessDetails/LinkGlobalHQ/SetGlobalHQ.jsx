import React from 'react'
import { useParams } from 'react-router-dom-v5-compat'

import { DefaultLayout } from '../../../../components'
import Task from '../../../../components/Task'
import { TASK_SET_GLOBAL_HQ, SET_GLOBAL_HQ_ID } from './state'
import urls from '../../../../../lib/urls'
import { CompanyResource } from '../../../../components/Resource'
import { buildCompanyBreadcrumbs } from '../../utils'

const SetGlobalHQ = () => {
  const { companyId, globalHqId } = useParams()
  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <DefaultLayout
          heading={'Link Global HQ'}
          pageTitle={`Link Global HQ - ${company.name} - Companies`}
          breadcrumbs={buildCompanyBreadcrumbs(
            {
              link: urls.companies.businessDetails(company.id),
              text: 'Business details',
            },
            { text: 'Link Global HQ' },
            company.name,
            companyId
          )}
          useReactRouter={false}
        >
          <Task.Status
            name={TASK_SET_GLOBAL_HQ}
            id={SET_GLOBAL_HQ_ID}
            progressMessage={`Setting Global HQ for ${company.name}`}
            startOnRender={{
              payload: { companyId, globalHqId },
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

export default SetGlobalHQ
